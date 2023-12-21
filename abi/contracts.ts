import { Abi } from "viem";
import { Address } from "viem";

type ContractName =
  | "DiamondFactory"
  | "DiamondCutFacet"
  | "DiamondLoupeFacet"
  | "DaoFacet"
  | "DaoInit"
  | "OwnershipFacet"
  | "OwnershipInit"
  | "DividendFacet"
  | "DividendInit"
  | "VaultFacet"
  | "VaultInit";

interface ContractInfo {
  address: Address;
  abi?: Abi;
}

export const CONTRACT_INFOS: Record<ContractName, ContractInfo> = {
  DiamondFactory: {
    address: "0xa4d7C0F45B8b37Cad8F87bbD20C057A5a64A3aeD",
    abi: [
      { type: "constructor", inputs: [], stateMutability: "nonpayable" },
      { type: "fallback", stateMutability: "payable" },
      { type: "receive", stateMutability: "payable" },
      {
        type: "function",
        name: "DAOs",
        inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        outputs: [
          { name: "daoAddress", type: "address", internalType: "address" },
          { name: "daoName", type: "string", internalType: "string" },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "createDAODiamond",
        inputs: [
          { name: "daoName", type: "string", internalType: "string" },
          {
            name: "foundersInfo",
            type: "tuple[]",
            internalType: "struct FounderInfo[]",
            components: [
              { name: "founder", type: "address", internalType: "address" },
              { name: "shares", type: "uint256", internalType: "uint256" },
            ],
          },
          { name: "tokenName", type: "string", internalType: "string" },
          { name: "tokenSymbol", type: "string", internalType: "string" },
          {
            name: "diamondCutFacet",
            type: "address",
            internalType: "address",
          },
          {
            name: "diamondLoupeFacet",
            type: "address",
            internalType: "address",
          },
          { name: "daoFacet", type: "address", internalType: "address" },
          { name: "daoInit", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "getDAO",
        inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct DAOInfo",
            components: [
              {
                name: "daoAddress",
                type: "address",
                internalType: "address",
              },
              { name: "daoName", type: "string", internalType: "string" },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getDAOs",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "tuple[]",
            internalType: "struct DAOInfo[]",
            components: [
              {
                name: "daoAddress",
                type: "address",
                internalType: "address",
              },
              { name: "daoName", type: "string", internalType: "string" },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          { name: "newOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "withdraw",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "DAOCreated",
        inputs: [
          {
            name: "daoAddress",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "founder",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "daoName",
            type: "string",
            indexed: true,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "OwnershipTransferred",
        inputs: [
          {
            name: "previousOwner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "newOwner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "error",
        name: "OwnableInvalidOwner",
        inputs: [{ name: "owner", type: "address", internalType: "address" }],
      },
      {
        type: "error",
        name: "OwnableUnauthorizedAccount",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
      },
    ],
  },
  DiamondCutFacet: { address: "0x0ebebE0CfD9733B9268aF75fBf2086b18f47671d" },
  DiamondLoupeFacet: { address: "0x937a6B316E226E8de1E7AE196B1ADC11A15D4256" },
  DaoFacet: { address: "0xA1F41c2519852cf7DabF91Bf03B4d18C35E08194" },
  DaoInit: { address: "0xa3BbE6336A58cd96CDF1316FF926e0E42D26F5d4" },
  OwnershipFacet: { address: "0x7E374A3d3761B0E1160babB94c87C2c0cB4Ea804" },
  OwnershipInit: { address: "0xDa50ad6104f097e8E4b63eA97Ee3fF67d6a93fDA" },
  DividendFacet: { address: "0x7063d56a8ceFeC2D767C07d95ec76BFaAF4E55CA" },
  DividendInit: { address: "0xA0CA0361751b41D1FF515DAE966bF437b3f73f28" },
  VaultFacet: { address: "0x5790D013724f35bb28f5bde98ceA3F0f7cdFCd80" },
  VaultInit: { address: "0x0Fa9DD0d42cda3Dcc67A9835E82b38672613d644" },
};
