'use client';

import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {createWalletClient, http, parseEther} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import {mainnet} from 'viem/chains';

import {DynamicWidget, useUserWallets} from '@dynamic-labs/sdk-react-core';
import {useEffect, useState} from 'react';

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
        return <DynamicWidget></DynamicWidget>;
    }

    // Pass the walletAddress to the logged-in user component
    return <Redeem walletAddress={walletAddress}/>;
}

const Redeem = ({walletAddress}: { walletAddress: string }) => {
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initiated, setInitiated] = useState<boolean>(false);

    const router = useRouter();
    const {id} = useParams();
    const params = useSearchParams();
    const privateKeyParam = params.get('privateKey') as `0x${string}`;

    useEffect(() => {
        const redeemNFT = async () => {
            if (!privateKeyParam || !walletAddress || initiated) return;

            try {
                // Create wallet client using Viem and privateKey
                const client = createWalletClient({
                    chain: mainnet,
                    transport: http(),
                });

                // Create account using the provided private key
                const account = privateKeyToAccount(privateKeyParam);

                // Send transaction to redeem the NFT
                const hash = await client.sendTransaction({
                    account,
                    to: walletAddress,
                    value: parseEther('0.001'), // Adjust the value accordingly
                });

                setTransactionHash(hash);
                setInitiated(true);

                // If successful, redirect to the profile page
                router.push(`/profile/${id}`);
            } catch (err) {
                setError('Failed to redeem NFT.');
                console.error('Redeem error:', err);
            }
        };

        redeemNFT();
    }, [privateKeyParam, walletAddress, initiated, router]);

    return (
        <div>
            <h1>Redeeming your NFT...</h1>
            {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}
const RedeemPage = () => {
    return <Authentication></Authentication>;
};

export default RedeemPage;
