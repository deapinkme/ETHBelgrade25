import { ethers } from "hardhat";

// Factory ABI for just the function we need
const FACTORY_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint8", name: "_decimals", type: "uint8" },
      { internalType: "address", name: "_mint_authority", type: "address" },
    ],
    name: "createErc20ForSplMintable",
    outputs: [{ internalType: "address", name: "erc20spl", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  // Get the first signer from Hardhat's configured accounts
  const [signer] = await ethers.getSigners();
  console.log("Using signer address:", await signer.getAddress());

  // Factory contract address
  const FACTORY_ADDRESS = "0xf6b17787154c418d5773ea22afc87a95caa3e957";

  // Create contract instance
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

  try {
    console.log("Creating new token...");
    const tx = await factory.createErc20ForSplMintable(
      "Чаробни Internet Money", // name
      "4ap", // symbol
      6, // decimals
      "0x233Ec95FeDd477F524EAC2cbDd69423A70185707", // mint authority
    );

    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Log the event details
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed?.name === "ERC20ForSplCreated";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsedEvent = factory.interface.parseLog(event);
      console.log("\n🎉 Token Creation Successful!");
      console.log("New token address:", parsedEvent?.args.pair);
      console.log("Mint hash:", parsedEvent?.args._mint);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
