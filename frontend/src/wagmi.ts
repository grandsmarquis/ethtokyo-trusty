import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia,
} from 'wagmi/chains';
import { http } from 'wagmi';


export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'cf7be6c065dcb37b5f5fed8564d31af4',
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http("https://rpc2.sepolia.org"),
  },
  ssr: true,
});