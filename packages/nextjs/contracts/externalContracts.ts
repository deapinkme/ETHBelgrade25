import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  31337: {
    USDC: {
      address: "0x512E48836Cd42F3eB6f50CEd9ffD81E0a7F15103",
      abi: [
        {
          inputs: [{ internalType: "bytes32", name: "_tokenMint", type: "bytes32" }],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [{ internalType: "uint256", name: "exceeded", type: "uint256" }],
          name: "AmountExceedsUint64",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "allowance", type: "uint256" },
            { internalType: "uint256", name: "needed", type: "uint256" },
          ],
          name: "ERC20InsufficientAllowance",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "uint256", name: "balance", type: "uint256" },
            { internalType: "uint256", name: "needed", type: "uint256" },
          ],
          name: "ERC20InsufficientBalance",
          type: "error",
        },
        {
          inputs: [{ internalType: "address", name: "receiver", type: "address" }],
          name: "ERC20InvalidReceiver",
          type: "error",
        },
        {
          inputs: [{ internalType: "address", name: "sender", type: "address" }],
          name: "ERC20InvalidSender",
          type: "error",
        },
        {
          inputs: [{ internalType: "address", name: "spender", type: "address" }],
          name: "ERC20InvalidSpender",
          type: "error",
        },
        {
          inputs: [{ internalType: "bytes32", name: "account", type: "bytes32" }],
          name: "EmptyAccount",
          type: "error",
        },
        {
          inputs: [{ internalType: "bytes32", name: "tokenMint", type: "bytes32" }],
          name: "InvalidTokenMint",
          type: "error",
        },
        {
          inputs: [{ internalType: "bytes32", name: "tokenMint", type: "bytes32" }],
          name: "MissingMetaplex",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "owner", type: "address" },
            { indexed: true, internalType: "address", name: "spender", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "owner", type: "address" },
            { indexed: true, internalType: "bytes32", name: "spender", type: "bytes32" },
            { indexed: false, internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "ApprovalSolana",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "bytes32", name: "to", type: "bytes32" },
            { indexed: false, internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "TransferSolana",
          type: "event",
        },
        {
          inputs: [],
          name: "ASSOCIATED_TOKEN_PROGRAM_ID",
          outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "CALL_SOLANA",
          outputs: [{ internalType: "contract ICallSolana", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "METAPLEX_PROGRAM",
          outputs: [{ internalType: "contract IMetaplexProgram", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "SOLANA_NATIVE",
          outputs: [{ internalType: "contract ISolanaNative", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "SPLTOKEN_PROGRAM",
          outputs: [{ internalType: "contract ISPLTokenProgram", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "TOKEN_PROGRAM_ID",
          outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes32", name: "spender", type: "bytes32" },
            { internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "approveSolana",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "balanceOfATA",
          outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "balanceOfPDA",
          outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
          name: "burn",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "burnFrom",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes32", name: "from", type: "bytes32" },
            { internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "claim",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes32", name: "from", type: "bytes32" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "claimTo",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "getAccountDelegateData",
          outputs: [
            { internalType: "bytes32", name: "", type: "bytes32" },
            { internalType: "uint64", name: "", type: "uint64" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "bytes32", name: "account", type: "bytes32" }],
          name: "getTokenMintATA",
          outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "solanaAccount",
          outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "tokenMint",
          outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "transferFrom",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes32", name: "to", type: "bytes32" },
            { internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "transferSolana",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "bytes32", name: "to", type: "bytes32" },
            { internalType: "uint64", name: "amount", type: "uint64" },
          ],
          name: "transferSolanaFrom",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
