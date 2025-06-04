"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useState } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther, formatEther } from "viem";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { writeContractAsync: deposit } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: withdraw } = useScaffoldWriteContract("YourContract");
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
      });
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffccf3", minHeight: "100vh" }}>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold" style={{ color: "#f72ac7" }}>Чаробни Internet Money</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
            <p className="my-2 font-medium">Account Balance:</p>
            <Balance address={connectedAddress} />
          </div>

          {/* Collatoral Section */}
          <div className="flex justify-center items-start gap-8 mt-8">

            {/* Deposit Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="form-control w-full max-w-md">
                <label className="label">
                  <span className="label-text">WORDS?</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter amount to deposit (Sol)"
                  className="input input-bordered w-full"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.0001"
                />
              </div>
              <button
                className="btn btn-primary w-full max-w-md"
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Deposit
              </button>
            </div>

            {/* Withdraw Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="form-control w-full max-w-md">
                <label className="label">
                  <span className="label-text"> words?</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter amount to withdraw (ETH)"
                  className="input input-bordered w-full"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  step="0.0001"
                />
              </div>
              <button
                className="btn btn-secondary w-full max-w-md"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
              >
                Withdraw
              </button>
            </div>
          </div>
      
          {/* Magic Internet Money Section */}
          <div className="flex justify-center items-start gap-8 mt-8">

            {/* Borrow Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="form-control w-full max-w-md">
                <input
                  type="number"
                  placeholder="Enter amount to deposit (USDC)"
                  className="input input-bordered w-full"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.0001"
                />
              </div>
              <button
                className="btn btn-primary w-full max-w-md"
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Borrow
              </button>
            </div>

            {/* Repay Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="form-control w-full max-w-md">
                <input
                  type="number"
                  placeholder="Enter amount to repay (4ap)"
                  className="input input-bordered w-full"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  step="0.0001"
                />
              </div>
              <button
                className="btn btn-secondary w-full max-w-md"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
              >
                Repay
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Home;
