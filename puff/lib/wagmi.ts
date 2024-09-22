import {http, createConfig} from "wagmi";
import {flowTestnet} from "viem/chains";

export const chain = flowTestnet;
export const tempGas = '0.01';
export const rpc = http('https://testnet.evm.nodes.onflow.org');

export const config = createConfig({
    chains: [
        chain
    ],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
        [chain.id]: rpc,
    },
});


declare module "wagmi" {
}
