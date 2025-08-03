"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import classNames from "classnames";

export default function SaveModal({
  show,
  onClose,
  onSave,
}: {
  show: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  useEffect(() => {
    if (show) setPlaylistName(""); // clear input when modal opens
  }, [show]);

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50  flex items-center justify-center transition-all duration-300",
        show ? "visible bg-black/60" : "invisible opacity-0"
      )}
    >
      <div className="bg-gradient-to-b  from-purple-800 via-purple-900 to-gray-950 rounded-2xl shadow-2xl w-11/12 max-w-md  p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Save Playlist</h2>

        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-300">Playlist Name</label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name..."
            className="w-full px-4 py-2 rounded-xl bg-purple-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (playlistName.trim()) {
                onSave(playlistName.trim());
                onClose();
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition disabled:opacity-50"
            disabled={!playlistName.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
