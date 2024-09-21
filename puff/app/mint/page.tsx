"use client"
import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import contracts from '../../contracts/deployedContracts';

import {
    useConnectors,
    useWriteContract,
} from 'wagmi';
import {parseEther} from "viem";

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
                abi: contracts["545"].PruffOfPuff.abi,
                address: contracts["545"].PruffOfPuff.address,
                functionName: 'mint',
                args: [walletAddress, identifier],
                value: parseEther('0.01')
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
