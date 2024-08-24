import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { scrollDevnet } from './scrollDevnet';


export const config = getDefaultConfig({
  appName: 'Trusty',
  projectId: 'cf7be6c065dcb37b5f5fed8564d31af4',
  chains: [
    scrollDevnet,
  ],
  ssr: true,
});