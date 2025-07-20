'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CyberpunkButton, CyberpunkCard, LoadingSpinner } from '../ui';
import { ERC20_ABI, ERC20_BYTECODE } from '../../lib/erc20';

interface TokenMintingProps {
  walletAddress: string | null;
  tokenAddress: string | null;
  minted: boolean;
  onTokenMinted: (address: string) => void;
}

export const TokenMinting: React.FC<TokenMintingProps> = ({
  walletAddress,
  tokenAddress,
  minted,
  onTokenMinted,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const mintMyToken = async () => {
    if (!(window as any).ethereum || !walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // 確保用戶連接到正確的網絡 (Sepolia)
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

      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(ERC20_ABI, ERC20_BYTECODE, signer);
      
      console.log('📦 Deploying Mock USDT contract...');
      const contract = await factory.deploy();
      const deployTx = contract.deploymentTransaction();
      
      if (deployTx) {
        console.log("📦 Deploy transaction hash:", deployTx.hash);
        alert(`🔄 Transaction submitted! Hash: ${deployTx.hash}\nWaiting for confirmation...`);
      }

      await contract.waitForDeployment();
      const deployedAddress = await contract.getAddress();
      
      console.log('✅ Contract successfully deployed at:', deployedAddress);
      alert(`✅ Deployed Mock USDT!\nContract address: ${deployedAddress}\nNetwork: Sepolia Testnet`);
      
      onTokenMinted(deployedAddress);
    } catch (err: any) {
      console.error('Minting error:', err);
      if (err.code === 'ACTION_REJECTED') {
        alert('❌ Transaction rejected by user');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        alert('❌ Insufficient funds for gas fees');
      } else {
        alert(`❌ Failed to mint tokens: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CyberpunkCard 
      title="Step 1: Mint Mock USDT" 
      glowColor={minted ? "green" : "cyan"}
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner text="Deploying Contract..." />
        </div>
      ) : (
        <div className="w-full text-center space-y-12">
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Deploy a mock USDT token for testing purposes on Sepolia testnet
          </p>
          
          <div className="flex justify-center">
            <CyberpunkButton
              onClick={mintMyToken}
              disabled={minted || !walletAddress}
              variant={minted ? "success" : "primary"}
              size="lg"
            >
              {minted ? '✅ Minted Successfully' : '🪙 Mint Mock USDT'}
            </CyberpunkButton>
          </div>

          {tokenAddress && (
            <div className="p-8 bg-green-500/10 border border-green-400 rounded-xl max-w-4xl mx-auto">
              <p className="text-green-400 text-base font-semibold mb-4">Token Address:</p>
              <code className="text-white text-sm break-all bg-black/40 p-4 rounded-lg block">
                {tokenAddress}
              </code>
            </div>
          )}
        </div>
      )}
    </CyberpunkCard>
  );
};