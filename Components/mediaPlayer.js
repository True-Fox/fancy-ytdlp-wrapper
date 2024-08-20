"use client";

import { useState, useEffect } from 'react';

const MediaPlayer = ({ file }) => {
    const [audioUrl, setAudioUrl] = useState(null);

    const fetchAndPlay = async () => {
        try {
            const response = await fetch('http://localhost:5000/get-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: file }), // Send the filename in the request body
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            } else {
                console.error('Failed to fetch the song.');
            }
        } catch (error) {
            console.error('Error fetching the song:', error);
        }
    };

    useEffect(() => {
        if (file) {
            fetchAndPlay();
        }
    }, [file]);

    return (
        <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
            {audioUrl ? (
                <audio controls src={audioUrl} autoPlay className="w-full animate-fadeIn">
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p className="text-white">Select a song to play</p>
            )}
        </div>
    );
};

export default MediaPlayer;
