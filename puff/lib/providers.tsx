'use client';

import {DynamicContextProvider} from "@dynamic-labs/sdk-react-core";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {DynamicWagmiConnector} from "@dynamic-labs/wagmi-connector";
import {config} from "@/lib/wagmi";


export default function Providers({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {

    const queryClient = new QueryClient();

    return (
        <DynamicContextProvider
            theme="auto"
            settings={{
                environmentId: "20ed69ff-950f-4e26-a4db-2148ab8af3ee",
                walletConnectors: [EthereumWalletConnectors],
                overrides: {
                    evmNetworks: networks => {
                        const flow = networks.find(n => n.chainId === 545);
                        if (flow) {
                            flow.name = 'Flow';
                        }
                        console.log(networks);
                        networks.reverse();
                        return networks;
                    }
                },
                events: {
                    onUserProfileUpdate: (e) => {
                        console.log(e);
                    },
                }
            }}
        >

            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <DynamicWagmiConnector>
                        {children}
                    </DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>

        </DynamicContextProvider>
    );
}