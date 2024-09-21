import {http, createConfig} from "wagmi";
import {sepolia} from "wagmi/chains";

export const chain = sepolia;
export const rpc = http('https://rpc.sepolia.org');
export const tempGas = '0.01';
// export const rpc = http('https://testnet.evm.nodes.onflow.org');

export const config = createConfig({
    chains: [
        chain
    ],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
        [chain.id]: http('https://rpc.sepolia.org'),
    },
});


declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
