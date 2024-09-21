'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { useConnect, useSendTransaction } from 'wagmi';
import { config } from '@lib/wagmi'; // Import wagmi config

const RedeemPage = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initiated, setInitiated] = useState<boolean>(false);

    const router = useRouter();
    const params = useSearchParams();
    const privateKeyParam = params.get('privateKey') as string;

    const { connect, connectors, isConnected } = useConnect();

    useEffect(() => {
        // If not connected, attempt connection
        if (!isConnected && connectors.length > 0) {
            connect(connectors[0]);
        }
    }, [connect, connectors, isConnected]);

    useEffect(() => {
        if (isConnected && connectors.length > 0) {
            setWalletAddress(connectors[0].address);
        }
    }, [isConnected, connectors]);

    useEffect(() => {
        const redeemNFT = async () => {
            if (!privateKeyParam || !walletAddress || initiated) return;

            try {
                // Create wallet client using Viem and privateKey
                const client = createWalletClient({
                    chain: mainnet, // Change to appropriate chain
                    transport: http(),
                });

                // Create account using the provided private key
                const account = privateKeyToAccount(privateKeyParam);

                // Send transaction to redeem the NFT
                const { data: hash } = await client.sendTransaction({
                    account,
                    to: walletAddress,
                    value: parseEther('0.001'), // Adjust the value accordingly
                });

                setTransactionHash(hash);
                setInitiated(true);

                // If successful, redirect to the profile page
                router.push('/profile');
            } catch (err) {
                setError('Failed to redeem NFT.');
                console.error('Redeem error:', err);
            }
        };

        redeemNFT();
    }, [privateKeyParam, walletAddress, initiated, router]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!walletAddress) {
        return <div>Connecting your wallet...</div>;
    }

    return (
        <div>
            <h1>Redeeming your NFT...</h1>
            {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
        </div>
    );
};

export default RedeemPage;
