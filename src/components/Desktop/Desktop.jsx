import { useEffect, useState, useCallback } from "react";
import AboutWindow from "../AboutWindow";
import FileExplorer from "../FileExplorer/FileExplorer";
import KateViewer from "../TextViewer";
import MarkdownViewer from "../MarkdownViewer";
import { fileSystem as initialFileSystem } from "../../data/fileSystem";
import { loadBlogFiles } from "../../data/loadBlogFiles";
import ExploitModal from "../ExploitModal";
import achievementsMd from "../../content/achievements.md?raw";
import ContextMenu from '../ContextMenu';

import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';

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

  // Context menu handlers
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

  // Move Icon to Trash (shared by drag and context menu)
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
            <DesktopIcon
              key={icon.id}
              icon={icon}
              iconConfig={iconConfig}
              index={idx}
              onClick={iconConfig.onClick}
              onContextMenu={e => handleIconContextMenu(e, { ...icon, ...iconConfig })}
              isTrash={isTrash}
              isTrashOver={isTrashOver}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleTrashDragOver}
              onDrop={handleTrashDrop}
              onDragLeave={handleTrashDragLeave}
            />
          );
        })}

      {/* Context Menu for Desktop Icon */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        actions={[
          {
            label: "🗑 Move to Trash",
            onClick: handleTrashIcon,
            colorClass: "hover:bg-red-600",
          },
        ]}
        onClose={handleCloseContextMenu}
      />

      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu
          onExit={onExit}
          onShowAbout={() => setShowAbout(true)}
          onShowFiles={() => { setStartPath('/'); setShowFiles(true); }}
        />
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
      <Taskbar
        time={time}
        showVolume={showVolume}
        setShowVolume={setShowVolume}
        volume={volume}
        setVolume={setVolume}
        setShowStartMenu={setShowStartMenu}
      />
    </div>
  );
}
