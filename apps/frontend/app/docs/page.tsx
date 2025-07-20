'use client';

import React from 'react';
import { CyberpunkBackground } from '../../components/effects';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative">
      <CyberpunkBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            平台文件
          </h1>
          <p className="text-xl text-gray-300">
            Harmonization Platform 技術文件與操作指南
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 系統架構 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
              🏗️ 系統架構
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">前端 (Frontend)</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Next.js 15.3.0 - React 框架</li>
                  <li>• TailwindCSS - 樣式框架</li>
                  <li>• TypeScript - 類型安全</li>
                  <li>• Ethers.js - 以太坊互動</li>
                  <li>• Solana Web3.js - Solana 互動</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">後端 (Backend)</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Node.js - 伺服器運行環境</li>
                  <li>• TypeScript - 類型安全的後端</li>
                  <li>• Python - 風險計算模組</li>
                  <li>• GARCH 模型 - 波動率預測</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 工作流程 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
              🔄 工作流程
            </h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-white">錢包連接</h4>
                  <p className="text-sm">用戶連接 MetaMask 錢包到以太坊 Sepolia 測試網</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-white">代幣鑄造</h4>
                  <p className="text-sm">鑄造測試用的 ERC20 代幣（如 USDT）</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-white">代幣認證</h4>
                  <p className="text-sm">透過 Wormhole 協議進行代幣認證</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-white">跨鏈轉帳</h4>
                  <p className="text-sm">執行從以太坊到 Solana 的跨鏈轉帳</p>
                </div>
              </div>
            </div>
          </div>

          {/* 風險評估 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
              ⚠️ 風險評估系統
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">風險類型</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    發行商風險 (Issuer Risk)
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    結算風險 (Settlement Risk)
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    流動性風險 (Liquidity Risk)
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    波動率風險 (Volatility Risk)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">風險計算</h3>
                <p className="text-sm">
                  採用 GARCH 模型進行波動率預測，結合歷史價格數據和市場指標，
                  提供實時風險評估分數。
                </p>
              </div>
            </div>
          </div>

          {/* API 文件 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
              🔌 API 端點
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">風險 API</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">GET</span> /api/risk
                  </div>
                  <p className="text-xs">獲取代幣風險評估數據</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">認證 API</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-blue-400">POST</span> /api/attest
                  </div>
                  <p className="text-xs">執行代幣認證流程</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">報價 API</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-green-400">GET</span> /api/quote
                  </div>
                  <p className="text-xs">獲取跨鏈轉帳報價</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 詳細說明 */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
            📋 詳細操作說明
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">🔗 錢包連接流程</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><strong className="text-blue-400">步驟 1:</strong> 確保已安裝 MetaMask 擴展</p>
                <p><strong className="text-blue-400">步驟 2:</strong> 點擊「連接錢包」按鈕</p>
                <p><strong className="text-blue-400">步驟 3:</strong> 在 MetaMask 中授權連接</p>
                <p><strong className="text-blue-400">步驟 4:</strong> 系統將自動切換到 Sepolia 測試網</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">🏭 代幣鑄造說明</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><strong className="text-purple-400">功能:</strong> 創建測試用的 ERC20 代幣</p>
                <p><strong className="text-purple-400">數量:</strong> 每次鑄造 1000 個代幣</p>
                <p><strong className="text-purple-400">用途:</strong> 用於後續的跨鏈轉帳測試</p>
                <p><strong className="text-purple-400">注意:</strong> 僅在測試網上運行</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">🌉 跨鏈轉帳機制</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><strong className="text-green-400">協議:</strong> 使用 Wormhole 跨鏈橋</p>
                <p><strong className="text-green-400">來源:</strong> 以太坊 Sepolia 測試網</p>
                <p><strong className="text-green-400">目標:</strong> Solana Devnet</p>
                <p><strong className="text-green-400">費用:</strong> 包含 Gas 費和橋接費</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">📊 風險監控</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><strong className="text-red-400">實時監控:</strong> 持續追蹤市場波動</p>
                <p><strong className="text-red-400">預警系統:</strong> 高風險交易自動提醒</p>
                <p><strong className="text-red-400">歷史數據:</strong> 30 天價格歷史分析</p>
                <p><strong className="text-red-400">模型更新:</strong> GARCH 模型每日校準</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}