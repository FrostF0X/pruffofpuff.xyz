"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [nftData, setNftData] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) return; // If no ID is provided, wait for router to fully initialize

        const fetchNFTData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${apiUrl}/api/nft/${id}`);
                setNftData(response.data);

                // Redirect based on redemption status
                if (response.data.redeemed) {
                    router.push('/profile');
                } else {
                    router.push(`/profile/redeem/${id}`);
                }
            } catch (error) {
                setError('Failed to fetch NFT data');
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

    // Render the page if NFT data is available but no redirection has occurred
    return (
        <div>
            <h1>NFT ID: {id}</h1>
            <p>Private Key: {nftData?.privateKey}</p>
            <p>Redeemed: {nftData?.redeemed ? 'Yes' : 'No'}</p>
            {/* Render any additional NFT details here */}
        </div>
    );
};

export default ProfilePage;
