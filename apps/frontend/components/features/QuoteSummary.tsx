'use client';

import React, { useState } from 'react';
import { CyberpunkButton, CyberpunkCard, LoadingSpinner } from '../ui';

type Quote = {
  amountOut: number;
  priceRange: { lower: number; upper: number };
  depegRisk: { isAtRisk: boolean; oraclePrice: number; deviation: number };
  bridgeStatus: { status: string; message: string };
  totalCostUSDT: number;
  gasCostUSDT: number;
  solanaFeeUSDT: number;
  raydiumFee: number;
  minReceivedAfterSlippage: number;
  slippageCost: number;
  timeHorizon: number;
  ethTxTime: number;
  bridgeTime: number;
  solTxTime: number;
  adjustedVolatility: number;
  priceImpactManual: number;
  zScore: number;
  priceEff: number;
  priceInit: number;
  ethGasPrice: number;
  ethGasLimit: number;
  gasCostETH: number;
  volatility: number;
};

function formatCurrency(value: number, decimals = 6, currency = 'USD') {
  if (typeof value !== 'number' || isNaN(value)) return '-';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatTime(seconds: number) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '-';
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(2)}m`;
  return `${(seconds / 3600).toFixed(2)}h`;
}

function formatPercentage(value: number, decimals = 6) {
  if (typeof value !== 'number' || isNaN(value)) return '-';
  return `${(value * 100).toFixed(decimals)}%`;
}

function formatNumber(value: number, decimals = 4) {
  if (typeof value !== 'number' || isNaN(value)) return '-';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const QuoteSummary: React.FC<{ amount: string }> = ({ amount }) => {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGetQuote = async () => {
    setLoading(true);
    setError(null);
    setQuote(null);
    
    try {
      const res = await fetch('/api/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountIn: parseFloat(amount) }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText);
      }
      
      const data = await res.json();
      setQuote(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quote');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CyberpunkCard title="Analyzing Risk..." glowColor="purple" className="mt-6">
        <div className="flex justify-center py-8">
          <LoadingSpinner color="purple" text="Calculating quote..." />
        </div>
      </CyberpunkCard>
    );
  }

  if (error) {
    return (
      <CyberpunkCard title="Error" glowColor="red" className="mt-6">
        <p className="text-red-400 font-mono text-center">{error}</p>
        <div className="flex justify-center mt-4">
          <CyberpunkButton onClick={handleGetQuote} variant="danger">
            Retry
          </CyberpunkButton>
        </div>
      </CyberpunkCard>
    );
  }

  if (!quote) {
    return (
      <div className="text-center mt-6">
        <CyberpunkButton
          onClick={handleGetQuote}
          disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
          variant="secondary"
          size="lg"
        >
          📊 Get Risk Analysis
        </CyberpunkButton>
      </div>
    );
  }

  return (
    <CyberpunkCard title="Transaction Quote & Risk Analysis" glowColor="cyan" className="mt-6">
      <div className="space-y-4">
        {/* Main Quote Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 font-mono text-sm">Output Amount:</span>
              <p className="text-cyan-400 font-mono text-lg font-bold">
                {formatNumber(quote.amountOut)} USDT
              </p>
            </div>
            
            <div>
              <span className="text-gray-400 font-mono text-sm">Price Range (95%):</span>
              <p className="text-orange-400 font-mono">
                [{formatNumber(quote.priceRange.lower)} ... {formatNumber(quote.priceRange.upper)}]
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-gray-400 font-mono text-sm">Total Cost:</span>
              <p className="text-red-400 font-mono text-lg font-bold">
                {formatCurrency(quote.totalCostUSDT)}
              </p>
            </div>
            
            <div>
              <span className="text-gray-400 font-mono text-sm">Estimated Time:</span>
              <p className="text-purple-400 font-mono">
                ~{formatTime(quote.timeHorizon)}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-cyan-400 font-mono font-bold mb-3">Risk Assessment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded border ${quote.depegRisk.isAtRisk ? 'border-red-400 bg-red-400/10' : 'border-green-400 bg-green-400/10'}`}>
              <span className="text-gray-400 font-mono text-xs">USDT Depeg Risk:</span>
              <p className={`font-mono font-bold ${quote.depegRisk.isAtRisk ? 'text-red-400' : 'text-green-400'}`}>
                {quote.depegRisk.isAtRisk ? '⚠️ AT RISK' : '✅ SAFE'}
              </p>
              <p className="text-gray-400 font-mono text-xs mt-1">
                Oracle: {quote.depegRisk.oraclePrice} | Dev: {formatPercentage(quote.depegRisk.deviation)}
              </p>
            </div>

            <div className={`p-3 rounded border ${quote.bridgeStatus.status === 'operational' ? 'border-green-400 bg-green-400/10' : 'border-red-400 bg-red-400/10'}`}>
              <span className="text-gray-400 font-mono text-xs">Bridge Status:</span>
              <p className={`font-mono font-bold ${quote.bridgeStatus.status === 'operational' ? 'text-green-400' : 'text-red-400'}`}>
                {quote.bridgeStatus.status.toUpperCase()}
              </p>
              <p className="text-gray-400 font-mono text-xs mt-1">
                {quote.bridgeStatus.message}
              </p>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-cyan-400 font-mono font-bold mb-3">Cost Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 font-mono">ETH Gas Cost:</span>
              <span className="text-white font-mono">{formatCurrency(quote.gasCostUSDT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-mono">SOL Fee:</span>
              <span className="text-white font-mono">{formatCurrency(quote.solanaFeeUSDT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-mono">Raydium Fee (0.1%):</span>
              <span className="text-white font-mono">{formatNumber(quote.raydiumFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-mono">Slippage Cost:</span>
              <span className="text-white font-mono">{formatCurrency(quote.slippageCost)}</span>
            </div>
          </div>
        </div>

        {/* Advanced Details Toggle */}
        <div className="border-t border-gray-700 pt-4">
          <CyberpunkButton
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="secondary"
            size="sm"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Details
          </CyberpunkButton>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-black/40 rounded border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="text-cyan-400 font-mono font-bold mb-2">Pricing Details</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Price:</span>
                      <span className="text-white">{formatNumber(quote.priceInit, 6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Effective Price:</span>
                      <span className="text-white">{formatNumber(quote.priceEff, 6)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-cyan-400 font-mono font-bold mb-2">Risk Parameters</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Z-Score:</span>
                      <span className="text-white">{formatNumber(quote.zScore)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volatility:</span>
                      <span className="text-white">{formatPercentage(quote.volatility)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price Impact:</span>
                      <span className="text-white">{formatPercentage(quote.priceImpactManual)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CyberpunkCard>
  );
};

export { QuoteSummary };