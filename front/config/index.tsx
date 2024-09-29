import {defaultWagmiConfig} from "@web3modal/wagmi/react/config";
import {cookieStorage, createStorage} from "wagmi";
import {scroll, scrollSepolia} from "wagmi/chains";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
    name: "merch.wars",
    description: "Merch Wars",
    url: "https://pruffofpuff-xyz.vercel.app",
    icons: ["https://avatars.githubusercontent.com/u/37784886"]
};

// Create wagmiConfig
const chains = [scroll, scrollSepolia] as const;
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    auth: {
        email: true, // default to true
        socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
        showWallets: true, // default to true
        walletFeatures: true // default to true
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    })
});