'use client';

import React, { useState, useEffect } from 'react';
import { CyberpunkBackground } from '../../components/effects';

export default function RiskAnalysisPage() {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRiskData = async () => {
    setLoading(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRiskData({
        volatility: 0.15,
        garchPrediction: 0.18,
        liquidityRisk: 0.08,
        settlementRisk: 0.05,
        overallRisk: 0.12
      });
    } catch (error) {
      console.error('Error fetching risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  const getRiskLevel = (score) => {
    if (score <= 0.05) return { level: '低', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (score <= 0.15) return { level: '中', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { level: '高', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative">
      <CyberpunkBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            風險分析中心
          </h1>
          <p className="text-xl text-gray-300">
            實時市場風險評估與 GARCH 波動率預測
          </p>
        </div>

        {/* 風險概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-3 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">載入風險數據中...</p>
            </div>
          ) : riskData ? (
            <>
              {/* 總體風險 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">總體風險</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className={`text-3xl font-bold ${getRiskLevel(riskData.overallRisk).color} mb-2`}>
                  {(riskData.overallRisk * 100).toFixed(1)}%
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${getRiskLevel(riskData.overallRisk).bgColor} ${getRiskLevel(riskData.overallRisk).color}`}>
                  {getRiskLevel(riskData.overallRisk).level}風險
                </div>
              </div>

              {/* 波動率風險 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">當前波動率</h3>
                  <span className="text-2xl">📈</span>
                </div>
                <div className={`text-3xl font-bold ${getRiskLevel(riskData.volatility).color} mb-2`}>
                  {(riskData.volatility * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">
                  基於歷史價格計算
                </div>
              </div>

              {/* GARCH 預測 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">GARCH 預測</h3>
                  <span className="text-2xl">🔮</span>
                </div>
                <div className={`text-3xl font-bold ${getRiskLevel(riskData.garchPrediction).color} mb-2`}>
                  {(riskData.garchPrediction * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">
                  未來24小時預測
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* 詳細風險分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 風險組成 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
              📊 風險組成分析
            </h2>
            {riskData && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">流動性風險</span>
                    <span className={getRiskLevel(riskData.liquidityRisk).color}>
                      {(riskData.liquidityRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${riskData.liquidityRisk * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">結算風險</span>
                    <span className={getRiskLevel(riskData.settlementRisk).color}>
                      {(riskData.settlementRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${riskData.settlementRisk * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">波動率風險</span>
                    <span className={getRiskLevel(riskData.volatility).color}>
                      {(riskData.volatility * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${riskData.volatility * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GARCH 模型說明 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
              🧮 GARCH 模型說明
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">模型原理</h3>
                <p className="text-sm leading-relaxed">
                  GARCH (廣義自迴歸條件異方差) 模型是一種時間序列分析方法，
                  專門用於預測金融資產的波動率。該模型考慮了波動率的時變性和叢聚性。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">計算方式</h3>
                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
                  <div className="text-blue-400">σ²(t) = ω + α·ε²(t-1) + β·σ²(t-1)</div>
                  <div className="text-gray-400 mt-2 text-xs">
                    σ²(t): 時間t的條件方差<br/>
                    ω: 常數項<br/>
                    α: ARCH係數<br/>
                    β: GARCH係數
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">應用場景</h3>
                <ul className="text-sm space-y-1">
                  <li>• 市場風險評估</li>
                  <li>• 投資組合優化</li>
                  <li>• 衍生品定價</li>
                  <li>• 風險管理決策</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 風險等級說明 */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
            🎯 風險等級指標
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="text-4xl mb-4">🟢</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">低風險</h3>
              <p className="text-green-300 text-sm">0% - 5%</p>
              <p className="text-gray-400 text-sm mt-2">
                市場穩定，適合大額交易
              </p>
            </div>

            <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="text-4xl mb-4">🟡</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">中風險</h3>
              <p className="text-yellow-300 text-sm">5% - 15%</p>
              <p className="text-gray-400 text-sm mt-2">
                市場波動適中，需謹慎操作
              </p>
            </div>

            <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="text-4xl mb-4">🔴</div>
              <h3 className="text-xl font-bold text-red-400 mb-2">高風險</h3>
              <p className="text-red-300 text-sm">15%+</p>
              <p className="text-gray-400 text-sm mt-2">
                市場劇烈波動，建議延後交易
              </p>
            </div>
          </div>
        </div>

        {/* 刷新按鈕 */}
        <div className="text-center mt-8">
          <button
            onClick={fetchRiskData}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? '更新中...' : '🔄 重新分析風險'}
          </button>
        </div>
      </div>
    </div>
  );
}