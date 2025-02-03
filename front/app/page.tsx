"use client"
import {useAccount} from "wagmi";

export default function Home() {
    const {isConnected} = useAccount();
    return (
        <main className="flex justify-center items-end w-[100dvw] h-[100dvh]">
            <div className="max-w-1/2">
                <div className="flex justify-center items-center p-4">
                    <w3m-connect-button size={'md'}/>
                </div>
            </div>
        </main>
    );
}