'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CyberpunkButton, CyberpunkCard, CyberpunkInput, LoadingSpinner, ProgressIndicator, DebugInfo } from '../ui';

// Wormhole SDK imports for real blockchain interaction
import {
  wormhole,
  signSendWait,
  Wormhole
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

interface TokenAttestationProps {
  tokenAddress: string | null;
  minted: boolean;
  attested: boolean;
  wrappedSolAddress: string;
  onTokenAttested: (wrappedAddress: string) => void;
}

export const TokenAttestation: React.FC<TokenAttestationProps> = ({
  tokenAddress,
  minted,
  attested,
  wrappedSolAddress,
  onTokenAttested,
}) => {
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAttestation, setIsCheckingAttestation] = useState(false);
  const [attestationCheckResult, setAttestationCheckResult] = useState<any>(null);
  const [progressSteps, setProgressSteps] = useState<Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    estimatedTime?: string;
    transactionHash?: string;
    explorerUrl?: string;
  }>>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    error: any;
    transactionData?: any;
    userBalance?: string;
    tokenInfo?: any;
  } | null>(null);

  const checkAttestationStatus = async () => {
    const addressToCheck = customTokenAddress || tokenAddress;

    if (!addressToCheck) {
      alert('請輸入 token 地址或先 mint token');
      return;
    }

    setIsCheckingAttestation(true);
    setAttestationCheckResult(null);

    try {
      console.log('🔍 Checking attestation status for:', addressToCheck);

      const response = await fetch('/api/check-attestation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenAddress: addressToCheck
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Check failed');
      }

      setAttestationCheckResult(result);

      if (result.alreadyAttested) {
        console.log('✅ Token already attested:', result.wrappedTokenAddress);
        // 通知父組件 token 已經 attest
        onTokenAttested(result.wrappedTokenAddress);
      } else {
        console.log('ℹ️ Token not yet attested');
      }

    } catch (error: any) {
      console.error('❌ Check attestation error:', error);
      alert(`❌ 檢查失敗: ${error.message}`);
    } finally {
      setIsCheckingAttestation(false);
    }
  };

  const attestMyToken = async () => {
    const addressToAttest = customTokenAddress || tokenAddress;

    if (!addressToAttest) {
      alert('Enter token address or mint deployed token');
      return;
    }

    setIsLoading(true);
    setShowProgress(true);
    setDebugInfo(null); // Clear any previous debug info
    
    // Initialize progress steps
    const initialSteps = [
      {
        id: 'network',
        title: 'Network Check',
        description: 'Verifying Sepolia testnet connection',
        status: 'in_progress' as const,
      },
      {
        id: 'token',
        title: 'Token Verification',
        description: 'Validating ERC20 token contract',
        status: 'pending' as const,
      },
      {
        id: 'wormhole',
        title: 'Wormhole Initialization',
        description: 'Connecting to Wormhole SDK',
        status: 'pending' as const,
      },
      {
        id: 'transaction',
        title: 'Attestation Transaction',
        description: 'Creating and signing attestation',
        status: 'pending' as const,
        estimatedTime: '30s',
      },
      {
        id: 'vaa',
        title: 'VAA Generation',
        description: 'Waiting for Wormhole Guardians to sign',
        status: 'pending' as const,
        estimatedTime: '20-30 min',
      },
      {
        id: 'completion',
        title: 'Attestation Complete',
        description: 'Wrapped token created on Solana',
        status: 'pending' as const,
      },
    ];
    
    setProgressSteps(initialSteps);
    
    try {
      // 檢查用戶是否在正確的網絡上
      if (!(window as any).ethereum) {
        alert('Please install MetaMask');
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 11155111n) { // Sepolia testnet
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            alert('Please add Sepolia testnet to your MetaMask');
          }
          throw switchError;
        }
      }
      
      // Update progress: Network check completed
      setProgressSteps(prev => prev.map(step => 
        step.id === 'network' 
          ? { ...step, status: 'completed' as const, description: 'Connected to Sepolia testnet' }
          : step.id === 'token'
          ? { ...step, status: 'in_progress' as const }
          : step
      ));

      const evmSigner = await provider.getSigner();
      
      console.log('🚀 Starting REAL Wormhole SDK attestation for:', addressToAttest);
      
      // 驗證token合約是否存在
      try {
        const tokenContract = new ethers.Contract(
          addressToAttest,
          [
            'function name() view returns (string)', 
            'function symbol() view returns (string)',
            'function decimals() view returns (uint8)',
            'function totalSupply() view returns (uint256)'
          ],
          provider
        );
        
        // 獲取基本 token 信息
        const [tokenName, tokenSymbol, decimals, totalSupply] = await Promise.all([
          (tokenContract as any).name(),
          (tokenContract as any).symbol(),
          (tokenContract as any).decimals(),
          (tokenContract as any).totalSupply()
        ]);
        
        console.log('✅ Token contract verified:', { 
          name: tokenName, 
          symbol: tokenSymbol, 
          decimals, 
          totalSupply: totalSupply.toString() 
        });
        
        // 檢查是否是有效的 ERC20
        if (!tokenName || !tokenSymbol) {
          throw new Error('Invalid ERC20 token: missing name or symbol');
        }
        
        // 檢查是否已在 Wormhole 中註冊過
        console.log('🔍 Checking if token is already attested...');
        
        // Update progress: Token verification completed
        setProgressSteps(prev => prev.map(step => 
          step.id === 'token' 
            ? { ...step, status: 'completed' as const, description: `Verified: ${tokenName} (${tokenSymbol})` }
            : step.id === 'wormhole'
            ? { ...step, status: 'in_progress' as const }
            : step
        ));
      } catch (tokenError) {
        throw new Error(`Invalid token contract: ${(tokenError as Error).message}`);
      }
      
      // 真正的 Wormhole SDK 區塊鏈互動
      console.log('🌉 Initializing real Wormhole SDK...');
      
      try {
        // 初始化 Wormhole SDK with 真實的 platforms 和配置
        console.log('🔄 Connecting to Wormhole testnet...');
        
        // 添加 Sepolia 的 RPC 配置 - 使用正確的鏈名稱
        const wh = await wormhole('Testnet', [evm, solana], {
          chains: {
            Sepolia: {
              rpc: 'https://eth-sepolia.public.blastapi.io',
              contracts: {
                coreBridge: '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78',
                tokenBridge: '0xDB5492265f6038831E89f495670FF909aDe94bd9'
              }
            },
            Solana: {
              rpc: 'https://api.devnet.solana.com',
            }
          }
        });
        console.log('✅ Wormhole SDK initialized successfully');
        
        // Update progress: Wormhole initialization completed
        setProgressSteps(prev => prev.map(step => 
          step.id === 'wormhole' 
            ? { ...step, status: 'completed' as const, description: 'Connected to Wormhole testnet' }
            : step.id === 'transaction'
            ? { ...step, status: 'in_progress' as const }
            : step
        ));
        
        // 獲取 Sepolia 和 Solana 鏈 - 使用正確的鏈名稱
        const srcChain = wh.getChain('Sepolia');
        const dstChain = wh.getChain('Solana');
        
        console.log('🔗 Got chain contexts:', {
          source: srcChain.config.chainId,
          destination: dstChain.config.chainId
        });
        
        // 獲取 Token Bridge protocol
        const tokenBridge = await srcChain.getTokenBridge();
        console.log('🌉 Got Token Bridge instance');
        
        // Remove alert and continue with transaction
        
        console.log('📝 Creating real attestation transaction...');
        
        // 創建真實的 attestation 交易生成器
        console.log('📝 Creating attestation transaction generator...');
        
        // 將地址轉換為 Wormhole 格式 - 使用 Sepolia 而不是 Ethereum
        let tokenAddr;
        try {
          tokenAddr = Wormhole.parseAddress('Sepolia', addressToAttest);
          console.log('📍 Parsed token address:', tokenAddr);
        } catch (parseError: any) {
          throw new Error(`Invalid token address format: ${parseError.message}`);
        }
        
        // 檢查用戶帳戶餘額 (提早檢查)
        const userAddress = await evmSigner.getAddress();
        const userBalance = await provider.getBalance(userAddress);
        console.log('💰 User balance before attestation:', ethers.formatEther(userBalance), 'ETH');
        
        if (userBalance < ethers.parseEther('0.001')) {
          throw new Error(
            'Insufficient ETH balance. You need at least 0.001 ETH for gas fees.\n' +
            'Please add some Sepolia ETH from a faucet:\n' +
            '• https://sepoliafaucet.com/\n' +
            '• https://faucet.sepolia.dev/'
          );
        }
        
        let attestationTxs;
        try {
          attestationTxs = tokenBridge.createAttestation(tokenAddr);
          console.log('📝 Attestation transaction generator created successfully');
        } catch (createError: any) {
          console.error('Failed to create attestation transaction:', createError);
          throw new Error(`Failed to create attestation transaction: ${createError.message}`);
        }
        
        console.log('🔐 Preparing to sign with user wallet...');
        
        // 直接使用 ethers signer 進行簽名和發送
        console.log('📤 Executing transaction with user wallet...');
        const txidsResults: Array<{ txid: string; receipt: ethers.TransactionReceipt }> = [];
        
        // 迭代處理所有交易
        for await (const tx of attestationTxs) {
          console.log('🔐 Signing transaction with MetaMask...');
          console.log('📋 Transaction details:', tx);
          
          try {
            // 檢查交易屬性並準備發送
            const txData = tx.transaction || tx;
            console.log('📄 Transaction data to send:', txData);
            
            // 檢查用戶帳戶餘額
            const balance = await evmSigner.provider.getBalance(await evmSigner.getAddress());
            console.log('💰 User balance:', ethers.formatEther(balance), 'ETH');
            
            if (balance === 0n) {
              throw new Error('Insufficient ETH balance for gas fees. Please add some Sepolia ETH to your wallet.');
            }
            
            // 嘗試估算 gas
            try {
              const gasEstimate = await evmSigner.estimateGas(txData);
              console.log('⛽ Gas estimate:', gasEstimate.toString());
              
              // 增加 20% gas limit 以確保交易成功
              const gasLimit = gasEstimate * 120n / 100n;
              txData.gasLimit = gasLimit;
              console.log('⛽ Using gas limit:', gasLimit.toString());
            } catch (gasError: any) {
              console.warn('⚠️ Gas estimation failed, using default gas limit:', gasError.message);
              // 使用較高的默認 gas limit
              txData.gasLimit = 500000n;
            }
            
            // 使用 ethers 直接發送交易
            const txResponse = await evmSigner.sendTransaction(txData);
            
            console.log('⏳ Waiting for transaction confirmation...');
            const receipt = await txResponse.wait();
            
            if (receipt) {
              txidsResults.push({
                txid: receipt.hash,
                receipt: receipt
              });
            }
          } catch (txError: any) {
            console.error('Transaction error:', txError);
            
            if (txError.code === 'CALL_EXCEPTION') {
              throw new Error(
                'Transaction failed: The contract call was reverted. This might be because:\n' +
                '• The token contract is not valid or not deployed\n' +
                '• The token is already attested\n' +
                '• Insufficient gas or ETH balance\n' +
                '• Network congestion'
              );
            } else if (txError.code === 'INSUFFICIENT_FUNDS') {
              throw new Error('Insufficient ETH for gas fees. Please add more Sepolia ETH to your wallet.');
            } else {
              throw txError;
            }
          }
        }
        console.log('✅ Real transaction completed:', txidsResults);
        
        // Update progress: Transaction completed
        const completedTxHash = txidsResults[0]?.txid;
        setProgressSteps(prev => prev.map(step => 
          step.id === 'transaction' 
            ? { 
                ...step, 
                status: 'completed' as const, 
                description: 'Transaction confirmed on Ethereum Sepolia',
                transactionHash: completedTxHash,
                explorerUrl: completedTxHash ? `https://sepolia.etherscan.io/tx/${completedTxHash}` : undefined
              }
            : step.id === 'vaa'
            ? { ...step, status: 'in_progress' as const }
            : step
        ));
        
        const txid = txidsResults[0]?.txid;
        console.log('📋 Transaction ID:', txid);
        
        if (!txid) {
          throw new Error('No transaction ID received');
        }
        
        // Transaction sent notification handled by progress indicator
        
        // 解析交易以獲取 messages
        console.log('📖 Parsing transaction messages...');
        const msgs = await srcChain.parseTransaction(txid);
        // 避免直接 log messages 因為可能包含 BigInt
        console.log('✅ Parsed messages count:', msgs?.length || 0);
        
        // 現在使用 API 來處理 VAA 等待和 Solana 交互
        console.log('🌉 Calling VAA API to handle attestation completion...');
        
        // 在等待 VAA 之前，檢查 token 是否已經被 attest
        console.log('🔍 Checking if token is already attested...');
        
        try {
          const checkResponse = await fetch('/api/check-attestation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tokenAddress: addressToAttest
            })
          });
          
          const checkResult = await checkResponse.json();
          
          if (checkResult.success && checkResult.alreadyAttested) {
            console.log('✅ Token already attested:', checkResult.wrappedTokenAddress);
            
            // Update progress: Skip VAA and go directly to completion
            setProgressSteps(prev => prev.map(step => 
              step.id === 'vaa' 
                ? { ...step, status: 'completed' as const, description: 'Token already attested - VAA not required' }
                : step.id === 'completion'
                ? { 
                    ...step, 
                    status: 'completed' as const, 
                    description: 'Existing wrapped token found on Solana',
                    transactionHash: checkResult.wrappedTokenAddress,
                    explorerUrl: `https://explorer.solana.com/address/${checkResult.wrappedTokenAddress}?cluster=devnet`
                  }
                : step
            ));
            
            alert(
              '✅ 此合約已經 attest 過了！\n\n' +
              `Solana wrapped token: ${checkResult.wrappedTokenAddress}\n\n` +
              '您可以直接使用此 wrapped token 進行交易。'
            );
            
            onTokenAttested(checkResult.wrappedTokenAddress);
            return;
          }
        } catch (checkError) {
          console.warn('⚠️ Check attestation failed, proceeding with normal flow:', checkError);
        }
        
        // 更新進度描述，提醒用戶這是長時間等待
        // VAA 步驟不應該顯示 transaction hash，因為 VAA 是由 Guardians 簽名的過程
        setProgressSteps(prev => prev.map(step => 
          step.id === 'vaa' 
            ? { 
                ...step, 
                description: 'Waiting for Wormhole Guardians (This may take 20-30 minutes)',
                // VAA 步驟使用原始交易 hash 作為參考，但不是 VAA 本身的 hash
                transactionHash: undefined, // VAA 沒有自己的 transaction hash
                explorerUrl: completedTxHash ? `https://wormholescan.io/#/search?network=Testnet&value=${completedTxHash}` : undefined
              }
            : step
        ));
        
        try {
          // 確保只發送可序列化的數據
          const requestBody = {
            transactionHash: completedTxHash,
            tokenAddress: addressToAttest
          };
          
          console.log('📤 Sending API request with data:', requestBody);
          
          const response = await fetch('/api/attest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.error || 'VAA retrieval failed');
          }
          
          console.log('🎉 VAA API response:', result);
          
          if (result.success) {
            // Update progress: VAA completed
            setProgressSteps(prev => prev.map(step => 
              step.id === 'vaa' 
                ? { ...step, status: 'completed' as const, description: 'VAA signed by Wormhole Guardians' }
                : step.id === 'completion'
                ? { ...step, status: 'in_progress' as const }
                : step
            ));
            
            let wrappedTokenAddress;
            
            if (result.wrappedTokenAddress) {
              // 找到了 wrapped token 地址
              wrappedTokenAddress = result.wrappedTokenAddress;
              console.log('🎯 Found wrapped token:', wrappedTokenAddress);
            } else if (result.vaaReady) {
              // VAA 已準備好但需要手動提交到 Solana
              console.log('⚠️ VAA ready, requires manual Solana submission');
              
              // Update progress: Completion with manual requirement
              setProgressSteps(prev => prev.map(step => 
                step.id === 'completion' 
                  ? { 
                      ...step, 
                      status: 'completed' as const, 
                      description: 'VAA ready - Manual Solana submission required',
                      transactionHash: `VAA sequence: ${result.vaaData.sequence}`,
                      explorerUrl: 'https://docs.wormhole.com/wormhole/explore-wormhole/vaa'
                    }
                  : step
              ));
              
              alert(
                '✅ VAA Generated Successfully!\n\n' +
                'The Wormhole Guardians have signed your attestation!\n' +
                `VAA Sequence: ${result.vaaData.sequence}\n\n` +
                '🔄 Next Step: Submit VAA to Solana\n' +
                'This requires a Solana wallet or server-side processing.\n\n' +
                '💡 In a production environment:\n' +
                '• User would connect Phantom wallet\n' +
                '• Or backend would automatically submit to Solana\n' +
                '• This would create the actual wrapped SPL token\n\n' +
                'For now, the attestation process is considered successful!'
              );
              
              // 對於演示目的，我們告知用戶 VAA 已準備好並傳遞 VAA 數據
              onTokenAttested(`VAA-Ready-${result.vaaData.sequence}`, result.vaaData);
              return;
            }
          } else {
            throw new Error(result.error || 'Unknown API error');
          }
        } catch (apiError: any) {
          console.error('❌ VAA API error:', apiError);
          
          // Update progress: VAA failed
          setProgressSteps(prev => prev.map(step => 
            step.id === 'vaa' 
              ? { 
                  ...step, 
                  status: 'error' as const, 
                  description: 'VAA Generation Failed: ' + (apiError.message || 'Unknown error')
                }
              : step
          ));
          
          throw new Error(
            'VAA Generation Failed!\n\n' +
            'Error: ' + (apiError.message || 'Unknown error') + '\n\n' +
            'This can happen due to:\n' +
            '• Network congestion\n' +
            '• Guardian downtime\n' +
            '• Invalid transaction format\n' +
            '• API timeout\n\n' +
            'Please try again later or check the transaction on Etherscan.\n' +
            'Transaction Hash: ' + completedTxHash
          );
        }
        
        // 如果有真實的 wrapped token 地址從 API 返回
        if (wrappedTokenAddress) {
          // Update progress: Completion
          setProgressSteps(prev => prev.map(step => 
            step.id === 'completion' 
              ? { 
                  ...step, 
                  status: 'completed' as const, 
                  description: 'Wrapped token found on Solana',
                  transactionHash: wrappedTokenAddress,
                  explorerUrl: `https://explorer.solana.com/address/${wrappedTokenAddress}?cluster=devnet`
                }
              : step
          ));
          
          onTokenAttested(wrappedTokenAddress);
        }
        
      } catch (wormholeError: any) {
        console.error('Real Wormhole SDK error:', wormholeError);
        console.error('Error details:', {
          message: wormholeError.message,
          code: wormholeError.code,
          stack: wormholeError.stack,
          name: wormholeError.name
        });
        
        let errorMsg = wormholeError.message || 'Unknown error';
        let suggestions = '';
        
        // 根據錯誤類型提供具體建議
        if (wormholeError.code === 'ACTION_REJECTED' || wormholeError.message?.includes('rejected')) {
          suggestions = '• User rejected the transaction\n• Please try again and confirm in MetaMask';
        } else if (wormholeError.message?.includes('insufficient funds')) {
          suggestions = '• Insufficient ETH for gas fees\n• Please add more ETH to your wallet';
        } else if (wormholeError.message?.includes('network')) {
          suggestions = '• Network connectivity issues\n• Check your internet connection\n• Try switching MetaMask networks';
        } else if (wormholeError.message?.includes('gas')) {
          suggestions = '• Gas estimation failed\n• Try increasing gas limit\n• Check network congestion';
        } else {
          suggestions = '• Unknown error occurred\n• Check console for details\n• Try refreshing the page';
        }
        
        // Update progress: Error state
        setProgressSteps(prev => prev.map(step => 
          step.status === 'in_progress' 
            ? { ...step, status: 'error' as const, description: `Error: ${errorMsg}` }
            : step
        ));
        
        // Capture debug information
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const balance = await provider.getBalance(await signer.getAddress());
          setDebugInfo({
            error: wormholeError,
            userBalance: ethers.formatEther(balance) + ' ETH',
            tokenInfo: {
              address: addressToAttest,
              name: 'Unknown',
              symbol: 'Unknown'
            }
          });
        } catch {
          setDebugInfo({
            error: wormholeError,
            userBalance: 'Unknown',
            tokenInfo: {
              address: addressToAttest,
              name: 'Unknown',
              symbol: 'Unknown'
            }
          });
        }
        
        throw wormholeError; // Re-throw to trigger outer catch
      }

    } catch (err: any) {
      console.error('Attestation error:', err);
      if (err.code === 'ACTION_REJECTED') {
        alert('❌ Transaction rejected by user');
      } else {
        alert(`❌ Attestation failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
      // Keep progress visible for a few seconds after completion
      if (progressSteps.every(step => step.status === 'completed' || step.status === 'error')) {
        setTimeout(() => setShowProgress(false), 5000);
      }
    }
  };

  return (
    <CyberpunkCard 
      title="Step 2: Attest to Bridge" 
      glowColor={attested ? "green" : "purple"}
    >
      {showProgress && progressSteps.length > 0 && (
        <div className="mb-8">
          <ProgressIndicator steps={progressSteps} />
        </div>
      )}
      
      {isLoading && !showProgress ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner color="purple" text="Attesting Token..." />
        </div>
      ) : !showProgress ? (
        <div className="w-full space-y-10">
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-8 text-center max-w-4xl mx-auto">
            <h4 className="text-purple-300 text-xl font-bold mb-4">
              🌉 Real Token Attestation
            </h4>
            <p className="text-gray-300 text-base mb-4 leading-relaxed">
              Creates a real wrapped token on Solana using the official Wormhole protocol. 
              Involves real transactions, gas fees, and VAA signatures.
            </p>
            <p className="text-green-400 text-sm font-semibold">
              ✅ Real blockchain interaction: Sepolia → Solana Devnet via Wormhole
            </p>
          </div>

          <CyberpunkInput
            label="Token Address"
            placeholder="0x..."
            value={customTokenAddress}
            onChange={(e) => {
              setCustomTokenAddress(e.target.value);
              setAttestationCheckResult(null); // Clear previous check result when address changes
            }}
            glowColor="purple"
          />

          {/* Check Attestation Status Section */}
          {(customTokenAddress || minted) && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <CyberpunkButton
                  onClick={checkAttestationStatus}
                  disabled={isCheckingAttestation}
                  variant="primary"
                  size="md"
                >
                  {isCheckingAttestation ? '🔍 檢查中...' : '🔍 檢查 Attestation 狀態'}
                </CyberpunkButton>
                
                <CyberpunkButton
                  onClick={attestMyToken}
                  disabled={!(customTokenAddress || minted) || (attestationCheckResult?.alreadyAttested)}
                  variant={attested ? "success" : "secondary"}
                  size="md"
                >
                  {attested ? '✅ Attested Successfully' : '🌉 Start Attestation Process'}
                </CyberpunkButton>
              </div>
              
              {!attested && (customTokenAddress || minted) && !attestationCheckResult?.alreadyAttested && (
                <div className="text-center bg-blue-500/10 border border-blue-400/20 rounded-xl p-6 max-w-2xl mx-auto">
                  <p className="text-blue-400 text-base font-semibold">
                    💡 Real Wormhole SDK Integration
                  </p>
                  <p className="text-gray-300 text-sm mt-2">
                    You will sign transactions in MetaMask for real blockchain interactions
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Attestation Check Result */}
          {attestationCheckResult && (
            <div className="mt-6">
              {attestationCheckResult.alreadyAttested ? (
                <div className="p-4 bg-green-500/10 border border-green-400 rounded-lg">
                  <p className="text-green-400 font-mono text-sm font-bold mb-3">
                    ✅ 此合約已經 attest 過了！
                  </p>
                  <div className="bg-black/40 p-4 rounded border border-green-400/30 mb-4">
                    <p className="text-green-300 font-mono text-xs mb-2">Solana wrapped token:</p>
                    <code className="text-white font-mono text-sm break-all">
                      {attestationCheckResult.wrappedTokenAddress}
                    </code>
                  </div>
                  
                  <div className="space-y-2">
                    <a
                      href={`https://explorer.solana.com/address/${attestationCheckResult.wrappedTokenAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-green-500 text-white rounded font-mono hover:bg-green-600 transition-colors text-sm"
                    >
                      🔗 View on Solana Explorer
                    </a>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded">
                    <p className="text-blue-400 font-mono text-xs">
                      您可以直接使用此 wrapped token 進行交易，無需重新 attest。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-cyan-500/10 border border-cyan-400 rounded-lg">
                  <p className="text-cyan-400 font-mono text-sm font-bold mb-2">
                    ℹ️ Token 尚未 Attest
                  </p>
                  <p className="text-gray-300 font-mono text-xs">
                    此 token 尚未在 Solana 上創建 wrapped version。您可以點擊上方按鈕開始 attestation 流程。
                  </p>
                </div>
              )}
            </div>
          )}

          {wrappedSolAddress && (
            <div className="p-6 bg-purple-500/10 border border-purple-400 rounded-lg">
              {wrappedSolAddress.startsWith('VAA-Ready-') ? (
                <>
                  <p className="text-cyan-400 font-mono text-base font-bold mb-4">
                    🌉 VAA Generated Successfully!
                  </p>
                  <div className="bg-black/40 p-4 rounded border border-cyan-400/30 mb-4">
                    <div className="text-cyan-300 font-mono text-sm mb-2">
                      VAA Sequence: <span className="text-white">{wrappedSolAddress.replace('VAA-Ready-', '')}</span>
                    </div>
                    <div className="text-cyan-300 font-mono text-sm">
                      Status: <span className="text-yellow-400">Ready for Solana Submission</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-400/30 rounded">
                      <p className="text-yellow-400 font-mono text-sm font-bold mb-2">
                        🔄 下一步：提交到 Solana
                      </p>
                      <p className="text-gray-300 font-mono text-xs">
                        VAA 已由 Wormhole Guardians 簽署，現在需要提交到 Solana 以創建實際的 wrapped token。
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded">
                      <p className="text-blue-400 font-mono text-sm font-bold mb-2">
                        💡 生產環境中的完整流程：
                      </p>
                      <ul className="text-gray-300 font-mono text-xs space-y-1">
                        <li>• 用戶連接 Phantom 錢包</li>
                        <li>• 系統自動提交 VAA 到 Solana</li>
                        <li>• 創建真實的 SPL wrapped token</li>
                        <li>• 用戶可以使用 wrapped token 進行交易</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-purple-400 font-mono text-base font-bold mb-4">
                    🪙 Wrapped Token on Solana:
                  </p>
                  <div className="bg-black/40 p-4 rounded border border-purple-400/30 mb-4">
                    <code className="text-white font-mono text-sm break-all">
                      {wrappedSolAddress}
                    </code>
                  </div>
                  
                  <div className="space-y-2">
                    <a
                      href={`https://explorer.solana.com/address/${wrappedSolAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-purple-400 hover:text-purple-300 font-mono text-sm underline mr-4"
                    >
                      🔗 View on Solana Explorer
                    </a>
                    
                    <a
                      href={`https://wormholescan.io/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-purple-400 hover:text-purple-300 font-mono text-sm underline"
                    >
                      🌉 View on Wormhole Explorer
                    </a>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-400/30 rounded">
                    <p className="text-green-400 font-mono text-xs">
                      ✅ 注意：這是 Solana Devnet 上的測試 token。真實的 attestation 會創建可在 Solana mainnet 上使用的 wrapped token。
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          
        </div>
      ) : null}
      
      {debugInfo && (
        <DebugInfo
          error={debugInfo.error}
          transactionData={debugInfo.transactionData}
          userBalance={debugInfo.userBalance}
          tokenInfo={debugInfo.tokenInfo}
        />
      )}
    </CyberpunkCard>
  );
};