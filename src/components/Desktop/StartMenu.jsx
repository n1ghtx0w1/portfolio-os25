import React from "react";

export default function StartMenu({
  onExit,
  onShowAbout,
  onShowFiles,
}) {
  return (
    <div className="absolute bottom-12 left-4 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-sm z-50 start-menu">
      <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={onExit}>🖥 Terminal</div>
      <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={onShowAbout}>👤 About</div>
      <div className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2" onClick={onShowFiles}>
        <img src="/icons/folder-icon.png" alt="Files" className="w-4 h-4" /> Files
      </div>
      <a
        href="https://github.com/n1ghtx0w1"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-700 cursor-pointer block"
      >
        📁 Projects
      </a>
      <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => onShowAbout(false)}>❌ Close Menu</div>
    </div>
  );
}
