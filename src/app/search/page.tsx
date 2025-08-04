"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import VideoList from "../_components/VideoList";
import toast from "react-hot-toast";

export default function PlaylistSearch() {
  const [urls, setUrls] = useState([""]);
  const [showList, setShowList] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const [merging, setMerging] = useState(false);

  // saved playlists
  const [saved, setSaved] = useState([]);
  const [fromSaved, setFromSaved]: any = useState();

  const savedPlaylist = () => {
    const previous = JSON.parse(
      localStorage.getItem("saved_playlists") || "[]"
    );
    return previous;
  };

  useEffect(() => {
    const savedPlaylists = savedPlaylist();
    if (savedPlaylists.length) {
      setSaved(savedPlaylists);
    }
  }, []);

  //

  const handleAddField = () => {
    setUrls([...urls, ""]);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

  const handleSubmit = async (urls: string[], fromSaved: boolean = false) => {
    const formData = new FormData();
    urls.forEach((url) => {
      formData.append("playlistlink[]", url);
    });

    try {
      fromSaved ? " " : setMerging(true);
      const res = await fetch("/api/playlist", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        console.log("Merged Videos:", data.videos);
        setVideoList(data.videos);
        setShowList(true);
      } else {
        if(data.statusCode == 422){
          toast.error(data?.message);
        }else {
          toast.error("Please provide valid playlist link");
        }
      }
    } catch (err) {
    } finally {
      fromSaved ? " " : setMerging(false);
    }
  };

  const savePlaylist = (name: string) => {
    const savedPlaylists = JSON.parse(
      localStorage.getItem("saved_playlists") || "[]"
    );
    const newPlaylist = {
      name,
      videos: urls,
    };
    const updatedPlaylists = [...savedPlaylists, newPlaylist];

    localStorage.setItem("saved_playlists", JSON.stringify(updatedPlaylists));
    toast.success("Playlist saved successfully.");
    return true;
  };

  const handleViewPlaylist = (index: any, urls: string[]) => {
    setFromSaved(index);
    handleSubmit(urls, true);
  };

  const handleDeletePlaylist = (indexToDelete: number) => {
    const updated = [...saved];
    updated.splice(indexToDelete, 1);
    setSaved(updated);
    localStorage.setItem("saved_playlists", JSON.stringify(updated));
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
            onClick={() => {
              setFromSaved(false);
              handleSubmit(urls);
            }}
            className="mt-6 w-full cursor-pointer bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
          >
            {merging ? "MERGING..." : "MERGE"}
          </button>

          <div className="mt-10 px-4">
            <div className="text-xl mb-5 font-bold text-white">
              Saved Playlists
            </div>

            {saved.length ? (
              <div className="flex flex-col gap-3">
                {saved.map(
                  (
                    playlist: { name: string; videos: any[] },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 p-4 rounded-xl shadow-md text-white flex justify-between items-center"
                    >
                      <div>
                        <div className="text-lg font-semibold">
                          {playlist.name}
                        </div>
                        <div className="text-sm text-gray-300">
                          {playlist.videos.length} playlist
                          {playlist.videos.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleViewPlaylist(playlist.name, playlist.videos)
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-sm px-3 py-1 rounded-lg transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(index)}
                          className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-xl text-gray-300">
                No saved playlist available.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="relative max-h-[100dvh] overflow-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <VideoList
            onSave={(name: string) => savePlaylist(name)}
            onclose={() => setShowList(false)}
            videos={videoList}
            fromSaved={fromSaved}
          />
        </div>
      )}
    </div>
  );
}
