'use client';

import React from 'react';
import { CyberpunkBackground } from '../../../components/effects';

export default function TechnicalDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative">
      <CyberpunkBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            技術文件
          </h1>
          <p className="text-xl text-gray-300">
            深度技術架構與風險計算演算法說明
          </p>
        </div>

        {/* 風險計算系統 */}
        <div className="mb-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">
            🧮 風險計算系統架構
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">核心組件</h3>
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">📊 GARCH 波動率模型</h4>
                  <p className="text-gray-300 text-sm">
                    使用 Python arch 套件實現 GARCH(1,1) 模型，基於歷史價格數據預測未來波動率
                  </p>
                  <div className="mt-2 font-mono text-xs bg-gray-900 p-2 rounded">
                    <span className="text-green-400">model = arch_model(returns, vol='Garch', p=1, q=1)</span>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="text-purple-400 font-semibold mb-2">⛽ Gas 費用追蹤</h4>
                  <p className="text-gray-300 text-sm">
                    實時監控以太坊和 Solana 網路的 Gas 價格，提供精確的交易成本估算
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">💱 價格餵送服務</h4>
                  <p className="text-gray-300 text-sm">
                    整合多個價格數據源，提供 ETH、SOL、USDT 等資產的實時價格信息
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">🌉 跨鏈橋監控</h4>
                  <p className="text-gray-300 text-sm">
                    監控 Wormhole 跨鏈橋的狀態和擁堵情況，評估交易時間風險
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">風險計算流程</h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: "獲取 Raydium 報價", desc: "從 Raydium DEX 獲取真實交易報價" },
                  { step: 2, title: "計算滑點成本", desc: "基於交易量計算價格影響和滑點" },
                  { step: 3, title: "估算 Gas 費用", desc: "實時獲取以太坊和 Solana 的交易費用" },
                  { step: 4, title: "GARCH 波動率預測", desc: "使用歷史數據預測未來波動率" },
                  { step: 5, title: "時間風險評估", desc: "估算總交易時間和相關風險" },
                  { step: 6, title: "價格範圍計算", desc: "基於波動率計算可能的價格區間" },
                  { step: 7, title: "綜合風險評分", desc: "整合所有風險因子得出最終評分" }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GARCH 模型詳解 */}
        <div className="mb-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-8 text-center">
            📈 GARCH 模型技術詳解
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">數學模型</h3>
              <div className="bg-black/30 p-6 rounded-lg font-mono">
                <div className="text-center mb-6">
                  <div className="text-blue-400 text-lg mb-2">GARCH(1,1) 模型</div>
                  <div className="text-yellow-400">σ²(t) = ω + α·ε²(t-1) + β·σ²(t-1)</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div><span className="text-green-400">σ²(t)</span> = 時間 t 的條件方差</div>
                  <div><span className="text-green-400">ω</span> = 長期方差的常數項</div>
                  <div><span className="text-green-400">α</span> = ARCH 效應係數</div>
                  <div><span className="text-green-400">β</span> = GARCH 效應係數</div>
                  <div><span className="text-green-400">ε(t-1)</span> = 前期殘差項</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">實現代碼</h4>
                <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="text-gray-400"># Python 實現</div>
                  <div className="text-blue-400">import numpy as np</div>
                  <div className="text-blue-400">from arch import arch_model</div>
                  <br/>
                  <div className="text-green-400"># 計算收益率</div>
                  <div className="text-white">returns = np.diff(np.log(prices))</div>
                  <br/>
                  <div className="text-green-400"># 建立 GARCH 模型</div>
                  <div className="text-white">model = arch_model(returns, vol='Garch', p=1, q=1)</div>
                  <div className="text-white">res = model.fit(disp='off')</div>
                  <br/>
                  <div className="text-green-400"># 預測波動率</div>
                  <div className="text-white">forecast = res.forecast(horizon=1)</div>
                  <div className="text-white">predicted_vol = np.sqrt(forecast.variance.values[-1, 0])</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">模型特性</h3>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">波動率叢聚</h4>
                  <p className="text-gray-300 text-sm">
                    GARCH 模型能夠捕捉金融時間序列中的波動率叢聚現象，
                    即高波動率時期往往聚集在一起。
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">長期記憶</h4>
                  <p className="text-gray-300 text-sm">
                    模型考慮了歷史波動率對當前波動率的影響，
                    具有一定的長期記憶特性。
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                  <h4 className="text-purple-400 font-semibold mb-2">動態調整</h4>
                  <p className="text-gray-300 text-sm">
                    模型參數會根據新的市場數據動態調整，
                    確保預測結果的時效性。
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">風險量化</h4>
                  <p className="text-gray-300 text-sm">
                    提供量化的風險指標，支援精確的風險管理決策。
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">參數調整</h4>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">時間窗口：</span>
                      <span className="text-white">30 天歷史數據</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">預測期間：</span>
                      <span className="text-white">1-24 小時</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">信賴區間：</span>
                      <span className="text-white">95% (Z-score = 2)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">更新頻率：</span>
                      <span className="text-white">每小時</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 報價計算詳解 */}
        <div className="mb-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">
            💰 報價計算系統
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-4">🔄 滑點計算</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400">價格影響公式：</div>
                  <div className="font-mono text-green-400">
                    impact = (effectivePrice - initialPrice) / initialPrice
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">滑點成本：</div>
                  <div className="font-mono text-green-400">
                    slippageCost = amountIn × slippageBps / 10000
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">最小接收量：</div>
                  <div className="font-mono text-green-400">
                    minReceived = amountOut - slippageCost
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-purple-400 font-semibold mb-4">⛽ Gas 費計算</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400">以太坊 Gas 費：</div>
                  <div className="font-mono text-green-400">
                    gasCostETH = gasPrice × gasLimit / 1e9
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">轉換為 USDT：</div>
                  <div className="font-mono text-green-400">
                    gasCostUSDT = gasCostETH × ethPrice × usdtPrice
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Solana 費用：</div>
                  <div className="font-mono text-green-400">
                    solanaFeeUSDT = solanaFee × solPrice × usdtPrice
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-red-400 font-semibold mb-4">📊 價格區間</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400">調整波動率：</div>
                  <div className="font-mono text-green-400">
                    adjVol = volatility × priceEffective
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">價格下限：</div>
                  <div className="font-mono text-green-400">
                    lower = amountOut × (1 - zScore × adjVol)
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">價格上限：</div>
                  <div className="font-mono text-green-400">
                    upper = amountOut × (1 + zScore × adjVol)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API 架構 */}
        <div className="mb-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
            🔌 API 架構設計
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">後端服務</h3>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Express.js 服務器</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• TypeScript + Node.js 運行環境</li>
                    <li>• RESTful API 設計模式</li>
                    <li>• 路由模組化管理</li>
                    <li>• 錯誤處理中間件</li>
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">風險計算模組</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Python GARCH 模型服務</li>
                    <li>• 實時數據獲取服務</li>
                    <li>• 緩存機制優化</li>
                    <li>• 異步處理支援</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">API 端點</h3>
              <div className="space-y-3">
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">POST</span>
                    <span className="font-mono text-white">/api/risk</span>
                  </div>
                  <p className="text-gray-400 text-sm">獲取綜合風險評估和報價信息</p>
                  <div className="mt-2 font-mono text-xs">
                    <div className="text-gray-500">Request: {"{ amountIn: number }"}</div>
                    <div className="text-gray-500">Response: QuoteResult</div>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">POST</span>
                    <span className="font-mono text-white">/api/attest</span>
                  </div>
                  <p className="text-gray-400 text-sm">執行代幣認證流程</p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">GET</span>
                    <span className="font-mono text-white">/api/check-attestation</span>
                  </div>
                  <p className="text-gray-400 text-sm">檢查認證狀態</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 安全考量 */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">
            🔒 安全性設計
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-yellow-400 font-semibold mb-4 flex items-center">
                🛡️ 智能合約安全
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 代幣合約權限控制</li>
                <li>• 轉帳額度限制</li>
                <li>• 重入攻擊防護</li>
                <li>• 溢出保護機制</li>
              </ul>
            </div>

            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-4 flex items-center">
                🔐 API 安全
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 輸入參數驗證</li>
                <li>• 請求頻率限制</li>
                <li>• CORS 政策設定</li>
                <li>• 錯誤信息脫敏</li>
              </ul>
            </div>

            <div className="bg-black/30 p-6 rounded-lg">
              <h3 className="text-green-400 font-semibold mb-4 flex items-center">
                🌐 網路安全
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• HTTPS 強制使用</li>
                <li>• 敏感數據加密</li>
                <li>• 日誌監控系統</li>
                <li>• 異常檢測機制</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}