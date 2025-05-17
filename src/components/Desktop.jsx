import { useEffect, useState, useCallback } from 'react';
import AboutWindow from './AboutWindow';
import FileExplorer from './FileExplorer';
import KateViewer from './TextViewer';
import MarkdownViewer from './MarkdownViewer';
import { fileSystem as initialFileSystem } from '../data/fileSystem';
import { loadBlogFiles } from '../data/loadBlogFiles';
import ExploitModal from './ExploitModal';
import achievementsMd from '../content/achievements.md?raw';

function getDesktopIconConfig(id, context) {
  switch (id) {
    case "trash":
      return {
        onClick: () => {
          context.setStartPath('/trash');
          context.setShowFiles(true);
        },
        trashable: false,
      };
    case "terminal":
      return {
        onClick: () => {
          context.setLaunchingTerminal(true);
          setTimeout(() => context.onExit(), 1000);
        },
        trashable: true,
      };
    case "blog":
      return {
        onClick: () => {
          context.setStartPath('/home/guest/blog');
          context.setShowFiles(true);
        },
        trashable: true,
      };
    case "browser":
      return {
        onClick: () =>
          window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'),
        trashable: true,
      };
    default:
      return { onClick: () => {}, trashable: false };
  }
}

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
  const [showRickrollIcon, setShowRickrollIcon] = useState(false);
  const [vfs, setVfs] = useState(() => structuredClone(initialFileSystem));
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementsContent, setAchievementsContent] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, iconId: null });
  const [draggedIconId, setDraggedIconId] = useState(null);
  const [isTrashOver, setIsTrashOver] = useState(false);

  // Default icon array builder
  const getDefaultIcons = useCallback(
    () => [
      {
        id: "trash",
        name: "Trash",
        icon: "/icons/trashbin.png",
        trashable: false,
      },
      {
        id: "terminal",
        name: "Terminal",
        icon: "/icons/terminal-icon.png",
        trashable: true,
      },
      {
        id: "blog",
        name: "Blog",
        icon: "/icons/folder-icon.png",
        trashable: true,
      },
      {
        id: "browser",
        name: "Browser",
        icon: "/icons/browser-icon.png",
        trashable: true,
        visible: showRickrollIcon,
      },
    ],
    [showRickrollIcon]
  );

  const [desktopIcons, setDesktopIcons] = useState(() =>
    getDefaultIcons().filter(icon => icon.id !== 'browser')
  );

  // Sync browser icon with Rickroll state
  useEffect(() => {
    setDesktopIcons(prev => {
      const wanted = getDefaultIcons().filter(
        icon => icon.id !== 'browser' || showRickrollIcon
      );
      return wanted.filter(icon => prev.some(i => i.id === icon.id) || icon.id === 'browser');
    });
  }, [showRickrollIcon, getDefaultIcons]);

  // Context menu handlers (unchanged)
  const handleIconContextMenu = (e, icon) => {
    e.preventDefault();
    if (!icon.trashable) return;
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, iconId: icon.id });
  };

  const handleTrashIcon = () => {
    moveIconToTrash(contextMenu.iconId);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCloseContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

  // New: Move Icon to Trash (shared by drag and context menu)
  const moveIconToTrash = (iconId) => {
    const icon = desktopIcons.find(i => i.id === iconId);
    if (!icon) return;
    setDesktopIcons(icons => icons.filter(i => i.id !== icon.id));
    setVfs(vfs => {
      const next = structuredClone(vfs);
      next['/'].trash = next['/'].trash || {};
      let trashKey = `desktop-${icon.id}`;
      let count = 1;
      while (next['/'].trash[trashKey]) {
        trashKey = `desktop-${icon.id}-${count++}`;
      }
      const { onClick, ...iconWithoutOnClick } = icon;
      next['/'].trash[trashKey] = {
        ...iconWithoutOnClick,
        __trashedFrom: "desktop",
        fileType: "desktop-icon"
      };
      return next;
    });
  };

  // Drag & Drop handlers for icons
  const handleDragStart = (iconId) => setDraggedIconId(iconId);
  const handleDragEnd = () => setDraggedIconId(null);

  // Trash drop logic
  const handleTrashDragOver = (e) => {
    e.preventDefault();
    setIsTrashOver(true);
  };
  const handleTrashDragLeave = () => setIsTrashOver(false);
  const handleTrashDrop = (e) => {
    e.preventDefault();
    setIsTrashOver(false);
    if (draggedIconId) {
      moveIconToTrash(draggedIconId);
      setDraggedIconId(null);
    }
  };

  const handleOpenFile = (path, content) => {
    const ext = path.split('.').pop();
    const filename = path.split('/').pop();
    if (ext === 'sh') {
      localStorage.setItem('ranExploit', 'true');
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

  // Auto-close menus
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        !e.target.closest('.start-button') &&
        !e.target.closest('.start-menu') &&
        !e.target.closest('.volume-control')
      ) {
        setShowStartMenu(false);
        setShowVolume(false);
        setContextMenu({ ...contextMenu, visible: false });
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  // Load blog .md files into the virtual file system
  useEffect(() => {
    loadBlogFiles().then((blogPosts) => {
      setVfs(prev => {
        const next = structuredClone(prev);
        if (!next['/'].home) next['/'].home = {};
        if (!next['/'].home.guest) next['/'].home.guest = {};
        next['/'].home.guest.blog = blogPosts;
        return next;
      });
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('ranExploit') === 'true') {
      setShowRickrollIcon(true);
    }
  }, []);

  const handleShowAchievements = () => {
    setAchievementsContent(achievementsMd);
    setShowAchievements(true);
  };

  if (launchingTerminal) {
    return (
      <div className="w-screen h-screen bg-black text-green-400 flex items-center justify-center text-xl font-mono">
        <div className="animate-pulse">Launching OS25 Terminal...</div>
      </div>
    );
  }

  // ----------- Desktop Rendering -----------

  const iconContext = {
    setStartPath,
    setShowFiles,
    setLaunchingTerminal,
    onExit,
    setShowRickrollIcon,
  };

  return (
    <div
      className="relative w-screen h-screen text-white overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/desktop-background.png')" }}
    >
      {/* Desktop Icons */}
      {desktopIcons
        .filter(icon => icon.id !== 'browser' || showRickrollIcon)
        .map((icon, idx) => {
          const iconConfig = getDesktopIconConfig(icon.id, iconContext);
          const isTrash = icon.id === 'trash';
          return (
            <div
              key={icon.id}
              className="absolute left-6 flex flex-col items-center cursor-pointer hover:opacity-90"

              style={{ top: `${6 + idx * 72}px` }}
              onClick={iconConfig.onClick}
              onContextMenu={e => handleIconContextMenu(e, { ...icon, ...iconConfig })}
              // Only trash icon is a drop target:
              {...(isTrash
                ? {
                    onDragOver: handleTrashDragOver,
                    onDrop: handleTrashDrop,
                    onDragLeave: handleTrashDragLeave,
                  }
                : {
                    draggable: icon.trashable,
                    onDragStart: () => handleDragStart(icon.id),
                    onDragEnd: handleDragEnd,
                  })}
            >
              <img src={icon.icon} alt={icon.name} className="w-12 h-12" />
              <span className="text-xs mt-1 text-center">{icon.name}</span>
            </div>
          );
        })}

      {/* Context Menu for Desktop Icon */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-sm border border-gray-600 rounded shadow"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            width: "140px",
          }}
          onClick={handleTrashIcon}
        >
          <div className="px-3 py-2 hover:bg-red-600 cursor-pointer">🗑 Move to Trash</div>
        </div>
      )}

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute bottom-12 left-4 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-sm z-50 start-menu">
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={onExit}>🖥 Terminal</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setShowAbout(true)}>👤 About</div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2" onClick={() => { setStartPath('/'); setShowFiles(true); }}>
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
          <div className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setShowStartMenu(false)}>❌ Close Menu</div>
        </div>
      )}

      {/* App Windows */}
      {showAbout && (
        <AboutWindow
          onClose={() => setShowAbout(false)}
          onShowAchievements={handleShowAchievements}
        />
      )}

      {showFiles && (
        <FileExplorer
          fileSystem={vfs}
          onClose={() => setShowFiles(false)}
          onOpenFile={handleOpenFile}
          startPath={startPath}
          setVfs={setVfs}
          setDesktopIcons={setDesktopIcons}
          getDesktopIconConfig={getDesktopIconConfig}
          iconContext={iconContext}
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

      {showAchievements && (
        <MarkdownViewer
          filename="achievements.md"
          content={achievementsContent}
          onClose={() => setShowAchievements(false)}
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
