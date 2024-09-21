"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams, useRouter} from 'next/navigation';

const NFTPage = () => {
    const [loading, setLoading] = useState(true);
    const [, setNftData] = useState(null);
    const [error] = useState(null);
    const {id} = useParams();
    const router = useRouter();

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
            <div className="">{}</div>
        </div>
    );
};

export default NFTPage;
