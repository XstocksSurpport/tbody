/** Minimal ABI for ThreeBody mint progress + ignition (`nova/foundry-threebody`). */
export const threeBodyAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'payable',
    inputs: [{ name: 'civ', type: 'uint8', internalType: 'enum Civilization' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'totalEthMinted',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'MAX_TOTAL_ETH',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'MAX_MINT_PER_ADDRESS',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'mintPrice',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'civilizationOf',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ type: 'uint8', internalType: 'enum Civilization' }],
  },
  {
    type: 'function',
    name: 'userStatus',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'civ', type: 'uint8', internalType: 'enum Civilization' },
      { name: 'lastActionTime', type: 'uint64', internalType: 'uint64' },
      { name: 'danger', type: 'uint64', internalType: 'uint64' },
      { name: 'bunkerUntil', type: 'uint64', internalType: 'uint64' },
      { name: 'ethMinted', type: 'uint256', internalType: 'uint256' },
      { name: 'lastActionBlock', type: 'uint256', internalType: 'uint256' },
    ],
  },
] as const;
