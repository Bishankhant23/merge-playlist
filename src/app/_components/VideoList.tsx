"use client"

import { useEffect, useState } from "react";
import classNames from "classnames";
import VideoItem from "./VideoItem";
import VideoPlayer from "./VideoPlayer";
import { MdShuffle } from 'react-icons/md';


interface VideoItemSchema {
    channel : string,
    thumbnail : string ,
    title : string,
    videoId : string,
    isPlaying : boolean
}

export default function VideoList({videos:initialVides}:{videos:VideoItemSchema[]}) {
    const [showPlayer , setShowPlayer] = useState(false)
    const [videos, setVideos] = useState<VideoItemSchema[]>(initialVides);
    const [currentVideoID , setCurrentVideoId] = useState(null);

    const [playVideo , setPlayVideo] = useState(true)

    useEffect(() => {
        setCurrentVideoId(videos[0].videoId as any)
    },[videos])

    function changeVideo (id:any ) {
       setCurrentVideoId(id);
       setPlayVideo(true)
    }

    const handleVideoChange = (type:string) => {
        if(type == "prev"){
            const currentIndex = (videos.findIndex(e => e.videoId == currentVideoID))
            if(currentIndex != 0){
                const newVideoId = videos[currentIndex - 1].videoId
                setCurrentVideoId(newVideoId as any)
            }
        }else {
            const currentIndex = (videos.findIndex(e => e.videoId == currentVideoID))
            if(currentIndex <  videos.length){
                const newVideoId = videos[currentIndex + 1].videoId
                setCurrentVideoId(newVideoId as any)
            }
        }
    }


const shuffleVideos = () => {
    const shuffled = [...videos];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setVideos(shuffled);
    setCurrentVideoId((shuffled[0]?.videoId as any) ?? null);
  };

  const handleVideoEnd = () => {
        const currentIndex = (videos.findIndex(e => e.videoId == currentVideoID))
        if(currentIndex <  videos.length){
            const newVideoId = videos[currentIndex + 1].videoId
            setCurrentVideoId(newVideoId as any)
        }else {
            const first = videos[0].videoId
            setCurrentVideoId(first as any)
        }
  }

    return (
      <div className="max-w-md max-h-[100dvh]  overflow-hidden  bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900 m-auto min-h-screen">
        <div className={classNames(' bg-purple-950 py-4 h-[100dvh] rounded-tl-2xl rounded-tr-2xl',showPlayer ? "" : "hidden")}>
            <VideoPlayer onVideoEnd={handleVideoEnd} onPlayPause={(value:any) => setPlayVideo(value)} playVideo={playVideo} onClose={() => setShowPlayer(false)} title={videos.find(e => e.videoId == currentVideoID)?.title as any} handleChange={handleVideoChange} videoId={currentVideoID as any} />
        </div>
        
        <div style={{scrollbarWidth:"none"}} className="flex max-h-[90vh] overflow-scroll  flex-col gap-1 ">
            <div className="my-4 w-full flex justify-end px-4">
                    <MdShuffle className="text-white cursor-pointer" onClick={() => shuffleVideos()} size={30}/>
            </div>
            
            {
            videos.length && videos.map(({title,thumbnail,channel,videoId,isPlaying},index) => {
                return <div key={index} className="px-3">
                    <VideoItem onClick={changeVideo} withButton={false}  isPlaying={videoId == currentVideoID} title={title} thumbnail={thumbnail} channel={channel} videoId={videoId} />
                </div>
            })
            }
        </div>

       {
        !showPlayer ?
            <div onClick={() => setShowPlayer(true) } className="absolute inset-0 top-[unset] bg-purple-950">
                <VideoItem
                    title={videos.find(e => e.videoId == currentVideoID)?.title as any}
                    thumbnail={videos.find(e => e.videoId == currentVideoID)?.thumbnail as any}
                    channel={videos.find(e => e.videoId == currentVideoID)?.channel as any}
                    videoId={videos.find(e => e.videoId == currentVideoID)?.videoId as any}
                    withButton={true}  
                    togglePlay={(prev:any) => setPlayVideo(!playVideo)} 
                    isPlaying={playVideo}  />
            </div>
            : ""
       }
    </div>
  );
}
