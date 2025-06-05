import { useEffect, useState } from "react";
import { useScaffoldContract } from "./scaffold-eth";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { parseEther, formatEther } from "viem";
import { usePublicClient } from "wagmi";

interface SimpleAbraState {
  collateralBalance: bigint;
  debt: bigint;
  contractBalance: bigint;
  loading: boolean;
  error: string | null;
}

export const useSimpleAbra = () => {
  const { address: evmAddress } = useAccount();
  const { publicKey: solanaAddress } = useWallet();
  const publicClient = usePublicClient();
  
  const [state, setState] = useState<SimpleAbraState>({
    collateralBalance: BigInt(0),
    debt: BigInt(0),
    contractBalance: BigInt(0),
    loading: false,
    error: null
  });

  // Get contract instance
  const { data: simpleAbra } = useScaffoldContract({
    contractName: "SimpleAbra",
    walletClient: true
  });

  const updateState = async () => {
    if (!evmAddress || !simpleAbra) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get contract's ETH balance
      const contractBalance = await publicClient.getBalance({
        address: simpleAbra.address
      });

      // Get collateral balance
      const collateralBalance = await simpleAbra.read.collateralBalance([evmAddress]);
      
      // Get debt
      const debt = await simpleAbra.read.debt([evmAddress]);

      setState(prev => ({
        ...prev,
        collateralBalance,
        debt,
        contractBalance,
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching state:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }));
    }
  };

  const deposit = async (amount: string) => {
    if (!simpleAbra || !evmAddress) throw new Error("Contract or wallet not connected");
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const tx = await simpleAbra.write.depositCollateral([parseEther(amount)]);
      await tx.wait();
      
      await updateState();
    } catch (error) {
      console.error("Error depositing:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }));
      throw error;
    }
  };

  const withdraw = async (amount: string) => {
    if (!simpleAbra || !evmAddress) throw new Error("Contract or wallet not connected");
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const tx = await simpleAbra.write.withdrawCollateral([parseEther(amount)]);
      await tx.wait();
      
      await updateState();
    } catch (error) {
      console.error("Error withdrawing:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }));
      throw error;
    }
  };

  const borrow = async (amount: string) => {
    if (!simpleAbra || !evmAddress) throw new Error("Contract or wallet not connected");
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const tx = await simpleAbra.write.borrow([parseEther(amount)]);
      await tx.wait();
      
      await updateState();
    } catch (error) {
      console.error("Error borrowing:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }));
      throw error;
    }
  };

  const repay = async (amount: string) => {
    if (!simpleAbra || !evmAddress) throw new Error("Contract or wallet not connected");
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const tx = await simpleAbra.write.repay([parseEther(amount)]);
      await tx.wait();
      
      await updateState();
    } catch (error) {
      console.error("Error repaying:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }));
      throw error;
    }
  };

  // Update state when wallet or contract changes
  useEffect(() => {
    if (evmAddress && simpleAbra) {
      updateState();
    }
  }, [evmAddress, simpleAbra]);

  return {
    ...state,
    deposit,
    withdraw,
    borrow,
    repay
  };
}; 