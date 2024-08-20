"use client";

import { useState } from 'react';

const DownloadMusic = () => {
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [refreshList, setRefreshList] = useState(false); // State to trigger list refresh

    const handleDownload = async (downloadUrl) => {
        setMessage("Downloading...");
        try {
            const response = await fetch('http://localhost:5000/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: downloadUrl }),
            });

            if (response.ok) {
                const data = await response.text();
                setMessage(data);
                setRefreshList(true);
                setSearchResults([]);
            } else {
                setMessage('Failed to download video');
                console.log(await response.text());
            }
        } catch (error) {
            setMessage('Failed to download video');
        }
    };

    const handleSearch = async () => {
        setMessage("Searching for Titles...");
        setSearchResults([]);
        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword }),
            });

            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
                setMessage('');
            } else {
                setMessage('Failed to search');
            }
        } catch (error) {
            setMessage('Failed to search');
        }
    };

    return (
        <>
            <div className="flex justify-center items-center h-0 text-white text-lg font-mono m-2 p-10">
                Youtube Search
            </div>
            <div className='flex justify-center items-center space-x-2 mb-8'>
                <div className="h-10 w-full">
                    <input
                        name="searchInput"
                        className="rounded w-full h-full text-black outline-none p-2"
                        placeholder="Enter keyword..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        aria-label="Search keyword"
                        onKeyDown={(e)=>{
                            if(e.key == "Enter"){
                                handleSearch();
                            }
                        }}
                    />
                </div>
                <button
                    className="bg-blue-500 text-white rounded h-10 w-24 flex justify-center items-center active:scale-95"
                    onClick={handleSearch}
                    aria-label="Search"
                >
                    Search
                </button>
            </div>

            <div className="flex flex-col items-center m-1">
                {message && <p className="text-white">{message}</p>}
                <ul className="list-none ">
                    {searchResults.map((result, index) => (
                        <div className='transform transition-transform duration-200 hover:scale-105 active:scale-95 animate-fadeIn' >
                            <li
                                key={index}
                                className="mb-6 text-xl bg-slate-900 p-4 rounded-md cursor-pointer"
                                onClick={() => handleDownload(result.url)}
                            >
                                <span className="text-slate-500">{result.title}</span>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default DownloadMusic;
