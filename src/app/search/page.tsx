"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import VideoList from "../_components/VideoList";
import { FaArrowLeft } from 'react-icons/fa';

interface VideoItemSchema {
  channel: string;
  thumbnail: string;
  title: string;
  videoId: string;
  isPlaying: boolean;
}

export default function PlaylistSearch() {
  const [urls, setUrls] = useState([""]);
  const [showList, setShowList] = useState(false);
  const [videoList, setVideoList] = useState([]);

  const handleAddField = () => {
    setUrls([...urls, ""]);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    urls.forEach((url) => {
      formData.append("playlistlink[]", url);
    });

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Merged Videos:", data.videos);
      setVideoList(data.videos);
      setShowList(true);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900  text-white max-w-md mx-auto">
      {!showList ? (
        <div className="p-4">
          <h1 className="text-2xl font-bold mt-5 mb-10 text-center">
            PLAYLIST MERGER
          </h1>

          <div className="space-y-3">
            {urls.map((url, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 rounded-lg backdrop-blur-md px-3 py-2"
              >
                <input
                  name="playlistlink[]"
                  type="text"
                  value={url}
                  onChange={(e) => handleChange(i, e.target.value)}
                  placeholder={`Playlist URL #${i + 1}`}
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                />
                {i === urls.length - 1 && (
                  <button
                    onClick={handleAddField}
                    className="text-purple-300 hover:text-purple-400"
                  >
                    <FaPlus className="cursor-pointer" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full cursor-pointer bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
          >
            MERGE
          </button>
        </div>
      ) : (

        <div className="relative max-h-screen overflow-auto" style={{scrollbarWidth:"none"}}>
            <VideoList   videos={videoList} />
        </div>
      )}
    </div>
  );
}
