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
    const { tokenAddress } = await request.json();

    console.log('🔍 Checking if token is already attested:', tokenAddress);

    if (!tokenAddress) {
      throw new Error('Missing token address');
    }

    // 初始化 Wormhole SDK
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

    const dstChain = wh.getChain('Solana');
    const token = Wormhole.tokenId('Sepolia', tokenAddress);
    const dstTokenBridge = await dstChain.getTokenBridge();
    
    try {
      // 嘗試獲取 wrapped token
      const wrappedAsset = await dstTokenBridge.getWrappedAsset(token);
      const wrappedTokenAddress = wrappedAsset.toString();
      
      console.log('✅ Token already attested, wrapped token found:', wrappedTokenAddress);
      
      return NextResponse.json(serializeBigInt({
        success: true,
        alreadyAttested: true,
        wrappedTokenAddress: wrappedTokenAddress,
        message: `此合約已經 attest 過了，他的 Solana wrapped token: ${wrappedTokenAddress}`
      }));
      
    } catch (wrappedError) {
      console.log('ℹ️ Token not yet attested');
      
      return NextResponse.json(serializeBigInt({
        success: true,
        alreadyAttested: false,
        message: 'Token has not been attested yet. Proceeding with attestation.'
      }));
    }

  } catch (error: any) {
    console.error('❌ Check attestation error:', error);
    
    const serializableError = serializeBigInt({
      success: false,
      error: error.message || 'Failed to check attestation status',
      details: error.stack || 'No stack trace available'
    });
    
    return NextResponse.json(serializableError, { status: 500 });
  }
}