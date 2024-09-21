"use client"
import {useRouter, useSearchParams} from 'next/navigation';

const ConfigurePage = () => {
    const router = useRouter();
    const params = useSearchParams();
    const identifier = params.get('identifier');

    const payload = {
        "payload": {
            "tech": "Ndef",
            "tnf": 1,
            "rtd": "U",
            "value": {"value": `https://pruffofpuff.pages.dev/user/${identifier}`}
        }
    };
    router.push('com.washow.nfcopenrewriter://share?data=' + encodeURIComponent(JSON.stringify(payload)));
};

export default ConfigurePage;
