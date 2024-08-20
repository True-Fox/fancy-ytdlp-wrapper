"use client";
import { useState } from 'react';
import ListMusic from '@/Components/listMusic';
import DownloadMusic from '@/Components/downloadMusic';
import MediaPlayer from '@/Components/mediaPlayer';

export default function Home() {
    const [refreshList, setRefreshList] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [leftWidth, setLeftWidth] = useState(50); // Initial width of ListMusic

    const handleRefreshComplete = () => {
        setRefreshList(false); 
    };

    const handlePlay = (file) => {
        setSelectedFile(file);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <main className="h-screen flex flex-col">
            <section className="flex-grow flex p-2">
                <div
                    className="rounded-lg bg-slate-950"
                    style={{ width: `${leftWidth}%` }}
                >
                    <ListMusic
                        refresh={refreshList}
                        onPlay={handlePlay}
                        currentFile={selectedFile}
                    />
                </div>
                <div
                    className="w-2 cursor-col-resize bg-gray-600"
                    onMouseDown={handleMouseDown}
                />
                <div className="flex-1 rounded-lg bg-slate-950 p-2">
                    <DownloadMusic setRefreshList={setRefreshList} />
                </div>
            </section>
            <section className="p-2 rounded-full">
                <div className="">
                    <MediaPlayer file={selectedFile} />
                </div>
            </section>
        </main>
    );
}
