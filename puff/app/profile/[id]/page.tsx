"use client"
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useRouter} from 'next/navigation';
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";

const NFTPage = () => {
    const [loading, setLoading] = useState(true);
    const [nftData, setNftData] = useState(null);
    const [error] = useState(null);
    const {id} = useParams();
    const router = useRouter();
    const {setShowDynamicUserProfile} = useDynamicContext();

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div><a href={`https://t.me/${nftData.telegramUsername}`} className="href">TELEGRAM: {nftData.telegramUsername}</a></div>
            <div>USERNAME: {nftData.username}</div>
            <div>FIRST NAME: {nftData.firstName}</div>
            <div>LAST NAME: {nftData.lastName}</div>
            <div>JOB TITLE: {nftData.jobTitle}</div>
            <div>Tshirt SIZE: {nftData.tshirtSize}</div>
            <button onClick={() => {
                setShowDynamicUserProfile(true);
            }}>EDIT PROFILE
            </button>
            <div className="">{}</div>
        </div>
    );
};

export default NFTPage;
