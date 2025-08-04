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
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setIsPlaying(playVideo)
  },[playVideo])

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    onPlayPause(!isPlaying)
  };
 
  let ending = false

  const handlePlayerChange = (type:"play" | "pause") => {
    if(type == "play"){
      onPlayPause(true)
      setIsPlaying(true)
    }else{
      setTimeout(() => {

        if(!ending) {
          onPlayPause(false)
          setIsPlaying(false)
        }
      })
    }
  }


  //media session integretion
  const handleChangeRef = useRef(handleChange);
const onPlayPauseRef = useRef(onPlayPause);


useEffect(() => {
  handleChangeRef.current = handleChange;
  onPlayPauseRef.current = onPlayPause;
}, [handleChange, onPlayPause]);

// Media Session setup (run once)
useEffect(() => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: "YouTube",
      album: "Custom Player",
      artwork: [
        {
          src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    });

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    navigator.mediaSession.setActionHandler("play", () => {
      onPlayPauseRef.current?.(true);
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      onPlayPauseRef.current?.(false);
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      handleChangeRef.current?.("prev");
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      handleChangeRef.current?.("next");
    });
  }

  return () => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.metadata = null;
    }
  };
}, [videoId, title]);

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
              onEnded={() =>  {ending=true; onVideoEnd();}}
              onPause={() => handlePlayerChange("pause")}
              onPlay={() => handlePlayerChange("play")}
              autoPlay={true}
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