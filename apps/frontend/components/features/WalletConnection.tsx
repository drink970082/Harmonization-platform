'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CyberpunkButton, CyberpunkCard } from '../ui';

interface WalletConnectionProps {
  walletAddress: string | null;
  onWalletConnected: (address: string) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  walletAddress,
  onWalletConnected,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('Please Install MetaMask First');
      return;
    }

    setIsConnecting(true);
    try {
      await (window as any).ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      onWalletConnected(address);
      alert(`✅ Connected to wallet: ${address}`);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (walletAddress) {
    return (
      <CyberpunkCard title="Wallet Connected" glowColor="green">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400 font-mono text-sm mb-2">Connected Address:</p>
            <p className="text-white font-mono text-xs break-all">
              {walletAddress}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-mono text-sm">ONLINE</span>
          </div>
        </div>
      </CyberpunkCard>
    );
  }

  return (
    <CyberpunkCard title="Wallet Connection" glowColor="cyan">
      <div className="w-full text-center space-y-12">
        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
          Connect your MetaMask wallet to access the harmonization platform and begin cross-chain token operations
        </p>
        <div className="flex justify-center">
          <CyberpunkButton
            onClick={connectWallet}
            loading={isConnecting}
            variant="primary"
            size="lg"
          >
            {isConnecting ? 'Connecting...' : '🔌 Connect Wallet'}
          </CyberpunkButton>
        </div>
      </div>
    </CyberpunkCard>
  );
};