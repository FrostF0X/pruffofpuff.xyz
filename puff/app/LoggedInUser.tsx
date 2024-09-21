'use client';

import {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useReadContract } from 'wagmi';
import './page.css';
import contracts from '../contracts/deployedContracts';
// Contract details

interface LoggedInUserProps {
    walletAddress: string;
}

export default function LoggedInUser({ walletAddress }: LoggedInUserProps) {
    const router = useRouter();

    // Read from contract using useReadContract
    const { data: isPruffer, error, isLoading, status } = useReadContract({
        abi: contracts["545"].PruffOfPuff.abi,
        address: contracts["545"].PruffOfPuff.address,
        functionName: 'isPruffer',
        args: [walletAddress],
    });

    useEffect(() => {
        if (isPruffer) {
            // If the user is a pruffer, redirect them to the create page
            router.push('/create');
        }
    }, [isPruffer, router]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (<div>{`${isPruffer} ${status}`}</div>);
}
