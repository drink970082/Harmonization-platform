'use client';

import React from 'react';
import { CyberpunkBackground } from '../../components/effects';

export default function ReportsPage() {
  const downloadReport = (reportName: string, fileName: string) => {
    // 創建下載連結
    const link = document.createElement('a');
    link.href = `/reports/${fileName}`;
    link.download = fileName;
    link.click();
  };

  const reports = [
    {
      id: 1,
      title: 'USDT 風險評估報告',
      description: '詳細的 USDT 穩定幣風險分析，包含發行商風險、流動性風險和市場風險評估',
      fileName: 'USDT-risk-report.pdf',
      type: '風險報告',
      date: '2024-12-20',
      status: '已完成',
      icon: '📊'
    },
    {
      id: 2,
      title: '跨鏈橋安全分析',
      description: 'Wormhole 跨鏈橋的技術架構、安全機制和風險評估報告',
      fileName: 'wormhole-security-analysis.pdf',
      type: '技術報告',
      date: '2024-12-19',
      status: '開發中',
      icon: '🔒'
    },
    {
      id: 3,
      title: '市場波動率週報',
      description: '基於 GARCH 模型的市場波動率分析和未來趨勢預測',
      fileName: 'volatility-weekly-report.pdf',
      type: '市場分析',
      date: '2024-12-18',
      status: '開發中',
      icon: '📈'
    },
    {
      id: 4,
      title: '合規性檢查報告',
      description: '平台合規性審查，包含反洗錢 (AML) 和瞭解客戶 (KYC) 流程評估',
      fileName: 'compliance-report.pdf',
      type: '合規報告',
      date: '2024-12-17',
      status: '開發中',
      icon: '⚖️'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'text-green-400 bg-green-500/20';
      case '開發中':
        return 'text-yellow-400 bg-yellow-500/20';
      case '待審核':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '風險報告':
        return 'text-red-400 bg-red-500/20';
      case '技術報告':
        return 'text-blue-400 bg-blue-500/20';
      case '市場分析':
        return 'text-purple-400 bg-purple-500/20';
      case '合規報告':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative">
      <CyberpunkBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
            分析報告
          </h1>
          <p className="text-xl text-gray-300">
            風險評估、技術分析與合規性報告中心
          </p>
        </div>

        {/* 報告統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-400">4</div>
            <div className="text-gray-300 text-sm">總報告數</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-400">1</div>
            <div className="text-gray-300 text-sm">已完成</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-400">3</div>
            <div className="text-gray-300 text-sm">開發中</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-purple-400">本週</div>
            <div className="text-gray-300 text-sm">更新頻率</div>
          </div>
        </div>

        {/* 報告列表 */}
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{report.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {report.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="text-gray-400 text-xs">
                          📅 {report.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:ml-8">
                  {report.status === '已完成' ? (
                    <button
                      onClick={() => downloadReport(report.title, report.fileName)}
                      className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>📥</span>
                      <span>下載報告</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full lg:w-auto px-6 py-3 bg-gray-600/50 text-gray-400 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>⏳</span>
                      <span>製作中</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 報告說明 */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
              📋 報告類型說明
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">風險報告</h3>
                <p className="text-sm leading-relaxed">
                  針對特定加密貨幣或 DeFi 協議進行全面的風險評估，包含市場風險、
                  流動性風險、技術風險和監管風險等多個維度的分析。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">技術報告</h3>
                <p className="text-sm leading-relaxed">
                  深入分析區塊鏈技術架構、智能合約安全性、跨鏈橋機制等技術細節，
                  提供專業的技術評估和安全建議。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">市場分析</h3>
                <p className="text-sm leading-relaxed">
                  使用 GARCH 模型和其他量化分析工具，對市場波動率、價格趨勢
                  和交易量進行深度分析和預測。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">合規報告</h3>
                <p className="text-sm leading-relaxed">
                  評估平台和相關協議的法規合規性，包含 AML、KYC、資金來源追蹤
                  等合規要求的執行狀況。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
              🔄 更新機制
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">自動化監控</h3>
                <p className="text-sm leading-relaxed">
                  系統持續監控市場數據、協議變更和安全事件，自動觸發報告更新機制，
                  確保分析結果的時效性和準確性。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">定期更新</h3>
                <ul className="text-sm space-y-1">
                  <li>• 風險報告：每日更新風險指標</li>
                  <li>• 技術報告：協議升級時更新</li>
                  <li>• 市場分析：每週發布週報</li>
                  <li>• 合規報告：法規變更時更新</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">品質保證</h3>
                <p className="text-sm leading-relaxed">
                  所有報告經過多重驗證流程，包含數據驗證、模型檢驗和專家審核，
                  確保分析結果的可靠性和專業性。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 報告請求 */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            📝 需要客製化報告？
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            我們提供針對特定需求的客製化分析報告服務。無論是特殊的風險評估、
            技術審計或市場分析，我們的專家團隊都能提供專業的解決方案。
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            📞 聯繫我們
          </button>
        </div>
      </div>
    </div>
  );
}