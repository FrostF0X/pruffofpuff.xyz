/** @type {import('next').NextConfig} */
const cspHeader = `
    default-src 'self';
    frame-src 'self' https://secure.walletconnect.org/;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live https://*.vercel.app https://www.google.com https://www.gstatic.com https://*.google.com https://www.paypal.com https://www.paypalobjects.com https://auth.magic.link https://pruffofpuff-xyz.vercel.app;
    style-src 'self' 'unsafe-inline';
    connect-src https://api.web3modal.org;
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
