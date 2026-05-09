/** Staking + ERC-20 targets for the home-page SATO / UPEG random-event strip (Ethereum mainnet). */

/** Countdown target: 2026-05-19 15:29 (UTC+8 / Asia–Shanghai). */
export const RANDOM_EVENT_TARGET_MS = new Date('2026-05-19T15:29:00+08:00').getTime();

export const SATO_AIRDROP_STAKING =
  '0xa8aE15A2aA06ad4e03f05E17cb61831c7Ce565a6' as const;

export const SATO_TOKEN_ADDRESS =
  '0x829f4b62eebe12af653b4dd4ffc480966f7d7f09' as const;

export const UPEG_TOKEN_ADDRESS =
  '0x44b28991b167582f18ba0259e0173176ca125505' as const;

export const erc20MinimalAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;
