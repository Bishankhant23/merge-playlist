import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import ReactPlayer from "react-player";

interface videoPlayerSchema {
    videoId: string,
    handleChange:any,
    title:string,
    onClose:any,
    playVideo:boolean,
    onPlayPause:any;
    onVideoEnd : any;
}

export default function CustomVideoPlayer({ videoId,handleChange,title,onClose,playVideo,onPlayPause,onVideoEnd }: videoPlayerSchema) {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    setIsPlaying(playVideo)
  },[playVideo])

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    onPlayPause(!isPlaying)
  };


  const handlePlayerChange = (type:"play" | "pause") => {
    if(type == "play"){
      onPlayPause(true)
      setIsPlaying(true)
    }else{
      onPlayPause(false)
      setIsPlaying(false)
    }
  }

  return (
    <div className="relative w-full max-w-md h-full">
      <div className=" px-4 flex flex-col justify-center gap-4  h-full overflow-hidden rounded-b-lg ">
          <div onClick={() => onClose()} className="cursor-pointer"><FaArrowLeft/></div>
          
          <div style={{ borderRadius:"20px", position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}> {/* 16:9 aspect ratio */}
            <ReactPlayer
            controls={true}
            ref={playerRef}
              src={`https://www.youtube.com/watch?v=${videoId}`}
              width='100%'
              height='100%'
              playing={isPlaying}
              style={{ position: 'absolute', top: 0, left: 0 }}
              onEnded={onVideoEnd}
              onPause={() => handlePlayerChange("pause")}
              onPlay={() => handlePlayerChange("play")}
            />
          </div>
          
          <div className="text-center">{title}</div>

          <div className="flex justify-center items-center my-5 gap-3">

            <FaStepBackward onClick={() => handleChange("prev")} className="cursor-pointer"/>
            <button onClick={togglePlay} className="text-white flex items-center justify-center h-[70px] w-[70px] px-4 py-2 bg-black rounded-[50%]">
              {!isPlaying ? <FaPlay size={30} /> : <FaPause size={30} />}
            </button>
            <FaStepForward onClick={() => handleChange("next")} className="cursor-pointer"/>
          </div>
      </div>
    </div>
  );
}