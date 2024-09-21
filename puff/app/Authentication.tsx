'use client';

import {DynamicWidget, useUserWallets} from '@dynamic-labs/sdk-react-core';
import {useEffect, useState} from 'react';
import LoggedInUser from './LoggedInUser';

export default function Authentication() {
    const userWallets = useUserWallets();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        if (userWallets.length > 0) {
            // Set the wallet address when the user is authenticated
            setWalletAddress(userWallets[0].address);
        }
    }, [userWallets]);

    if (!walletAddress) {
        return <DynamicWidget></DynamicWidget>;
    }

    // Pass the walletAddress to the logged-in user component
    return <LoggedInUser walletAddress={walletAddress}/>;
}
