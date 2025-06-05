import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
  delay,
  log,
  NeonAddress,
  PreparatorySolanaTransaction,
  prepareSolanaInstruction,
  ScheduledTransactionStatus,
  SolanaNeonAccount,
  TransactionData
} from '@neonevm/solana-sign';
import { useProxyConnection } from '../wallet/Connection';
import { Big } from 'big.js';

interface ContractState {
  collateralBalance: number;
  debt: number;
  loading: boolean;
  error: string | null;
}

const DURATION = 3e5; // 5 minutes
const DELAY = 1e3; // 1 second

export const useSolanaContract = (contractAddress: string, collateralTokenAddress: string) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const {
    solanaUser,
    proxyApi,
    chainId,
    neonEvmProgram,
    sendTransaction,
    provider,
    addresses
  } = useProxyConnection();

  const [state, setState] = useState<ContractState>({
    collateralBalance: 0,
    debt: 0,
    loading: false,
    error: null
  });

  const executeTransaction = async (
    method: string,
    params: any[],
    preparatorySolanaInstructions: TransactionInstruction[] = []
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const nonce = Number(await proxyApi.getTransactionCount(solanaUser.neonWallet));
      
      // Create transaction data for the contract call
      const transactionData: TransactionData = {
        to: contractAddress,
        nonce,
        data: provider.encodeFunction(method, params),
        gasLimit: '500000', // Adjust as needed
        value: '0'
      };

      // Prepare Solana transactions
      const preparatorySolanaTransactions: PreparatorySolanaTransaction[] = 
        preparatorySolanaInstructions.map(instruction => ({
          instructions: [prepareSolanaInstruction(instruction)]
        }));

      // Estimate gas
      const transactionGas = await proxyApi.estimateScheduledTransactionGas({
        solanaPayer: solanaUser.publicKey,
        transactions: [transactionData],
        preparatorySolanaTransactions
      });

      // Create the transaction
      const { transactions, scheduledTransaction } = await proxyApi.createMultipleTransaction({
        transactionGas,
        transactionsData: [transactionData],
        solanaInstructions: preparatorySolanaInstructions
      });

      // Send the transaction
      if (scheduledTransaction.instructions.length > 0) {
        const signature = await sendTransaction(scheduledTransaction, 'confirmed', { skipPreflight: false });
        
        if (signature) {
          // Wait for transaction confirmation
          const start = Date.now();
          while (DURATION > Date.now() - start) {
            const { result } = await proxyApi.getScheduledTreeAccount(solanaUser.neonWallet, nonce);
            if (result) {
              if (['Success', 'Empty', 'Failed', 'Skipped'].includes(result.activeStatus)) {
                if (result.activeStatus === 'Failed') {
                  throw new Error('Transaction failed');
                }
                break;
              }
            }
            await delay(DELAY);
          }
        }
      }

      // Send any remaining transactions
      if (transactions.length > 0) {
        await delay(1e3);
        const resultsHash = await proxyApi.sendRawScheduledTransactions(
          transactions.map(t => t.serialize())
        );
        log(`Transaction hash: ${resultsHash}`);
      }

      // Update state after successful transaction
      await updateState();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateState = async () => {
    if (!solanaUser || !proxyApi) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get collateral balance
      const collateralResult = await proxyApi.callContract({
        contract: contractAddress,
        data: provider.encodeFunction('collateralBalance', [solanaUser.neonWallet])
      });
      
      // Get debt
      const debtResult = await proxyApi.callContract({
        contract: contractAddress,
        data: provider.encodeFunction('debt', [solanaUser.neonWallet])
      });

      setState(prev => ({
        ...prev,
        collateralBalance: Number(collateralResult),
        debt: Number(debtResult),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const deposit = async (amount: string) => {
    if (!solanaUser) throw new Error("Wallet not connected");
    
    // Convert amount to contract decimals
    const amountInWei = new Big(amount).times(new Big(10).pow(18)).toString();

    // Check if we need approval first
    const allowance = await proxyApi.callContract({
      contract: collateralTokenAddress,
      data: provider.encodeFunction('allowance', [solanaUser.neonWallet, contractAddress])
    });

    const preparatorySolanaInstructions: TransactionInstruction[] = [];
    
    if (Big(allowance).lt(amountInWei)) {
      // Add approval instruction
      const approveInstruction = await provider.createApprovalInstruction(
        connection,
        solanaUser,
        neonEvmProgram,
        collateralTokenAddress,
        contractAddress,
        amountInWei
      );
      if (approveInstruction) {
        preparatorySolanaInstructions.push(approveInstruction);
      }
    }

    await executeTransaction(
      'depositCollateral',
      [amountInWei],
      preparatorySolanaInstructions
    );
  };

  const withdraw = async (amount: string) => {
    if (!solanaUser) throw new Error("Wallet not connected");
    const amountInWei = new Big(amount).times(new Big(10).pow(18)).toString();
    await executeTransaction('withdrawCollateral', [amountInWei]);
  };

  const borrow = async (amount: string) => {
    if (!solanaUser) throw new Error("Wallet not connected");
    const amountInWei = new Big(amount).times(new Big(10).pow(18)).toString();
    await executeTransaction('borrow', [amountInWei]);
  };

  const repay = async (amount: string) => {
    if (!solanaUser) throw new Error("Wallet not connected");
    const amountInWei = new Big(amount).times(new Big(10).pow(18)).toString();
    
    // Check if we need approval for the output token
    const outputTokenAddress = await proxyApi.callContract({
      contract: contractAddress,
      data: provider.encodeFunction('outputToken', [])
    });

    const allowance = await proxyApi.callContract({
      contract: outputTokenAddress,
      data: provider.encodeFunction('allowance', [solanaUser.neonWallet, contractAddress])
    });

    const preparatorySolanaInstructions: TransactionInstruction[] = [];
    
    if (Big(allowance).lt(amountInWei)) {
      // Add approval instruction
      const approveInstruction = await provider.createApprovalInstruction(
        connection,
        solanaUser,
        neonEvmProgram,
        outputTokenAddress,
        contractAddress,
        amountInWei
      );
      if (approveInstruction) {
        preparatorySolanaInstructions.push(approveInstruction);
      }
    }

    await executeTransaction('repay', [amountInWei], preparatorySolanaInstructions);
  };

  useEffect(() => {
    if (solanaUser && proxyApi) {
      updateState();
    }
  }, [solanaUser, proxyApi, contractAddress]);

  return {
    ...state,
    deposit,
    withdraw,
    borrow,
    repay
  };
}; 