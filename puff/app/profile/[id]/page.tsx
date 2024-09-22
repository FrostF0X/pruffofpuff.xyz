"use client"
export const runtime = 'edge';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useRouter} from 'next/navigation';
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {useReadContract} from "wagmi";
import contracts from "@/contracts/deployedContracts";
import {chain} from "@/lib/wagmi";

const NFTPage = () => {
    const [loading, setLoading] = useState(true);
    const [nftData, setNftData] = useState<{
        telegramUsername: string,
        username: string,
        firstName: string,
        lastName: string,
        jobTitle: string,
        tshirtSize: string,
    } | null>(null);
    const [error] = useState(null);
    const {id} = useParams();
    const router = useRouter();
    const {setShowDynamicUserProfile} = useDynamicContext();
    const {data: isOwner, isSuccess} = useReadContract({
        abi: contracts[chain.id].PruffOfPuff.abi,
        address: contracts[chain.id].PruffOfPuff.address,
        functionName: 'ownsNFTWithURI',
        args: [id as string],
    });

    useEffect(() => {
        if (!id) return; // If no ID is provided, wait for router to fully initialize

        const fetchNFTData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${apiUrl}/nft/${id}`);
                setNftData(response.data);

                // Redirect based on redemption status
                if (!response.data.redeemed) {
                    const url = new URL(`/profile/redeem/${id}`, window.location.origin);
                    url.searchParams.set('privateKey', response.data.privateKey);
                    router.push(url.href);
                } else {

                }
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTData();
    }, [id, router]);

    if (!nftData || loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div><a href={`https://t.me/${nftData.telegramUsername}`}
                    className="href">TELEGRAM: {nftData.telegramUsername}</a></div>
            <div>USERNAME: {nftData.username}</div>
            <div>FIRST NAME: {nftData.firstName}</div>
            <div>LAST NAME: {nftData.lastName}</div>
            <div>JOB TITLE: {nftData.jobTitle}</div>
            <div>Tshirt SIZE: {nftData.tshirtSize}</div>
            {isSuccess && isOwner ? <button onClick={() => {
                setShowDynamicUserProfile(true);
            }}>EDIT PROFILE
            </button> : null}
            <div className="">{}</div>
        </div>
    );
};

export default NFTPage;
