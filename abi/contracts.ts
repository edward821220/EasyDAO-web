export const CONTRACT_INFOS = {
  DiamondFactory: {
    address: "0x387D764668DfFE58D746b3365cb588b76dbc8bbA",
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
  DiamondCutFacet: {
    address: "0x0ebebE0CfD9733B9268aF75fBf2086b18f47671d",
    abi: [
      {
        type: "function",
        name: "diamondCut",
        inputs: [
          {
            name: "_diamondCut",
            type: "tuple[]",
            internalType: "struct IDiamondCut.FacetCut[]",
            components: [
              {
                name: "facetAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "action",
                type: "uint8",
                internalType: "enum IDiamondCut.FacetCutAction",
              },
              {
                name: "functionSelectors",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
            ],
          },
          { name: "_init", type: "address", internalType: "address" },
          { name: "_calldata", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "diamondCutByProposal",
        inputs: [
          {
            name: "_diamondCut",
            type: "tuple[]",
            internalType: "struct IDiamondCut.FacetCut[]",
            components: [
              {
                name: "facetAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "action",
                type: "uint8",
                internalType: "enum IDiamondCut.FacetCutAction",
              },
              {
                name: "functionSelectors",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
            ],
          },
          { name: "_init", type: "address", internalType: "address" },
          { name: "_calldata", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "event",
        name: "DiamondCut",
        inputs: [
          {
            name: "_diamondCut",
            type: "tuple[]",
            indexed: false,
            internalType: "struct IDiamondCut.FacetCut[]",
            components: [
              {
                name: "facetAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "action",
                type: "uint8",
                internalType: "enum IDiamondCut.FacetCutAction",
              },
              {
                name: "functionSelectors",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
            ],
          },
          {
            name: "_init",
            type: "address",
            indexed: false,
            internalType: "address",
          },
          {
            name: "_calldata",
            type: "bytes",
            indexed: false,
            internalType: "bytes",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "DiamondCut",
        inputs: [
          {
            name: "_diamondCut",
            type: "tuple[]",
            indexed: false,
            internalType: "struct IDiamondCut.FacetCut[]",
            components: [
              {
                name: "facetAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "action",
                type: "uint8",
                internalType: "enum IDiamondCut.FacetCutAction",
              },
              {
                name: "functionSelectors",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
            ],
          },
          {
            name: "_init",
            type: "address",
            indexed: false,
            internalType: "address",
          },
          {
            name: "_calldata",
            type: "bytes",
            indexed: false,
            internalType: "bytes",
          },
        ],
        anonymous: false,
      },
      {
        type: "error",
        name: "InitializationFunctionReverted",
        inputs: [
          {
            name: "_initializationContractAddress",
            type: "address",
            internalType: "address",
          },
          { name: "_calldata", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
  },
  DiamondLoupeFacet: {
    address: "0x937a6B316E226E8de1E7AE196B1ADC11A15D4256",
    abi: [
      {
        type: "function",
        name: "facetAddress",
        inputs: [
          {
            name: "_functionSelector",
            type: "bytes4",
            internalType: "bytes4",
          },
        ],
        outputs: [
          {
            name: "facetAddress_",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "facetAddresses",
        inputs: [],
        outputs: [
          {
            name: "facetAddresses_",
            type: "address[]",
            internalType: "address[]",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "facetFunctionSelectors",
        inputs: [{ name: "_facet", type: "address", internalType: "address" }],
        outputs: [
          {
            name: "facetFunctionSelectors_",
            type: "bytes4[]",
            internalType: "bytes4[]",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "facets",
        inputs: [],
        outputs: [
          {
            name: "facets_",
            type: "tuple[]",
            internalType: "struct IDiamondLoupe.Facet[]",
            components: [
              {
                name: "facetAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelectors",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "supportsInterface",
        inputs: [
          { name: "_interfaceId", type: "bytes4", internalType: "bytes4" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
    ],
  },
  DaoFacet: {
    address: "0x08C5F8b5A23370E8981Fe1f498AF506AB81CB57c",
    abi: [
      {
        type: "function",
        name: "allowance",
        inputs: [
          { name: "owner", type: "address", internalType: "address" },
          { name: "spender", type: "address", internalType: "address" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "approve",
        inputs: [
          { name: "spender", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "balanceOfAt",
        inputs: [
          { name: "account", type: "address", internalType: "address" },
          { name: "snapshotId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "cancelProposal",
        inputs: [
          { name: "proposalId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "checkIsVoted",
        inputs: [
          { name: "proposalId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "checkProposal",
        inputs: [
          { name: "proposalId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct Proposal",
            components: [
              { name: "id", type: "uint256", internalType: "uint256" },
              { name: "author", type: "address", internalType: "address" },
              {
                name: "createdAt",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "votesYes",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "votesNo", type: "uint256", internalType: "uint256" },
              { name: "data", type: "bytes", internalType: "bytes" },
              {
                name: "status",
                type: "uint8",
                internalType: "enum Status",
              },
              {
                name: "snapshotId",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "createProposal",
        inputs: [
          { name: "data_", type: "bytes", internalType: "bytes" },
          { name: "proposalType", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
        ],
        outputs: [
          { name: "proposalId", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "daoName",
        inputs: [],
        outputs: [{ name: "", type: "string", internalType: "string" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "decimals",
        inputs: [],
        outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
        stateMutability: "pure",
      },
      {
        type: "function",
        name: "executeProposal",
        inputs: [
          { name: "proposalId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "getProposals",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "tuple[]",
            internalType: "struct Proposal[]",
            components: [
              { name: "id", type: "uint256", internalType: "uint256" },
              { name: "author", type: "address", internalType: "address" },
              {
                name: "createdAt",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "votesYes",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "votesNo", type: "uint256", internalType: "uint256" },
              { name: "data", type: "bytes", internalType: "bytes" },
              {
                name: "status",
                type: "uint8",
                internalType: "enum Status",
              },
              {
                name: "snapshotId",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "mintByProposal",
        inputs: [
          {
            name: "receivers",
            type: "tuple[]",
            internalType: "struct Receiver[]",
            components: [
              {
                name: "receiver",
                type: "address",
                internalType: "address",
              },
              { name: "amount", type: "uint256", internalType: "uint256" },
            ],
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [{ name: "", type: "string", internalType: "string" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [{ name: "", type: "string", internalType: "string" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "totalSupplyAt",
        inputs: [
          { name: "snapshotId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          { name: "to", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "transferFrom",
        inputs: [
          { name: "from", type: "address", internalType: "address" },
          { name: "to", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "vote",
        inputs: [
          { name: "proposalId", type: "uint256", internalType: "uint256" },
          { name: "side", type: "uint8", internalType: "enum Side" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            name: "owner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "spender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ProposalCreated",
        inputs: [
          {
            name: "proposalId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "totalSupplySnapshot",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
          {
            name: "proposalType",
            type: "string",
            indexed: false,
            internalType: "string",
          },
          {
            name: "description",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "error",
        name: "ERC20InsufficientAllowance",
        inputs: [
          { name: "spender", type: "address", internalType: "address" },
          { name: "allowance", type: "uint256", internalType: "uint256" },
          { name: "needed", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        type: "error",
        name: "ERC20InsufficientBalance",
        inputs: [
          { name: "sender", type: "address", internalType: "address" },
          { name: "balance", type: "uint256", internalType: "uint256" },
          { name: "needed", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        type: "error",
        name: "ERC20InvalidApprover",
        inputs: [
          { name: "approver", type: "address", internalType: "address" },
        ],
      },
      {
        type: "error",
        name: "ERC20InvalidReceiver",
        inputs: [
          { name: "receiver", type: "address", internalType: "address" },
        ],
      },
      {
        type: "error",
        name: "ERC20InvalidSender",
        inputs: [{ name: "sender", type: "address", internalType: "address" }],
      },
      {
        type: "error",
        name: "ERC20InvalidSpender",
        inputs: [{ name: "spender", type: "address", internalType: "address" }],
      },
    ],
  },
  DaoInit: {
    address: "0xa3BbE6336A58cd96CDF1316FF926e0E42D26F5d4",
    abi: [
      {
        type: "function",
        name: "init",
        inputs: [
          { name: "diamond", type: "address", internalType: "address" },
          { name: "daoName", type: "string", internalType: "string" },
          { name: "tokenName", type: "string", internalType: "string" },
          { name: "tokenSymbol", type: "string", internalType: "string" },
          {
            name: "foundersInfo",
            type: "tuple[]",
            internalType: "struct FounderInfo[]",
            components: [
              { name: "founder", type: "address", internalType: "address" },
              { name: "shares", type: "uint256", internalType: "uint256" },
            ],
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
    ],
  },
  OwnershipFacet: {
    address: "0x7E374A3d3761B0E1160babB94c87C2c0cB4Ea804",
    abi: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [{ name: "owner_", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          { name: "_newOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
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
    ],
  },
  OwnershipInit: {
    address: "0xDa50ad6104f097e8E4b63eA97Ee3fF67d6a93fDA",
    abi: [
      {
        type: "function",
        name: "init",
        inputs: [
          { name: "newOwner", type: "address", internalType: "address" },
        ],
        outputs: [],
        stateMutability: "payable",
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
    ],
  },
  DividendFacet: {
    address: "0x2D615c5Fb20822F16537e45f91FCc70D0b321441",
    abi: [
      {
        type: "function",
        name: "calculateDividend",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getAnnualRate",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getDuration",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getInitialBalance",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getReleasedDividend",
        inputs: [],
        outputs: [
          {
            name: "releasedDividend",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getStartTime",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getTotalDividend",
        inputs: [],
        outputs: [
          {
            name: "totalDividend",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "withdrawDividend",
        inputs: [],
        outputs: [
          { name: "dividend", type: "uint256", internalType: "uint256" },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
    ],
  },
  DividendInit: {
    address: "0xA0CA0361751b41D1FF515DAE966bF437b3f73f28",
    abi: [
      {
        type: "function",
        name: "init",
        inputs: [
          { name: "duration", type: "uint256", internalType: "uint256" },
          { name: "annualRate", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "payable",
      },
    ],
  },
  VaultFacet: {
    address: "0x5790D013724f35bb28f5bde98ceA3F0f7cdFCd80",
    abi: [
      {
        type: "function",
        name: "ETH",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "checkCrowdfundingInfo",
        inputs: [
          {
            name: "crowdfundingId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "",
            type: "tuple",
            internalType: "struct CrowdfundingInfo",
            components: [
              {
                name: "crowdfundingInitiator",
                type: "address",
                internalType: "address",
              },
              { name: "title", type: "string", internalType: "string" },
              { name: "token", type: "address", internalType: "address" },
              {
                name: "targetAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "currentAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "withdrawnAmount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "checkCrowdfundingInfos",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "tuple[]",
            internalType: "struct CrowdfundingInfo[]",
            components: [
              {
                name: "crowdfundingInitiator",
                type: "address",
                internalType: "address",
              },
              { name: "title", type: "string", internalType: "string" },
              { name: "token", type: "address", internalType: "address" },
              {
                name: "targetAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "currentAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "withdrawnAmount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "contributeERC20",
        inputs: [
          {
            name: "crowdfundingId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "contributeETH",
        inputs: [
          {
            name: "crowdfundingId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "payable",
      },
      {
        type: "function",
        name: "createCrowdfundingERC20",
        inputs: [
          { name: "title", type: "string", internalType: "string" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "createCrowdfundingETH",
        inputs: [
          { name: "title", type: "string", internalType: "string" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "onERC721Received",
        inputs: [
          { name: "", type: "address", internalType: "address" },
          { name: "from", type: "address", internalType: "address" },
          { name: "tokenId", type: "uint256", internalType: "uint256" },
          { name: "", type: "bytes", internalType: "bytes" },
        ],
        outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "withdrawERC20ByCrowdfunding",
        inputs: [
          {
            name: "crowdfundingId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "withdrawERC20ByProposal",
        inputs: [
          { name: "to", type: "address", internalType: "address" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "withdrawETHByCrowdfunding",
        inputs: [
          {
            name: "crowdfundingId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "withdrawNFTByOwner",
        inputs: [
          { name: "NFTContract", type: "address", internalType: "address" },
          { name: "tokenId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "wtihdrawETHByProposal",
        inputs: [
          { name: "to", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
  },
  VaultInit: {
    address: "0x0Fa9DD0d42cda3Dcc67A9835E82b38672613d644",
    abi: [
      {
        type: "function",
        name: "init",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
      },
    ],
  },
} as const;
