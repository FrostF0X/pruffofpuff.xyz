"use client"
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import contracts from '../../contracts/deployedContracts';

import {
    useConnectors,
    useWriteContract,
} from 'wagmi';
import {parseEther} from "viem";
import {chain, tempGas} from "@/lib/wagmi";

const MintPage = () => {
    const wallets = useConnectors();
    const params = useSearchParams();
    const router = useRouter();
    const identifier = params.get('identifier') as string;
    const walletAddress = params.get('walletAddress') as string;
    const [initiated, setInitiated] = useState<boolean>(false);
    const {writeContract, isSuccess, isError, error} = useWriteContract();

    if (!initiated && wallets.length) {
        setTimeout(() => {
            writeContract({
                abi: contracts[chain.id].PruffOfPuff.abi,
                address: contracts[chain.id].PruffOfPuff.address,
                functionName: 'mint',
                args: [walletAddress, identifier],
                value: parseEther(tempGas)
            })
        }, 3000);
        setInitiated(true);
    }


    useEffect(() => {
        if (isSuccess) {
            // If the user is a pruffer, redirect them to the create page
            const url = new URL('/configure', window.location.origin);
            url.searchParams.set('identifier', identifier);
            // Pass the selected puffs as a query parameter to the upload page
            router.push(url.href);
        }
    }, [isSuccess, router, identifier]);

    return (
        <div>
            <h1>Minting your nft....</h1>
            {isError ? error!.toString() : ''}
        </div>
    );
};

export default MintPage;
