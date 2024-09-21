"use client"
import {useRouter} from 'next/navigation';

import {useState} from 'react';
import Select from 'react-select';

const puffsOptions = [
    {value: 'pepe', label: 'Pepe'},
    {value: 'heart', label: 'Heart'},
    {value: 'chessboard', label: 'Chessboard'},
];

const Main = () => {
    const [selectedPuff, setSelectedPuff] = useState<{value: string}[]>([]);
    const router = useRouter();

    const handleSubmit = () => {
        if (selectedPuff.length === 0) {
            alert('Please select at least one puff.');
            return;
        }

        const puffValues = JSON.stringify(selectedPuff.map((puff) => puff.value));

        const url = new URL('/upload', window.location.origin);
        url.searchParams.set('puffs', puffValues);
        // Pass the selected puffs as a query parameter to the upload page
        router.push(url.href);
    };

    return (
        <div>
            <h1>Select Puffs for Your NFT</h1>
            <Select
                isMulti
                options={puffsOptions}
                value={selectedPuff}
                onChange={(newValue) => {setSelectedPuff(newValue.map(i => i))}}
                placeholder="Select your puff(s)"
            />
            <button onClick={handleSubmit}>Submit and Upload</button>
        </div>
    );
};

export default Main;
