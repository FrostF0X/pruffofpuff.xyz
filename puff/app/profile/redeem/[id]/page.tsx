'use client';

import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import {createWalletClient, http} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import contracts from '../../../../contracts/deployedContracts';

import {DynamicWidget, useUserWallets} from '@dynamic-labs/sdk-react-core';
import {flowTestnet} from "wagmi/chains";
import axios from "axios";
import {router} from "next/client";

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
    return <Page walletAddress={walletAddress}/>;
}

const Page = ({walletAddress}: { walletAddress: string }) => {
    const {id} = useParams();
    const params = useSearchParams();
    const privateKeyParam = params.get('privateKey') as `0x${string}`;

    // Create wallet client using Viem and privateKey

    useEffect(() => {
        (async () => {
            const client = createWalletClient({
                chain: flowTestnet,
                transport: http(),
            });

            // Create account using the provided private key
            const account = privateKeyToAccount(privateKeyParam);
            await client.writeContract({
                abi: contracts["545"].PruffOfPuff.abi,
                address: contracts["545"].PruffOfPuff.address,
                functionName: 'transferFirstNFT',
                args: [account.address, walletAddress],
                account
            });
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(`${apiUrl}/nft/${id}/redeemed`);
            const url = new URL(`/profile/redeem/${id}/edit`, window.location.origin);
            router.push(url.href);
        })();
    }, [privateKeyParam, walletAddress, id]);


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
