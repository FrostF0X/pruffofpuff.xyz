"use client"
import {Suspense, useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {privateKeyToAccount} from 'viem/accounts';

import axios from 'axios';

const ActualPage = () => {
    const params = useSearchParams();
    const puffs = params.get('puffs');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const uploadData = async () => {
            if (!puffs) {
                setError('No puffs selected.');
                return;
            }

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/nft`, {
                    puffs: JSON.parse(puffs as string),
                    partnerName: 'flow',
                });

                const {identifier, privateKey} = response.data;

                const address =  privateKeyToAccount(privateKey);
                const url = new URL('/mint', window.location.origin);
                url.searchParams.set('identifier', identifier);
                url.searchParams.set('walletAddress', address.address);
                // Pass the selected puffs as a query parameter to the upload page
                router.push(url.href);
            } catch (error) {
                setError('Upload failed. Please try again.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        uploadData();
    }, [router, puffs]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Uploading Your NFT Data...</h1>
            {loading ? <p>Loading...</p> : <p>Upload complete! Redirecting...</p>}
        </div>
    );
};

export function UploadPage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <ActualPage />
        </Suspense>
    )
}
export default UploadPage;
