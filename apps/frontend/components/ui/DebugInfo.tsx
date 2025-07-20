'use client';

import React, { useState } from 'react';

interface DebugInfoProps {
  error: any;
  transactionData?: any;
  userBalance?: string;
  tokenInfo?: any;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  error,
  transactionData,
  userBalance,
  tokenInfo,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSuggestions = (error: any) => {
    const suggestions = [];
    
    if (error.code === 'CALL_EXCEPTION') {
      suggestions.push('🔍 The transaction was reverted by the smart contract');
      suggestions.push('💡 This usually means:');
      suggestions.push('   • Token is already attested on Wormhole');
      suggestions.push('   • Token contract is not a valid ERC20');
      suggestions.push('   • Insufficient gas or network issues');
    }
    
    if (error.message?.includes('insufficient funds') || error.code === 'INSUFFICIENT_FUNDS') {
      suggestions.push('💰 You need more Sepolia ETH for gas fees');
      suggestions.push('🚰 Get free Sepolia ETH from faucets:');
      suggestions.push('   • https://sepoliafaucet.com/');
      suggestions.push('   • https://faucet.sepolia.dev/');
    }
    
    if (error.message?.includes('gas')) {
      suggestions.push('⛽ Gas estimation failed');
      suggestions.push('💡 Try:');
      suggestions.push('   • Refreshing the page and trying again');
      suggestions.push('   • Checking if the token is already attested');
      suggestions.push('   • Using a different token contract');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('🔄 General troubleshooting:');
      suggestions.push('   • Refresh the page and try again');
      suggestions.push('   • Check your MetaMask connection');
      suggestions.push('   • Ensure you\'re on Sepolia testnet');
      suggestions.push('   • Verify the token contract address');
    }
    
    return suggestions;
  };

  return (
    <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">❌</span>
        <h3 className="text-red-400 font-mono text-lg font-bold">
          Attestation Failed
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-red-300 font-mono text-sm mb-2">
            <strong>Error:</strong> {error.message || 'Unknown error occurred'}
          </p>
        </div>
        
        <div>
          <h4 className="text-red-400 font-mono text-sm font-bold mb-2">
            💡 Suggestions:
          </h4>
          <div className="text-red-300 font-mono text-xs space-y-1">
            {getSuggestions(error).map((suggestion, index) => (
              <div key={index}>{suggestion}</div>
            ))}
          </div>
        </div>
        
        {(userBalance || tokenInfo) && (
          <div>
            <h4 className="text-red-400 font-mono text-sm font-bold mb-2">
              📊 Current Status:
            </h4>
            <div className="text-red-300 font-mono text-xs space-y-1">
              {userBalance && <div>💰 ETH Balance: {userBalance}</div>}
              {tokenInfo && (
                <>
                  <div>🪙 Token: {tokenInfo.name} ({tokenInfo.symbol})</div>
                  <div>📍 Address: {tokenInfo.address}</div>
                </>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-red-400 hover:text-red-300 font-mono text-xs underline"
        >
          {showDetails ? '🔼 Hide' : '🔽 Show'} Technical Details
        </button>
        
        {showDetails && (
          <div className="bg-black/40 border border-red-400/20 rounded p-4">
            <h4 className="text-red-400 font-mono text-xs font-bold mb-2">
              🔧 Technical Details:
            </h4>
            <div className="text-red-300 font-mono text-xs space-y-2">
              <div>
                <strong>Error Code:</strong> {error.code || 'N/A'}
              </div>
              <div>
                <strong>Error Name:</strong> {error.name || 'N/A'}
              </div>
              {transactionData && (
                <div>
                  <strong>Transaction Data:</strong>
                  <pre className="mt-1 text-xs overflow-x-auto">
                    {JSON.stringify(transactionData, null, 2)}
                  </pre>
                </div>
              )}
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};