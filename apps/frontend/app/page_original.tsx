'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CyberpunkBackground } from '../components/effects';
import {
  WalletConnection,
  TokenMinting,
  TokenAttestation,
  SolanaWalletConnection,
  TransferForm,
  QuoteSummary,
} from '../components/features';
import { DiagnosticOverlay } from '../components/DiagnosticOverlay';
// SDK imports removed due to version conflicts - using simplified approach
import issuerRisk from './issuerRisk.json';

interface IssuerRiskInfo {
  symbol: string;
  level: string;
  score: number;
  reportUrl: string;
}

function IssuerRiskSection({ symbol }: { symbol: string }) {
  const risk = issuerRisk.find((r: IssuerRiskInfo) => r.symbol === symbol);

  if (!risk) return <div>Couldn't find the risk information for {symbol}</div>;

  return (
    <div className="p-4 bg-red-500/10 border border-red-400 rounded-lg">
      <h2 className="text-red-400 font-mono font-bold text-lg mb-2">
        {risk.symbol} Risk Level: {risk.level}
      </h2>
      <p className="text-white font-mono mb-3">Risk Score: {risk.score}</p>
      <a href={risk.reportUrl} download>
        <button className="px-4 py-2 bg-red-500 text-white rounded font-mono hover:bg-red-600 transition-colors">
          Download Risk Report
        </button>
      </a>
    </div>
  );
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [minted, setMinted] = useState(false);
  const [attested, setAttested] = useState(false);
  const [wrappedSolAddress, setWrappedSolAddress] = useState<string>('');
  const [solanaWalletAddress, setSolanaWalletAddress] = useState<string>('');
  const [vaaData, setVaaData] = useState<any>(null);
  const [isVaaReady, setIsVaaReady] = useState(false);
  const [isVaaSubmitted, setIsVaaSubmitted] = useState(false);
  const [showRiskInfo, setShowRiskInfo] = useState(false);
  const [showQuoteUI, setShowQuoteUI] = useState(false);
  const [loading, setLoading] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  const handleTokenMinted = (address: string) => {
    setTokenAddress(address);
    setMinted(true);
  };

  const handleTokenAttested = (wrappedAddress: string, vaaInfo?: any) => {
    setWrappedSolAddress(wrappedAddress);
    setAttested(true);
    
    // If VAA-Ready state, set VAA data
    if (wrappedAddress.startsWith('VAA-Ready-') && vaaInfo) {
      setVaaData(vaaInfo);
      setIsVaaReady(true);
    }
  };

  const handleSolanaWalletConnected = (publicKey: string) => {
    setSolanaWalletAddress(publicKey);
  };

  const handleVaaSubmitted = (wrappedTokenAddress: string) => {
    setWrappedSolAddress(wrappedTokenAddress);
    setIsVaaReady(false); // VAA 已提交，不再需要
    setIsVaaSubmitted(true); // 標記 VAA 已提交
  };

  const handleShowRiskReport = () => {
    setShowRiskInfo(true);
  };

  const handleShowQuote = () => {
    setShowQuoteUI(true);
  };

  const handleTransfer = async (formData: any) => {
    setLoading('transfer');
    try {
      // 驗證必要字段
      if (!formData.erc20Address || !formData.amount || !formData.toAccount) {
        alert('❌ Please fill in all required fields!');
        return;
      }

      if (!(window as any).ethereum) {
        alert('❌ Please install MetaMask');
        return;
      }

      // 確保用戶在正確的網絡上
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 11155111n) { // Sepolia testnet
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }

      console.log('🚀 Starting cross-chain transfer...');
      
      // 簡化版本 - 直接處理ERC20代幣轉賬
      
      // 為了解決複雜的SDK版本問題，我們現在使用簡化的方法
      // 直接與MetaMask交互進行代幣轉賬
      
      const evmSigner = await provider.getSigner();
      const userAddress = await evmSigner.getAddress();
      
      console.log('📋 Transfer details:', {
        tokenAddress: formData.erc20Address,
        amount: formData.amount,
        from: userAddress,
        to: formData.toAccount
      });

      // 創建 ERC20 合約實例來處理轉賬
      const tokenContract = new ethers.Contract(
        formData.erc20Address,
        [
          'function transfer(address to, uint256 amount) external returns (bool)',
          'function balanceOf(address owner) external view returns (uint256)',
          'function decimals() external view returns (uint8)',
          'function approve(address spender, uint256 amount) external returns (bool)'
        ],
        evmSigner
      );
      
      // 獲取token的decimals和余額
      let decimals = 6; // 預設decimals
      let transferAmount: bigint;
      
      try {
        // 嘗試獲取實際decimals，如果失敗則使用預設值
        try {
          decimals = await (tokenContract as any).decimals();
        } catch {
          console.log('⚠️ Using default decimals (6) as contract call failed');
        }
        
        transferAmount = ethers.parseUnits(formData.amount, decimals);
        
        // 檢查余額
        try {
          const balance = await (tokenContract as any).balanceOf(userAddress);
          if (balance < transferAmount) {
            throw new Error('Insufficient token balance');
          }
          console.log('✅ Token validation passed:', { decimals, balance: balance.toString(), transferAmount: transferAmount.toString() });
        } catch {
          console.log('⚠️ Skipping balance check as contract call failed');
        }
      } catch (validationError) {
        throw new Error(`Token validation failed: ${(validationError as Error).message}`);
      }
      
      console.log('💸 Initiating token transfer...');
      alert('💸 Please approve the token transfer in your wallet...');
      
      // 這裡我們模擬一個跨鏈轉賬流程
      // 在實際應用中，這裡會先approve代幣給Wormhole合約再轉賬
      
      // 模擬一個簡單的轉賬操作（為了演示）
      const mockWormholeAddress = '0x' + '1'.repeat(40); // 模擬Wormhole地址
      
      try {
        // 模擬approve交易（使用上面計算的transferAmount）
        const approveTx = await (tokenContract as any).approve(mockWormholeAddress, transferAmount);
        console.log('📋 Approve transaction sent:', approveTx.hash);
        
        alert(
          `🔄 Token approval submitted!\n\n` +
          `Transaction Hash: ${approveTx.hash}\n` +
          `Waiting for confirmation...`
        );
        
        // 等待交易確認
        await approveTx.wait();
        
        // 模擬跨鏈轉賬成功
        const mockDestTxId = '0x' + Math.random().toString(16).substring(2).padStart(64, '0');
        
        alert(
          `✅ Cross-chain transfer simulated successfully!\n\n` +
          `Ethereum Approval TX: ${approveTx.hash}\n` +
          `Amount: ${formData.amount} tokens\n` +
          `Destination: ${formData.toAccount}\n` +
          `Simulated Solana TX: ${mockDestTxId}\n\n` +
          `Note: This is a demo. In production, use actual Wormhole protocol.`
        );
        
      } catch (contractError: any) {
        console.error('Contract interaction error:', contractError);
        throw new Error(`Token contract interaction failed: ${contractError.message}`);
      }
      
      // 提供用戶手動完成跨鏈轉賬的選項
      const usePortal = confirm(
        '🌉 Want to try actual cross-chain transfer?\n\n' +
        'Click OK to open Wormhole Portal for real cross-chain transfer,\n' +
        'or Cancel to complete the demo.'
      );
      
      if (usePortal) {
        const portalUrl = `https://www.portalbridge.com/#/transfer?sourceChain=ethereum&targetChain=solana&token=${formData.erc20Address}`;
        window.open(portalUrl, '_blank');
      }
      
      console.log('🎉 Transfer process completed!');
      
    } catch (err: any) {
      console.error('Transfer Error:', err);
      if (err?.code === 'ACTION_REJECTED' || err?.code === 4001) {
        alert('❌ Transaction rejected by user');
      } else if (err?.code === 'INSUFFICIENT_FUNDS' || err?.message?.includes('insufficient funds')) {
        alert('❌ Insufficient funds for gas fees or token balance');
      } else {
        alert(`❌ Transfer failed: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setLoading('');
    }
  };

  return (
    <div 
      className="min-h-screen relative bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950"
      style={{
        display: 'grid',
        placeItems: 'center',
        width: '100vw',
        minHeight: '100vh'
      }}
    >
      {/* Enhanced Background Effects */}
      <CyberpunkBackground />
      
      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Professional gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      
      {/* Main Content */}
      <div 
        className="relative z-10 w-full"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        <div 
          className="w-full px-8 lg:px-12 py-16"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto'
          }}
        >
          {/* Professional Header */}
          <header 
            className="w-full text-center mb-24"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                HARMONIZATION
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90">
                PLATFORM
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-6">
                Enterprise-Grade Cross-Chain Infrastructure
              </p>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                Secure, scalable, and compliant tokenization across multiple blockchain networks with real-time risk assessment and regulatory compliance.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-medium">BLOCKCHAIN INTEGRATED</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-medium">REAL-TIME ANALYTICS</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-medium">ENTERPRISE SECURITY</span>
              </div>
            </div>
          </header>

          {/* Main Flow - 確保每個組件間有足夠間距 */}
          <div 
            className="w-full"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '1152px',
              margin: '0 auto'
            }}
          >
            <div 
              className="w-full space-y-16"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: '4rem'
              }}
            >
            {/* Wallet Connection */}
            <div className="w-full max-w-4xl center-layout">
              <WalletConnection
                walletAddress={walletAddress}
                onWalletConnected={handleWalletConnected}
              />
            </div>

            {/* Token Minting */}
            {walletAddress && (
              <div className="w-full max-w-4xl center-layout">
                <TokenMinting
                  walletAddress={walletAddress}
                  tokenAddress={tokenAddress}
                  minted={minted}
                  onTokenMinted={handleTokenMinted}
                />
              </div>
            )}

            {/* Token Attestation */}
            {walletAddress && (
              <div className="w-full max-w-4xl center-layout">
                <TokenAttestation
                  tokenAddress={tokenAddress}
                  minted={minted}
                  attested={attested}
                  wrappedSolAddress={wrappedSolAddress}
                  onTokenAttested={handleTokenAttested}
                />
              </div>
            )}

            {/* Solana Wallet Connection & VAA Submission */}
            {walletAddress && (
              <div className="w-full max-w-4xl center-layout">
                <SolanaWalletConnection
                  onWalletConnected={handleSolanaWalletConnected}
                  onVaaSubmitted={handleVaaSubmitted}
                  vaaData={vaaData}
                  isVaaReady={isVaaReady}
                  wrappedSolAddress={wrappedSolAddress}
                  isVaaSubmitted={isVaaSubmitted}
                />
              </div>
            )}

            {/* Transfer Section */}
            {walletAddress && (
              <div className="w-full max-w-5xl">
                {/* Professional Separation Line */}
                <div className="relative my-32">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="px-8 py-4 bg-gradient-to-r from-blue-950/80 to-purple-950/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl">
                      <span className="text-lg font-semibold text-blue-400 tracking-wide">
                        Transfer Protocol
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-16">
                  <TransferForm
                    onTransfer={handleTransfer}
                    onShowRiskReport={handleShowRiskReport}
                    onShowQuote={handleShowQuote}
                    onAmountChange={setTransferAmount}
                    isLoading={loading === 'transfer'}
                  />
                </div>

                {/* Risk Report Modal */}
                {showRiskInfo && (
                  <div className="mt-16 mb-16">
                    <IssuerRiskSection symbol="USDT" />
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setShowRiskInfo(false)}
                        className="px-8 py-4 bg-gray-600 text-white rounded-lg font-mono hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Quote UI */}
                {showQuoteUI && (
                  <div className="mt-16 mb-16">
                    <QuoteSummary amount={transferAmount} />
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          {/* Professional Footer */}
          <footer className="mt-40 py-20 text-center border-t border-gray-700/50">
            <div className="max-w-6xl mx-auto px-8">
              <div className="mb-8">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Enterprise Infrastructure
                </h4>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Powered by industry-leading blockchain protocols and security frameworks
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl">
                  <div className="text-blue-400 text-2xl mb-3">🌉</div>
                  <h5 className="text-white font-semibold mb-2">Wormhole Bridge</h5>
                  <p className="text-gray-400 text-sm">Cross-chain interoperability</p>
                </div>
                <div className="p-6 bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl">
                  <div className="text-purple-400 text-2xl mb-3">⚡</div>
                  <h5 className="text-white font-semibold mb-2">Real-time Analytics</h5>
                  <p className="text-gray-400 text-sm">Live risk assessment</p>
                </div>
                <div className="p-6 bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl">
                  <div className="text-emerald-400 text-2xl mb-3">🔒</div>
                  <h5 className="text-white font-semibold mb-2">Enterprise Security</h5>
                  <p className="text-gray-400 text-sm">Military-grade encryption</p>
                </div>
              </div>
              
              <div className="text-gray-500 text-sm">
                <p>© 2024 Harmonization Platform. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Diagnostic Overlay for debugging layout issues */}
      <DiagnosticOverlay />
    </div>
  );
}