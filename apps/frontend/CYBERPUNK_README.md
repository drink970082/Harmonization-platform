# 🔮 Harmonization Platform - Cyberpunk Frontend

## 概述

這是一個具有賽博龐克風格的跨鏈穩定幣統一平台前端。已完成從原始單一頁面到模組化組件架構的重構。

## 📁 文件結構

```
apps/frontend/
├── components/
│   ├── ui/                     # 基礎UI組件
│   │   ├── CyberpunkButton.tsx # 賽博龐克風格按鈕
│   │   ├── CyberpunkCard.tsx   # 賽博龐克風格卡片
│   │   ├── CyberpunkInput.tsx  # 賽博龐克風格輸入框
│   │   ├── CyberpunkSelect.tsx # 賽博龐克風格選擇器
│   │   ├── LoadingSpinner.tsx  # 載入動畫
│   │   └── index.ts           # UI組件導出
│   ├── features/              # 功能組件
│   │   ├── WalletConnection.tsx    # 錢包連接
│   │   ├── TokenMinting.tsx        # 代幣鑄造
│   │   ├── TokenAttestation.tsx    # 代幣證明
│   │   ├── TransferForm.tsx        # 轉帳表單
│   │   ├── QuoteSummary.tsx        # 報價摘要
│   │   └── index.ts               # 功能組件導出
│   ├── effects/               # 視覺效果組件
│   │   ├── MatrixRain.tsx     # 矩陣雨效果
│   │   ├── CyberpunkBackground.tsx # 賽博龐克背景
│   │   └── index.ts           # 效果組件導出
│   └── index.ts               # 總組件導出
├── app/
│   ├── globals.css            # 全局樣式（已重新設計）
│   ├── page.tsx               # 主頁面（已完全重構）
│   └── ...
├── lib/
│   └── erc20.ts              # ERC20合約配置
├── tailwind.config.js        # Tailwind配置
├── postcss.config.js         # PostCSS配置
└── package.json              # 依賴配置（已添加ethers）
```

## 🎨 設計特色

### 視覺風格
- **顏色主題**: 深藍黑背景 + 青藍色主調 + 紫色/橙色/綠色強調
- **字體**: 等寬字體（SF Mono、Monaco等）
- **動畫效果**: 矩陣雨、掃描線、發光效果、故障效果

### UI組件特色
- **CyberpunkButton**: 具有發光邊框和懸停效果的按鈕
- **CyberpunkCard**: 帶有角落裝飾和網格背景的卡片
- **CyberpunkInput**: 具有掃描線動畫的輸入框
- **LoadingSpinner**: 雙環旋轉的載入動畫

### 背景效果
- **MatrixRain**: 動態的字符雨效果
- **Grid Background**: 網格背景圖案
- **Floating Particles**: 浮動粒子效果

## 🚀 功能模組

### 1. 錢包連接 (WalletConnection)
- MetaMask錢包連接
- 連接狀態顯示
- 地址展示

### 2. 代幣鑄造 (TokenMinting)
- 部署Mock USDT合約
- 交易狀態追蹤
- 合約地址顯示

### 3. 代幣證明 (TokenAttestation)
- Wormhole橋接證明
- 跨鏈代幣包裝
- Solana地址生成

### 4. 轉帳表單 (TransferForm)
- 多鏈選擇（Ethereum/Solana）
- 橋接協議選擇
- 完整的轉帳參數配置

### 5. 風險分析 (QuoteSummary)
- 實時風險評估
- 成本分析
- 價格區間預測
- 高級詳情展示

## 🔧 技術棧

- **框架**: Next.js 15 with React 19
- **樣式**: Tailwind CSS 4.x
- **區塊鏈**: Ethers.js 6.x
- **字體**: 等寬字體系列
- **動畫**: CSS關鍵幀動畫

## 🎯 優化重點

1. **模組化架構**: 從單一頁面拆分為可重用組件
2. **視覺一致性**: 統一的賽博龐克設計語言
3. **用戶體驗**: 清晰的操作流程和狀態反饋
4. **性能優化**: 組件懶載入和動畫優化
5. **類型安全**: 完整的TypeScript類型定義

## 🎮 使用方式

1. 安裝依賴: `npm install`
2. 啟動開發服務器: `npm run dev`
3. 訪問 `http://localhost:3000`

## 🔮 未來規劃

- [ ] 添加更多橋接協議支持
- [ ] 實現實時價格追蹤
- [ ] 添加交易歷史記錄
- [ ] 優化移動端響應式設計
- [ ] 添加更多視覺效果和動畫