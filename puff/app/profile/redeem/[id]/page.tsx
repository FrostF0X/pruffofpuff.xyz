'use client';

import {useEffect, useState} from 'react';
import {useParams, useSearchParams, useRouter} from 'next/navigation';
import {createWalletClient, parseEther, parseGwei} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import contracts from '../../../../contracts/deployedContracts';

import {DynamicWidget, useDynamicContext, useUserWallets} from '@dynamic-labs/sdk-react-core';
import axios from "axios";
import {chain, rpc, tempGas} from "@/lib/wagmi";

function Authentication() {
    const userWallets = useUserWallets();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        if (userWallets.length > 0) {
            // Set the wallet address when the user is authenticated
            setWalletAddress(userWallets[0].address);
        }
    }, [userWallets]);

    if (!walletAddress) {
        return <DynamicWidget/>;
    }

    // Pass the walletAddress to the logged-in user component
    return <Page walletAddress={walletAddress as `0x${string}`}/>;
}

const Page = ({walletAddress}: { walletAddress: `0x${string}` }) => {
    const router = useRouter();
    const {id} = useParams();
    const params = useSearchParams();
    const privateKeyParam = params.get('privateKey') as `0x${string}`;
    const {user} = useDynamicContext();
    const [started, setStarted] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            if (!user || started) {
                return;
            }
            setStarted(true);

            const client = createWalletClient({
                chain: chain,
                transport: rpc,
            });

            const account = privateKeyToAccount(privateKeyParam);
            await client.writeContract({
                abi: contracts[chain.id].PruffOfPuff.abi,
                address: contracts[chain.id].PruffOfPuff.address,
                functionName: 'transferFirstNFT',
                args: [walletAddress],
                account
            });
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(`${apiUrl}/nft/${id}/redeemed`);
            await axios.patch(`${apiUrl}/nft/${id}/connect-dynamic`, {dynamicUserId: user.userId});
            await router.push(`/profile/${id}`);
        })();
    }, [privateKeyParam, walletAddress, id, user, router, started]);


    return (
        <div>
            <h1>Redeeming your NFT...</h1>
        </div>
    );
};

const RedeemPage = () => {
    return <Authentication/>;
};

export default RedeemPage;
