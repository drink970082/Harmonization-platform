import { NextRequest, NextResponse } from 'next/server';
import { wormhole, Wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

// 處理 BigInt 序列化問題的輔助函數
function serializeBigInt(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return Number(value);
    }
    return value;
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { transactionHash, tokenAddress } = await request.json();

    console.log('🌉 Starting VAA retrieval and attestation submission...');
    console.log('📋 Transaction Hash:', transactionHash);
    console.log('📋 Token Address:', tokenAddress);

    // 初始化 Wormhole SDK with correct chain configurations
    const wh = await wormhole('Testnet', [evm, solana], {
      chains: {
        Sepolia: {
          rpc: 'https://eth-sepolia.public.blastapi.io',
          contracts: {
            coreBridge: '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78',
            tokenBridge: '0xDB5492265f6038831E89f495670FF909aDe94bd9'
          }
        },
        Solana: {
          rpc: 'https://api.devnet.solana.com',
        }
      }
    });
    const srcChain = wh.getChain('Sepolia'); // 使用 Sepolia 而不是 Ethereum
    const dstChain = wh.getChain('Solana');

    // 解析交易以獲取 VAA
    console.log('📖 Parsing transaction for VAA...');
    const msgs = await srcChain.parseTransaction(transactionHash);
    
    if (!msgs || msgs.length === 0) {
      throw new Error('No messages found in transaction');
    }

    console.log('✅ Found messages count:', msgs.length);

    // 等待 VAA
    console.log('⏳ Waiting for VAA from Guardians...');
    const timeout = 35 * 60 * 1000; // 35 minutes
    const vaa = await wh.getVaa(msgs[0], 'TokenBridge:AttestMeta', timeout);

    if (!vaa) {
      throw new Error('VAA not found after timeout');
    }

    console.log('🎉 VAA received successfully');

    // 檢查是否已經有 wrapped token
    const token = Wormhole.tokenId('Sepolia', tokenAddress); // 使用 Sepolia 而不是 Ethereum
    const dstTokenBridge = await dstChain.getTokenBridge();
    
    let wrappedTokenAddress;
    try {
      const wrappedAsset = await dstTokenBridge.getWrappedAsset(token);
      wrappedTokenAddress = wrappedAsset.toString();
      console.log('🎯 Found existing wrapped token:', wrappedTokenAddress);
    } catch (wrappedError) {
      console.log('⚠️ Wrapped token not yet available');
      
      // 在這裡我們應該提交 VAA 到 Solana
      // 但是這需要 Solana 私鑰，在生產環境中需要適當的密鑰管理
      console.log('🔐 VAA ready for submission to Solana');
      
      // 確保 VAA 數據可以序列化
      const serializedVaaData = {
        sequence: vaa.sequence ? Number(vaa.sequence) : 0,
        emitterChain: vaa.emitterChain ? Number(vaa.emitterChain) : 0,
        emitterAddress: vaa.emitterAddress ? vaa.emitterAddress.toString() : '',
      };
      
      return NextResponse.json({
        success: true,
        vaaReady: true,
        message: 'VAA generated successfully. Manual submission to Solana required.',
        vaaData: serializedVaaData
      });
    }

    // 確保所有數據都可以序列化 (避免 BigInt 問題)
    const serializedVaaData = {
      sequence: vaa.sequence ? Number(vaa.sequence) : 0,
      emitterChain: vaa.emitterChain ? Number(vaa.emitterChain) : 0,
      emitterAddress: vaa.emitterAddress ? vaa.emitterAddress.toString() : '',
    };
    
    return NextResponse.json({
      success: true,
      wrappedTokenAddress: wrappedTokenAddress ? wrappedTokenAddress.toString() : null,
      vaaData: serializedVaaData
    });

  } catch (error: any) {
    console.error('❌ VAA/Attestation API error:', error);
    
    // 使用 serializeBigInt 來確保錯誤對象可以序列化
    const serializableError = serializeBigInt({
      success: false,
      error: error.message || 'VAA retrieval failed',
      details: error.stack || 'No stack trace available'
    });
    
    return NextResponse.json(serializableError, { status: 500 });
  }
}