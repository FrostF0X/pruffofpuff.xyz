"use client"
import {useRouter, useSearchParams} from 'next/navigation';
import React, {Suspense} from "react";

const ActualPage = () => {
    const router = useRouter();
    const params = useSearchParams();
    const identifier = params.get('identifier');

    const payload = {
        "payload": {
            "tech": "Ndef",
            "tnf": 1,
            "rtd": "U",
            "value": {"value": `https://pruffofpuff-xyz.pages.dev/profile/${identifier}`}
        }
    };
    router.push('com.washow.nfcopenrewriter://share?data=' + JSON.stringify(payload));
    return "";
};
const Page = () => {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <ActualPage/>
        </Suspense>
    )
}
export default Page;
