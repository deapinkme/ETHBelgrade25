# 🧙🏼‍♂️ Чаробни Internet Money (4ap Protocol)

A magical stablecoin protocol deployed on Neon EVM that allows users to mint 4ap, a Magic Internet Money–style token, by depositing USDC as collateral.

This is a simplified version of the Abracadabra model, designed to be lean, fast, and extendable — ideal for bridging DeFi mechanics to Solana via Neon EVM.

---

## ✨ What is Чаробни Internet Money?

Чаробни Internet Money (translated: *Magic Internet Money*) is an experimental stablecoin system where users deposit collateral (USDC) and mint a soft-pegged stablecoin (`4ap`) at a fixed collateral ratio.

Key Features:
- 💵 USDC-backed: Users deposit USDC as collateral.
- 🪄 4ap Minting: Borrowers receive 4ap, a MIM-style stablecoin.
- 🔐 Loan Management: Repay 4ap to reclaim collateral.
- 🚫 No liquidations (yet): Simple risk-managed system via capped borrowing power (50% LTV).

---

## 🔧 How It Works

1. Deposit USDC  
   Users lock USDC as collateral in the protocol.

2. Mint 4ap  
   Users borrow up to 50% of their collateral’s value in 4ap.

3. Repay + Withdraw  
   Repay 4ap to unlock and withdraw USDC collateral.

---

## 🧪 Contract Overview

```solidity
function depositCollateral(uint256 amount)
function borrow(uint256 mimAmount) // 4ap
function repay(uint256 mimAmount)
function withdrawCollateral(uint256 amount)