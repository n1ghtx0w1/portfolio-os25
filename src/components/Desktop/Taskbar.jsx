import React from "react";

export default function Taskbar({
  time,
  showVolume,
  setShowVolume,
  volume,
  setVolume,
  setShowStartMenu,
}) {
  return (
    <div className="absolute bottom-0 w-full h-12 px-4 flex justify-between items-center bg-black/60 backdrop-blur-md border-t border-gray-700 rounded-t-xl shadow-md z-50">
      <div
        onClick={() => setShowStartMenu((prev) => !prev)}
        className="start-button cursor-pointer p-1 rounded focus:outline-none"
      >
        <img src="/icons/menu-button.png" alt="Start" className="w-8 h-8 object-contain" />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative volume-control">
          <button
            onClick={() => setShowVolume((prev) => !prev)}
            className="text-white hover:bg-white/10 px-2 py-1 rounded"
          >
            🔊
          </button>
          {showVolume && (
            <div className="absolute bottom-10 right-0 w-32 bg-gray-800 p-2 rounded shadow border border-gray-700">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-center text-gray-300 mt-1">{volume}%</div>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-300">{time}</div>
      </div>
    </div>
  );
}
