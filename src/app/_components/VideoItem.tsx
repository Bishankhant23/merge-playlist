import React from 'react'
import { FaPlay,FaArrowLeft, FaPause } from 'react-icons/fa';

interface VideoItemSchema {
    channel : string,
    thumbnail : string ,
    title : string,
    videoId : string,
    isPlaying : boolean,
    togglePlay : any
}

function VideoItem({title,channel,videoId,isPlaying,thumbnail,togglePlay}:VideoItemSchema) {
  return (
    <div className='flex text-white rounded-md justify-between w-full items-center px-3 border border-white'>
       <div className='flex'>
            <div className='p-2'>
                <img className='w-20 h-20 object-cover rounded-md' src={thumbnail} alt={thumbnail} />
            </div>
            <div className='flex flex-col justify-center'>
                <div className='text-xl font-bold whitespace-nowrap max-w-[200px] text-ellipsis overflow-hidden'>{title}</div>
                <div className='text-sm'>{channel}</div>
            </div>
       </div>
        <div>
            {
                !isPlaying ? <FaPlay onClick={() => togglePlay(videoId)} size={30} className='cursor-pointer'/> : <FaPause size={30}/>
            }
            
        </div>
    </div>
  )
}

export default VideoItem
