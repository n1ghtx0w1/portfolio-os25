import { useEffect, useState } from 'react';
import AboutWindow from './AboutWindow';
import FileExplorer from './FileExplorer';
import KateViewer from './TextViewer';
import MarkdownViewer from './MarkdownViewer';
import { fileSystem } from '../data/fileSystem';
import { loadBlogFiles } from '../data/loadBlogFiles';
import ExploitModal from './ExploitModal';

export default function Desktop({ onExit }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [launchingTerminal, setLaunchingTerminal] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showAbout, setShowAbout] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [openTextFile, setOpenTextFile] = useState(null);
  const [textFileContent, setTextFileContent] = useState('');
  const [openMarkdownFile, setOpenMarkdownFile] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [startPath, setStartPath] = useState('/');
  const [showExploit, setShowExploit] = useState(false);

  // Handle file opening from File Explorer
  const handleOpenFile = (path, content) => {
    const ext = path.split('.').pop();
    const filename = path.split('/').pop();
if (ext === 'sh') {
  setShowExploit(true);
} else if (ext === 'txt') {
  setOpenTextFile(filename);
  setTextFileContent(content);
} else if (ext === 'md') {
  setOpenMarkdownFile(filename);
  setMarkdownContent(content);
}



  };

  // Clock timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-close menus when clicking off
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

  // Load blog .md files into the virtual file system
  useEffect(() => {
    loadBlogFiles().then((blogPosts) => {
      if (!fileSystem['/'].home.guest.blog) {
        fileSystem['/'].home.guest.blog = {};
      }
      fileSystem['/'].home.guest.blog = blogPosts;
    });
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
      
      {/* Blog Folder Shortcut */}
    <div
      className="absolute top-24 left-6 flex flex-col items-center cursor-pointer hover:opacity-90"
      onClick={() => {
      setStartPath('/home/guest/blog');
      setShowFiles(true);
    }}
    >
    <img src="/icons/folder-icon.png" alt="Blog Folder" className="w-12 h-12" />
      <span className="text-xs mt-1 text-center">Blog</span>
    </div>


      {/* Terminal Icon */}
      <div
        className="absolute top-6 left-6 flex flex-col items-center cursor-pointer hover:opacity-90"
        onClick={() => {
          setLaunchingTerminal(true);
          setTimeout(() => onExit(), 1000);
        }}
      >
        <img src="/icons/terminal-icon.svg" alt="Terminal" className="w-12 h-12" />
        <span className="text-xs mt-1 text-center">Terminal</span>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute bottom-12 left-4 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-sm z-50 start-menu">
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={onExit}>🖥 Terminal</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setShowAbout(true)}>👤 About</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2" onClick={() => { setStartPath('/'); setShowFiles(true); }} >
          <img src="/icons/folder-icon.png" alt="Files" className="w-4 h-4" /> Files </div>
          <a
            href="https://github.com/n1ghtx0w1"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-700 cursor-pointer block"
          >
            📁 Projects
          </a>
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setShowStartMenu(false)}>❌ Close Menu</div>
        </div>
      )}

      {/* App Windows */}
      {showAbout && <AboutWindow onClose={() => setShowAbout(false)} />}
      {showFiles && (
        <FileExplorer
          onClose={() => setShowFiles(false)}
          onOpenFile={handleOpenFile}
          startPath={startPath}
        />
      )}
      {openTextFile && (
        <KateViewer
          filename={openTextFile}
          content={textFileContent}
          onClose={() => setOpenTextFile(null)}
        />
      )}
      {openMarkdownFile && (
        <MarkdownViewer
          filename={openMarkdownFile}
          content={markdownContent}
          onClose={() => setOpenMarkdownFile(null)}
        />
      )}

      {showExploit && <ExploitModal onComplete={onExit} />}


      {/* Taskbar */}
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
    </div>
  );
}
