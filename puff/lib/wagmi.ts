
import { http, createConfig } from "wagmi";
import {flowTestnet, mainnet} from "wagmi/chains";

export const config = createConfig({
  chains: [flowTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [flowTestnet.id]: http('https://testnet.evm.nodes.onflow.org'),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
