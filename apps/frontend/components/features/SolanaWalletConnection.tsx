'use client';

import React, { useState, useEffect } from 'react';
import { CyberpunkButton, CyberpunkCard } from '../ui';

// Phantom 錢包類型定義
interface PhantomProvider {
  isPhantom: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
}

interface SolanaWalletConnectionProps {
  onWalletConnected: (publicKey: string) => void;
  onVaaSubmitted: (wrappedTokenAddress: string) => void;
  vaaData?: {
    sequence: number;
    emitterChain: number;
    emitterAddress: string;
  } | null;
  isVaaReady: boolean;
  wrappedSolAddress?: string;
  isVaaSubmitted?: boolean;
}

export const SolanaWalletConnection: React.FC<SolanaWalletConnectionProps> = ({
  onWalletConnected,
  onVaaSubmitted,
  vaaData,
  isVaaReady,
  wrappedSolAddress,
  isVaaSubmitted,
}) => {
  const [phantomWallet, setPhantomWallet] = useState<PhantomProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 檢查是否安裝了 Phantom 錢包
    const checkPhantomWallet = () => {
      const { solana } = window as any;
      if (solana && solana.isPhantom) {
        setPhantomWallet(solana);
        // 檢查是否已經連接
        if (solana.isConnected && solana.publicKey) {
          setIsConnected(true);
          setPublicKey(solana.publicKey.toString());
          onWalletConnected(solana.publicKey.toString());
        }
      }
    };

    checkPhantomWallet();

    // 監聽錢包連接事件
    const handleConnect = (publicKey: { toString: () => string }) => {
      setIsConnected(true);
      setPublicKey(publicKey.toString());
      onWalletConnected(publicKey.toString());
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setPublicKey('');
    };

    if (phantomWallet) {
      phantomWallet.on('connect', handleConnect);
      phantomWallet.on('disconnect', handleDisconnect);
    }

    return () => {
      if (phantomWallet) {
        phantomWallet.off('connect', handleConnect);
        phantomWallet.off('disconnect', handleDisconnect);
      }
    };
  }, [phantomWallet, onWalletConnected]);

  const connectWallet = async () => {
    if (!phantomWallet) {
      alert(
        '❌ Phantom 錢包未安裝\n\n' +
        '請前往 https://phantom.app/ 下載並安裝 Phantom 錢包，\n' +
        '然後重新加載此頁面。'
      );
      return;
    }

    try {
      const response = await phantomWallet.connect();
      console.log('🔗 Phantom wallet connected:', response.publicKey.toString());
    } catch (error: any) {
      console.error('Phantom wallet connection error:', error);
      if (error?.code === 4001) {
        alert('❌ 用戶拒絕連接錢包');
      } else {
        alert(`❌ 錢包連接失敗: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const disconnectWallet = async () => {
    if (phantomWallet) {
      try {
        await phantomWallet.disconnect();
        console.log('🔌 Phantom wallet disconnected');
      } catch (error: any) {
        console.error('Phantom wallet disconnect error:', error);
      }
    }
  };

  const submitVaaToSolana = async () => {
    if (!isConnected || !vaaData) {
      alert('❌ 請先連接 Solana 錢包並確保 VAA 已準備好');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 開始提交 VAA 到 Solana...');
      console.log('📋 VAA Data:', vaaData);

      // 調用 API 來提交 VAA 到 Solana
      const response = await fetch('/api/submit-vaa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaaData,
          solanaPublicKey: publicKey,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'VAA submission failed');
      }

      console.log('✅ VAA 提交成功:', result);

      if (result.wrappedTokenAddress) {
        onVaaSubmitted(result.wrappedTokenAddress);
        // 移除 alert，讓前端組件顯示結果
        console.log('✅ VAA 提交成功，Wrapped Token:', result.wrappedTokenAddress);
      } else {
        throw new Error('No wrapped token address returned');
      }

    } catch (error: any) {
      console.error('❌ VAA 提交失敗:', error);
      alert(
        '❌ VAA 提交失敗\n\n' +
        `錯誤: ${error.message}\n\n` +
        '請檢查您的 Solana 錢包連接和網絡狀態，然後重試。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 根據狀態決定標題和顏色
  const getCardTitle = () => {
    if (isVaaSubmitted && wrappedSolAddress && !wrappedSolAddress.startsWith('VAA-Ready-')) {
      return "Step 3: ✅ Solana Token Created";
    } else if (isVaaReady) {
      return "Step 3: Submit VAA to Solana";
    } else {
      return "Step 3: Connect Solana Wallet";
    }
  };

  const getCardColor = () => {
    if (isVaaSubmitted && wrappedSolAddress && !wrappedSolAddress.startsWith('VAA-Ready-')) {
      return "green";
    } else if (isVaaReady) {
      return "cyan";
    } else if (isConnected) {
      return "orange";
    } else {
      return "gray";
    }
  };

  return (
    <CyberpunkCard 
      title={getCardTitle()}
      glowColor={getCardColor()}
    >
      <div className="space-y-6">
        {!phantomWallet ? (
          <div className="p-4 bg-red-500/10 border border-red-400 rounded-lg">
            <p className="text-red-400 font-mono text-sm mb-3">
              ❌ <strong>Phantom 錢包未檢測到</strong>
            </p>
            <p className="text-gray-400 font-mono text-xs mb-4">
              需要 Phantom 錢包來連接 Solana 並提交 VAA
            </p>
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-purple-500 text-white rounded font-mono hover:bg-purple-600 transition-colors"
            >
              🔗 下載 Phantom 錢包
            </a>
          </div>
        ) : !isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-orange-500/10 border border-orange-400 rounded-lg">
              <p className="text-orange-400 font-mono text-sm mb-2">
                🔗 <strong>連接 Solana 錢包</strong>
              </p>
              <p className="text-gray-400 font-mono text-xs">
                連接您的 Phantom 錢包以提交 VAA 並創建 wrapped token
              </p>
            </div>
            
            <CyberpunkButton
              onClick={connectWallet}
              variant="primary"
              size="lg"
            >
              🔗 連接 Phantom 錢包
            </CyberpunkButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-400 rounded-lg">
              <p className="text-green-400 font-mono text-sm font-bold mb-2">
                ✅ Phantom 錢包已連接
              </p>
              <div className="bg-black/40 p-3 rounded border border-green-400/30">
                <code className="text-white font-mono text-xs break-all">
                  {publicKey}
                </code>
              </div>
            </div>

            {isVaaSubmitted && wrappedSolAddress && !wrappedSolAddress.startsWith('VAA-Ready-') ? (
              // 顯示已完成的 wrapped token
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-400 rounded-lg">
                  <p className="text-green-400 font-mono text-sm font-bold mb-4">
                    🎉 Wrapped Token 創建成功！
                  </p>
                  <div className="bg-black/40 p-4 rounded border border-green-400/30 mb-4">
                    <p className="text-green-300 font-mono text-xs mb-2">Wrapped Token on Solana:</p>
                    <code className="text-white font-mono text-sm break-all">
                      {wrappedSolAddress}
                    </code>
                  </div>
                  
                  <div className="space-y-2">
                    <a
                      href={`https://explorer.solana.com/address/${wrappedSolAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-green-500 text-white rounded font-mono hover:bg-green-600 transition-colors text-sm"
                    >
                      🔗 View on Solana Explorer
                    </a>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded">
                    <p className="text-blue-400 font-mono text-xs">
                      ✅ 您現在可以使用此 wrapped token 在 Solana 上進行交易！
                    </p>
                  </div>
                </div>
              </div>
            ) : isVaaReady && vaaData ? (
              // 顯示 VAA 準備提交
              <div className="space-y-4">
                <div className="p-4 bg-cyan-500/10 border border-cyan-400 rounded-lg">
                  <p className="text-cyan-400 font-mono text-sm font-bold mb-2">
                    🌉 VAA 準備提交
                  </p>
                  <div className="text-gray-300 font-mono text-xs space-y-1">
                    <div>Sequence: {vaaData.sequence}</div>
                    <div>Emitter Chain: {vaaData.emitterChain}</div>
                    <div>Emitter: {vaaData.emitterAddress.slice(0, 20)}...</div>
                  </div>
                </div>

                <CyberpunkButton
                  onClick={submitVaaToSolana}
                  disabled={isSubmitting}
                  variant="success"
                  size="lg"
                >
                  {isSubmitting ? '⏳ 提交中...' : '🚀 提交 VAA 到 Solana'}
                </CyberpunkButton>
              </div>
            ) : (
              // 等待 VAA 準備
              <div className="p-4 bg-gray-500/10 border border-gray-400 rounded-lg">
                <p className="text-gray-400 font-mono text-sm">
                  ⏳ 等待 VAA 準備完成...
                </p>
                <p className="text-gray-500 font-mono text-xs mt-1">
                  請先完成 Token Attestation 步驟
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={disconnectWallet}
                className="text-red-400 hover:text-red-300 font-mono text-sm underline"
              >
                🔌 斷開錢包連接
              </button>
            </div>
          </div>
        )}
      </div>
    </CyberpunkCard>
  );
};