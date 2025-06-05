"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { WalletButton } from "~~/components/Wallet/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { publicKey: solanaAddress } = useWallet();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  const { writeContractAsync: deposit } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: withdraw } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: borrow } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: repay } = useScaffoldWriteContract("YourContract");
  const { data: contractBalance } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getBalance",
  });

  const handleDeposit = async () => {
    if (!depositAmount) return;
    try {
      await deposit({
        functionName: "deposit",
        value: parseEther(depositAmount),
      });
      setDepositAmount("");
    } catch (error) {
      console.error("Error depositing:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    try {
      await withdraw({
        functionName: "withdraw",
        args: [parseEther(withdrawAmount)],
      } as any);
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount) return;
    try {
      await borrow({
        functionName: "borrow",
        args: [parseEther(borrowAmount)],
      } as any);
      setBorrowAmount("");
    } catch (error) {
      console.error("Error borrowing:", error);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount) return;
    try {
      await repay({
        functionName: "repay",
        args: [parseEther(repayAmount)],
        value: parseEther(repayAmount),
      } as any);
      setRepayAmount("");
    } catch (error) {
      console.error("Error repaying:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffccf3", minHeight: "100vh" }}>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold" style={{ color: "#f72ac7" }}>
              Чаробни Internet Money
            </span>
          </h1>

          {/* Wallet Connections */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <div className="flex flex-col items-center space-y-2">
              <p className="font-medium" style={{ color: "#a60a7c" }}>Ethereum Wallet:</p>
              <div className="flex justify-center items-center space-x-2">
                <p className="my-2 font-medium" style={{ color: "#a60a7c" }}>
                  Connected Address:
                </p>
                <Address address={connectedAddress} />
              </div>
              <div className="flex justify-center items-center space-x-2">
                <p className="my-2 font-medium" style={{ color: "#a60a7c" }}>
                  Account Balance:
                </p>
                <Balance address={connectedAddress} />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <p className="font-medium" style={{ color: "#a60a7c" }}>Solana Wallet:</p>
              <WalletButton />
              {solanaAddress && (
                <p className="text-sm" style={{ color: "#a60a7c" }}>
                  {solanaAddress.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center space-x-2 flex-col mt-4">
            <p className="my-2 font-medium" style={{ color: "#a60a7c" }}>
              Contract Balance:
            </p>
            <p className="text-lg font-bold">{contractBalance ? formatEther(contractBalance) : "0"} ETH</p>
          </div>

          {/* Collatoral Section */}
          <div className="flex justify-center items-start gap-8 mt-8">
            <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#f72ac7" }}>
                Collateral
              </h2>
              <div className="flex gap-8 w-full">
                {/* Deposit Section */}
                <div className="flex flex-col items-center space-y-4 flex-1">
                  <div className="form-control w-full">
                    <input
                      type="number"
                      placeholder="Deposit amount (USDC)"
                      className="input input-bordered w-full"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      min="0"
                      step="0.0001"
                    />
                  </div>
                  <button
                    className="btn w-full bg-[#34d100] hover:bg-[#2bb800] text-white border-none"
                    onClick={handleDeposit}
                    disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  >
                    Deposit
                  </button>
                </div>

                {/* Withdraw Section */}
                <div className="flex flex-col items-center space-y-4 flex-1">
                  <div className="form-control w-full">
                    <input
                      type="number"
                      placeholder="Withdraw amount (USDC)"
                      className="input input-bordered w-full"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      min="0"
                      step="0.0001"
                    />
                  </div>
                  <button
                    className="btn w-full bg-[#f72ac7] hover:bg-[#e01ab3] text-white border-none"
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Magic Internet Money Section */}
          <div className="flex justify-center items-start gap-8 mt-8">
            <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#f72ac7" }}>
                Чаробни Internet Money
              </h2>
              <div className="flex gap-8 w-full">
                {/* Borrow Section */}
                <div className="flex flex-col items-center space-y-4 flex-1">
                  <div className="form-control w-full">
                    <input
                      type="number"
                      placeholder="Borrow amount (4ap)"
                      className="input input-bordered w-full"
                      value={borrowAmount}
                      onChange={e => setBorrowAmount(e.target.value)}
                      min="0"
                      step="0.0001"
                    />
                  </div>
                  <button
                    className="btn w-full bg-[#34d100] hover:bg-[#2bb800] text-white border-none"
                    onClick={handleBorrow}
                    disabled={!borrowAmount || parseFloat(borrowAmount) <= 0}
                  >
                    Borrow
                  </button>
                </div>

                {/* Repay Section */}
                <div className="flex flex-col items-center space-y-4 flex-1">
                  <div className="form-control w-full">
                    <input
                      type="number"
                      placeholder="Repay amount (4ap)"
                      className="input input-bordered w-full"
                      value={repayAmount}
                      onChange={e => setRepayAmount(e.target.value)}
                      min="0"
                      step="0.0001"
                    />
                  </div>
                  <button
                    className="btn w-full bg-[#f72ac7] hover:bg-[#e01ab3] text-white border-none"
                    onClick={handleRepay}
                    disabled={!repayAmount || parseFloat(repayAmount) <= 0}
                  >
                    Repay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
