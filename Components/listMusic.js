import React from 'react';

const ListMusic = ({ refresh, onPlay, currentFile }) => {
    const [musicFiles, setMusicFiles] = React.useState([]);
    const [message, setMessage] = React.useState('Loading...');

    const fetchMusicFiles = React.useCallback(async () => {
        try {
            setMessage('Loading music files...');
            const response = await fetch('http://localhost:5000/list-downloads');
            if (response.ok) {
                const files = await response.json();
                setMusicFiles(files);
                setMessage(files.length ? '' : 'No music files available.');
            } else {
                setMessage('Failed to load music files');
            }
        } catch (error) {
            setMessage('Failed to load music files');
        }
    }, []);

    React.useEffect(() => {
        fetchMusicFiles();
    }, [fetchMusicFiles]);

    React.useEffect(() => {
        if (refresh) {
            fetchMusicFiles();
        }
    }, [refresh, fetchMusicFiles]);

    return (
        <>
            <div className="flex justify-center items-center h-0 text-white text-lg font-mono m-1 p-10">
                Downloaded Music
            </div>
            <div className="flex flex-col justify-center items-center">
                {message && <p className="text-white">{message}</p>}
                {musicFiles.length > 0 && (
                    <ul className="list-none w-full">
                        {musicFiles.map((file, index) => (
                            <div
                                key={index}
                                className={`transform transition-transform duration-200 hover:scale-105 active:scale-95 animate-fadeIn`}
                            >
                                <li
                                    className={`m-4 flex text-lg p-4 rounded-md flex-nowrap cursor-pointer ${
                                        currentFile === file ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-500'
                                    }`}
                                    onClick={() => onPlay(file)}
                                >
                                    <p>{file}</p>
                                </li>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ListMusic;
