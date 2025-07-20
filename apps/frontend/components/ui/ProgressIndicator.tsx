'use client';

import React from 'react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  estimatedTime?: string;
  transactionHash?: string;
  explorerUrl?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: string;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  const getStepIcon = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        );
      case 'error':
        return (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-500" />
        );
    }
  };

  const getStepColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500/30 bg-emerald-500/5';
      case 'in_progress':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
      default:
        return 'border-gray-600/30 bg-gray-600/5';
    }
  };

  const getProgressBarColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-600';
    }
  };

  const getTextColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'in_progress':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-white/[0.02] backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 ${className}`}>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-purple-400 mb-2">
          Processing Status
        </h3>
        <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
      </div>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className="absolute left-3 top-12 w-0.5 h-16 bg-gradient-to-b from-gray-600 via-gray-700 to-transparent"></div>
            )}
            
            <div className={`flex items-start gap-6 p-6 border rounded-xl transition-all duration-500 hover:scale-[1.01] ${getStepColor(step.status)}`}>
              {/* Step icon */}
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step.status)}
              </div>
              
              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-lg font-semibold ${getTextColor(step.status)}`}>
                    {step.title}
                  </h4>
                  {step.estimatedTime && step.status === 'in_progress' && (
                    <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                      ~{step.estimatedTime}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{step.description}</p>
                
                {/* Transaction hash and explorer link */}
                {step.transactionHash && (
                  <div className="mt-6 p-5 bg-black/40 border border-gray-600/30 rounded-xl">
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-blue-400">
                        {step.id === 'completion' ? 'Token Address:' : 
                         step.id === 'vaa' ? 'Transaction Hash:' : 'Transaction Hash:'}
                      </span>
                      <div className="mt-2 p-3 bg-black/60 border border-gray-700 rounded-lg">
                        <code className="text-sm text-gray-200 break-all font-mono">
                          {step.transactionHash}
                        </code>
                      </div>
                    </div>
                    
                    {/* Special VAA tracking info */}
                    {step.id === 'vaa' && step.status === 'in_progress' && (
                      <div className="mb-4 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                        <p className="text-sm font-semibold text-purple-300 mb-2">
                          💡 VAA 生成追蹤
                        </p>
                        <p className="text-sm text-gray-400 mb-3">
                          需要 15+ 個 Guardian 確認。您可以在以下網站追蹤進度：
                        </p>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div>📍 Etherscan: 查看原始交易狀態</div>
                          <div>🌉 Wormhole: 追蹤 VAA 和 Guardian 確認進度</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Multiple explorer links for VAA */}
                    {step.id === 'vaa' && step.transactionHash && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${step.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            🔍 View on Etherscan
                          </a>
                          <a
                            href={`https://wormholescan.io/#/search?network=Testnet&value=${step.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            🌉 Search on Wormholescan
                          </a>
                          <a
                            href={`https://docs.wormhole.com/wormhole/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            📚 Wormhole Docs
                          </a>
                        </div>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                          <p className="text-sm font-semibold text-yellow-300 mb-2">
                            💡 故障排除提示
                          </p>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>1. 先在 Etherscan 確認交易成功</div>
                            <div>2. 複製交易 hash 到 VAA Explorer 手動查詢</div>
                            <div>3. 或等待約 20-30 分鐘讓 VAA 自動完成</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Regular explorer links */}
                    {step.id !== 'vaa' && step.explorerUrl && (
                      <a
                        href={step.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all duration-300 hover:scale-105"
                      >
                        🔍 {step.id === 'completion' ? 'View on Solana Explorer' : 'View on Etherscan Explorer'}
                      </a>
                    )}
                  </div>
                )}
                
                {/* Progress bar for in_progress steps */}
                {step.status === 'in_progress' && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${getProgressBarColor(step.status)} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: step.id === 'vaa' ? '15%' : '70%',
                        }}
                      ></div>
                    </div>
                    {step.id === 'vaa' && (
                      <p className="text-sm text-gray-400 mt-2">
                        等待 Guardian 確認中... (約需 20-30 分鐘)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-gray-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 font-medium">
              Progress: {steps.filter(s => s.status === 'completed').length}/{steps.length} steps
            </span>
            <div className="w-32 bg-gray-800 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          {steps.some(s => s.status === 'in_progress') && (
            <span className="text-blue-400 animate-pulse font-medium">
              Processing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};