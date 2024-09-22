'use client';

import React, {Suspense, useEffect, useState} from 'react';
import {useParams, useSearchParams, useRouter} from 'next/navigation';
import {createWalletClient} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import contracts from '../../../../contracts/deployedContracts';

import {DynamicWidget, useDynamicContext, UserProfile, useUserWallets} from '@dynamic-labs/sdk-react-core';
import axios from "axios";
import {chain, rpc} from "@/lib/wagmi";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

function Authentication() {
    const userWallets = useUserWallets();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const {user} = useDynamicContext();
    const params = useSearchParams();
    const router = useRouter();
    const {id} = useParams();

    useEffect(() => {
        if (userWallets.length > 0) {
            // Set the wallet address when the user is authenticated
            setWalletAddress(userWallets[0].address);
        }
    }, [userWallets]);

    if (!walletAddress) {
        return <DynamicWidget/>;
    }

    const privateKeyParam = params.get('privateKey') as `0x${string}`;

    if (!user) {
        return <div>Loading</div>;
    }

    return <ActualPage
        walletAddress={walletAddress as `0x${string}`}
        privateKeyParam={privateKeyParam}
        user={user}
        id={id as string}
        router={router}
    />;
}

interface PageProps {
    walletAddress: `0x${string}`;
    privateKeyParam: `0x${string}`;
    user: UserProfile;
    id: string;
    router: AppRouterInstance;
}

class ActualPage extends React.Component<PageProps, { started: boolean }> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            started: false
        };
    }

    async componentDidMount() {
        const {user, walletAddress, privateKeyParam, id, router} = this.props;

        this.setState({started: true});

        const client = createWalletClient({
            chain: chain,
            transport: rpc,
        });

        const account = privateKeyToAccount(privateKeyParam);

        // Write contract to transfer NFT
        await client.writeContract({
            abi: contracts[chain.id].PruffOfPuff.abi,
            address: contracts[chain.id].PruffOfPuff.address,
            functionName: 'transferFirstNFT',
            args: [walletAddress],
            gasPrice: BigInt(100000000),
            account
        });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Redeem NFT and connect dynamic user
        await axios.post(`${apiUrl}/nft/${id}/redeemed`);
        await axios.patch(`${apiUrl}/nft/${id}/connect-dynamic`, {dynamicUserId: user.userId});

        // Redirect to profile page
        await router.push(`/profile/${id}`);
    }

    render() {
        return (
            <div>
                <h1>Redeeming your NFT...</h1>
            </div>
        );
    }
}

const Page = () => {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <Authentication />
        </Suspense>
    )
}
export default Page;