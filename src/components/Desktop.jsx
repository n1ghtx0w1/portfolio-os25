import { useEffect, useState } from 'react';

export default function Desktop({ onExit }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [launchingTerminal, setLaunchingTerminal] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        !e.target.closest('.start-button') &&
        !e.target.closest('.start-menu') &&
        !e.target.closest('.volume-control')
      ) {
        setShowStartMenu(false);
        setShowVolume(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (launchingTerminal) {
    return (
      <div className="w-screen h-screen bg-black text-green-400 flex items-center justify-center text-xl font-mono">
        <div className="animate-pulse">Launching OS25 Terminal...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">

      {/* Clickable Terminal Icon */}
      <div
        className="absolute top-6 left-6 flex flex-col items-center cursor-pointer hover:opacity-90"
        onClick={() => {
          setLaunchingTerminal(true);
          setTimeout(() => {
            onExit(); // exits to terminal view
          }, 1000); // 1 second fake loading
        }}
      >
        <img src="/icons/terminal-icon.svg" alt="Terminal" className="w-12 h-12" />
        <span className="text-xs mt-1 text-center">Terminal</span>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute bottom-12 left-4 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-sm z-50 start-menu">
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={onExit}>🖥 Terminal</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer">👤 About</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer">📁 Projects</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setShowStartMenu(false)}>❌ Close Menu</div>
        </div>
      )}

{/* Taskbar */}
<div className="absolute bottom-0 w-full bg-black bg-opacity-80 h-10 flex justify-between items-center px-4">
  {/* Start Button */}
  <div
    onClick={() => setShowStartMenu((prev) => !prev)}
    className="text-sm text-white cursor-pointer hover:bg-white/10 px-2 py-1 rounded start-button"
  >
    🟢 Start
  </div>

  {/* Right-aligned Volume + Time */}
  <div className="flex items-center gap-4">
    {/* Volume (left of time) */}
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
          <div className="text-xs text-center text-gray-300 mt-1">
            {volume}%
          </div>
        </div>
      )}
    </div>

    {/* Time (right of volume) */}
    <div className="text-sm text-gray-300">{time}</div>
  </div>
 </div>
</div>
  );
}
