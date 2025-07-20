'use client';

import React, { useState } from 'react';
import { CyberpunkBackground } from '../../components/effects';
import { TransferForm } from '../../components/features';

export default function TransferPage() {
  const [transferAmount, setTransferAmount] = useState('');
  const [loading, setLoading] = useState('');

  const handleTransfer = async (formData: any) => {
    setLoading('transfer');
    try {
      // 轉帳邏輯（從主頁面複製）
      if (!formData.erc20Address || !formData.amount || !formData.toAccount) {
        alert('❌ 請填寫所有必要欄位！');
        return;
      }

      if (!(window as any).ethereum) {
        alert('❌ 請安裝 MetaMask');
        return;
      }

      console.log('🚀 開始跨鏈轉帳...');
      
      // 模擬轉帳成功
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(
        `✅ 跨鏈轉帳模擬成功！\n\n` +
        `金額: ${formData.amount} 代幣\n` +
        `目標地址: ${formData.toAccount}\n` +
        `注意：這是演示模式`
      );
      
    } catch (err: any) {
      console.error('轉帳錯誤:', err);
      alert(`❌ 轉帳失敗: ${err?.message || '未知錯誤'}`);
    } finally {
      setLoading('');
    }
  };

  const handleShowRiskReport = () => {
    // 導航到風險分析頁面
    window.location.href = '/risk-analysis';
  };

  const handleShowQuote = () => {
    alert('💰 報價功能開發中...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative">
      <CyberpunkBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            跨鏈轉帳
          </h1>
          <p className="text-xl text-gray-300">
            安全快速的以太坊到 Solana 跨鏈資產轉移
          </p>
        </div>

        {/* 轉帳表單 */}
        <div className="mb-12">
          <TransferForm
            onTransfer={handleTransfer}
            onShowRiskReport={handleShowRiskReport}
            onShowQuote={handleShowQuote}
            onAmountChange={setTransferAmount}
            isLoading={loading === 'transfer'}
          />
        </div>

        {/* 轉帳說明 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
              🌉 跨鏈技術
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Wormhole 協議</h3>
                <p className="text-sm leading-relaxed">
                  使用業界領先的 Wormhole 跨鏈橋技術，確保資產在不同區塊鏈之間安全轉移。
                  該協議已處理超過數十億美元的跨鏈交易。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">支援網路</h3>
                <ul className="text-sm space-y-1">
                  <li>• 來源：以太坊 Sepolia 測試網</li>
                  <li>• 目標：Solana Devnet</li>
                  <li>• 處理時間：通常 2-15 分鐘</li>
                  <li>• 確認數：以太坊 12 個區塊</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
              💰 費用說明
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">費用組成</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>以太坊 Gas 費</span>
                    <span className="text-blue-400">~$5-20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wormhole 橋接費</span>
                    <span className="text-blue-400">~$1-3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Solana 交易費</span>
                    <span className="text-blue-400">~$0.01</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                    <span>預估總費用</span>
                    <span className="text-green-400">~$6-23</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">費用優化建議</h3>
                <ul className="text-sm space-y-1">
                  <li>• 在 Gas 費較低時進行轉帳</li>
                  <li>• 批量處理大額轉帳</li>
                  <li>• 避免網路擁堵時段</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 安全提醒 */}
        <div className="mt-12 bg-red-500/10 border border-red-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
            ⚠️ 安全提醒
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">轉帳前檢查</h3>
              <ul className="text-sm space-y-1">
                <li>• 確認目標地址正確無誤</li>
                <li>• 檢查轉帳金額</li>
                <li>• 確保足夠的 Gas 費餘額</li>
                <li>• 建議先進行小額測試</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">注意事項</h3>
              <ul className="text-sm space-y-1">
                <li>• 跨鏈轉帳不可逆轉</li>
                <li>• 網路擁堵可能延長處理時間</li>
                <li>• 保持錢包連接穩定</li>
                <li>• 遇到問題請聯繫技術支援</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}