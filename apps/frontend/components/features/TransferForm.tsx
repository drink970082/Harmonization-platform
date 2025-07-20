'use client';

import React, { useState } from 'react';
import { CyberpunkButton, CyberpunkCard, CyberpunkInput, CyberpunkSelect } from '../ui';

interface TransferFormData {
  selectedSymbol: string;
  fromChain: string;
  toChain: string;
  amount: string;
  erc20Address: string;
  splAddress: string;
  fromAccount: string;
  toAccount: string;
  selectedBridge: string;
}

interface TransferFormProps {
  onTransfer: (data: TransferFormData) => void;
  onShowRiskReport: () => void;
  onShowQuote: () => void;
  onAmountChange?: (amount: string) => void;
  isLoading: boolean;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  onTransfer,
  onShowRiskReport,
  onShowQuote,
  onAmountChange,
  isLoading,
}) => {
  const [formData, setFormData] = useState<TransferFormData>({
    selectedSymbol: 'USDT',
    fromChain: 'Ethereum',
    toChain: 'Solana',
    amount: '',
    erc20Address: '',
    splAddress: '',
    fromAccount: '',
    toAccount: '',
    selectedBridge: '',
  });

  const handleInputChange = (field: keyof TransferFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'amount' && onAmountChange) {
      onAmountChange(value);
    }
  };

  const handleTransfer = () => {
    if (
      !formData.fromChain ||
      !formData.toChain ||
      !formData.erc20Address ||
      !formData.amount ||
      !formData.fromAccount ||
      !formData.toAccount ||
      !formData.selectedBridge
    ) {
      alert('❌ Please fill in all fields!');
      return;
    }
    onTransfer(formData);
  };

  const coinOptions = [
    { value: 'USDT', label: 'USDT' },
    { value: 'USDC', label: 'USDC' },
  ];

  const chainOptions = [
    { value: 'Ethereum', label: 'Ethereum' },
    { value: 'Solana', label: 'Solana' },
  ];

  const bridgeOptions = [
    { value: '', label: '-- Select Bridge --' },
    { value: 'wormhole', label: 'Wormhole' },
  ];

  return (
    <CyberpunkCard title="Step 3: Cross-Chain Transfer" glowColor="orange">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <CyberpunkSelect
          label="Select Coin"
          value={formData.selectedSymbol}
          onChange={(e) => handleInputChange('selectedSymbol', e.target.value)}
          options={coinOptions}
          glowColor="orange"
        />

        <CyberpunkSelect
          label="Bridge Protocol"
          value={formData.selectedBridge}
          onChange={(e) => handleInputChange('selectedBridge', e.target.value)}
          options={bridgeOptions}
          glowColor="orange"
        />

        <CyberpunkSelect
          label="From Chain"
          value={formData.fromChain}
          onChange={(e) => handleInputChange('fromChain', e.target.value)}
          options={chainOptions}
          glowColor="orange"
        />

        <CyberpunkSelect
          label="To Chain"
          value={formData.toChain}
          onChange={(e) => handleInputChange('toChain', e.target.value)}
          options={chainOptions}
          glowColor="orange"
        />

        <CyberpunkInput
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          glowColor="orange"
        />

        <CyberpunkInput
          label="ERC-20 Address"
          placeholder="0x..."
          value={formData.erc20Address}
          onChange={(e) => handleInputChange('erc20Address', e.target.value)}
          glowColor="orange"
        />

        <CyberpunkInput
          label="SPL Token Address"
          placeholder="Enter SPL Address"
          value={formData.splAddress}
          onChange={(e) => handleInputChange('splAddress', e.target.value)}
          glowColor="orange"
        />

        <CyberpunkInput
          label="From Account"
          placeholder="Enter source account"
          value={formData.fromAccount}
          onChange={(e) => handleInputChange('fromAccount', e.target.value)}
          glowColor="orange"
        />

        <div className="lg:col-span-2">
          <CyberpunkInput
            label="To Account"
            placeholder="Enter destination account"
            value={formData.toAccount}
            onChange={(e) => handleInputChange('toAccount', e.target.value)}
            glowColor="orange"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center mt-16">
        <CyberpunkButton
          onClick={onShowRiskReport}
          variant="danger"
          size="md"
        >
          📊 Long-term Risk Report
        </CyberpunkButton>

        <CyberpunkButton
          onClick={onShowQuote}
          variant="secondary"
          size="md"
        >
          📈 Get Quote & Risk Analysis
        </CyberpunkButton>

        <CyberpunkButton
          onClick={handleTransfer}
          variant="success"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
        >
          🚀 Execute Transfer
        </CyberpunkButton>
      </div>
    </CyberpunkCard>
  );
};