import { defineChain } from "viem";

export const scrollDevnet = /*#__PURE__*/ defineChain({
  id: 2227728,
  name: 'Scroll Devnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://l1sload-rpc.scroll.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scroll Devnet Blockscout',
      url: 'https://l1sload-blockscout.scroll.io',
      apiUrl: 'https://l1sload-blockscout.scroll.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 9473,
    },
  },
  testnet: true,
})