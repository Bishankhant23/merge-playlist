"use client"

import { use, useEffect, useState } from "react";
import classNames from "classnames";
import VideoItem from "./VideoItem";
import VideoPlayer from "./VideoPlayer";
import { MdShuffle } from 'react-icons/md';
import { FaArrowLeft,FaSave } from "react-icons/fa";
import SavePlaylistModal from "./models/SavePlaylistModel";

interface VideoItemSchema {
    channel : string,
    thumbnail : string ,
    title : string,
    videoId : string,
    isPlaying : boolean,
}

export default function VideoList({videos:initialVides,onclose,onSave,fromSaved}:{videos:VideoItemSchema[],onclose:any,onSave:any,fromSaved:any}) {
    const [showPlayer , setShowPlayer] = useState(false)
    const [videos, setVideos] = useState<VideoItemSchema[]>(initialVides);
    const [currentVideoID , setCurrentVideoId] = useState(null);

    const [playVideo , setPlayVideo] = useState(true)

    // model
    const [showSavePlaylistModel,setShowSavePlaylistModel] = useState(false)

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
        setPlayVideo(true)

        }else {
            const first = videos[0].videoId
            setCurrentVideoId(first as any)
        setPlayVideo(true)

        }
  }

    return (
      <div className="max-w-md max-h-[100dvh]  overflow-hidden  bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900 m-auto min-h-screen">
        <div className={classNames(' bg-purple-950 py-4 h-[100dvh] rounded-tl-2xl rounded-tr-2xl',showPlayer ? "" : "hidden")}>
            <VideoPlayer onVideoEnd={handleVideoEnd} onPlayPause={(value:any) => setPlayVideo(value)} playVideo={playVideo} onClose={() => setShowPlayer(false)} title={videos.find(e => e.videoId == currentVideoID)?.title as any} handleChange={handleVideoChange} videoId={currentVideoID as any} />
        </div>
        
        <div style={{scrollbarWidth:"none"}} className="flex max-h-[90vh] overflow-scroll  flex-col gap-1 ">
           <div className="flex items-center justify-between px-3 absolute w-full bg-purple-900">
                <div>
                    <FaArrowLeft onClick={() => onclose() } size={25} className="cursor-pointer"/>
                </div>
                  {
                        fromSaved ? <div className="md:max-w-[200px] text-center max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{fromSaved}</div> : ""
                  }
                <div className="my-4  gap-3 flex justify-end px-4">
                    {
                        (!fromSaved) ? <FaSave size={30} className="cursor-pointer" onClick={() => setShowSavePlaylistModel(true)}/> : ""
                    }
                  
                    <MdShuffle className="text-white cursor-pointer" onClick={() => shuffleVideos()} size={30}/>

                </div>
           </div>
           
            <div className="pt-17">
                {
                videos.length && videos.map(({title,thumbnail,channel,videoId,isPlaying},index) => {
                    return <div key={index} className="px-3">
                        <VideoItem onClick={changeVideo} withButton={false}  isPlaying={videoId == currentVideoID} title={title} thumbnail={thumbnail} channel={channel} videoId={videoId} />
                    </div>
                })
                }

            </div>
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

       {
        <SavePlaylistModal
         onClose={() => setShowSavePlaylistModel(false)}
         show={showSavePlaylistModel}
         onSave={onSave}
         />
       }
    </div>
  );
}
