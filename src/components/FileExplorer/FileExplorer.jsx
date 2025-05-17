import { useState } from "react";
import { Rnd } from "react-rnd";
import FileNode from './FileNode';
import ContextMenu from '../ContextMenu';
import ThankYouModal from '../ThankYouModal';
import PermissionDeniedModal from '../PermissionDeniedModal';

// Helper to join file paths (move to a utils file if you want)
const joinPath = (...segments) =>
  segments.join("/").replace(/\/+/g, "/").replace(/\/$/, "");

export default function FileExplorer({
  fileSystem,
  onClose,
  onOpenFile,
  startPath = "/",
  setVfs,
  setDesktopIcons,
  getDesktopIconConfig,
  iconContext,
}) {
  if (!fileSystem || typeof fileSystem !== "object" || !fileSystem["/"]) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
        <div className="text-red-400 bg-gray-900 p-6 rounded-xl border border-red-700 shadow-lg text-lg">
          <div className="text-4xl mb-4">🚫</div>
          <div>
            <b>File system error:</b> Root directory <code>"/"</code> not found.
          </div>
          <div className="mt-2 text-gray-400 text-base">
            (This is a developer bug. Check your <code>fileSystem</code> structure!)
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const parts = startPath.split("/").filter(Boolean);
  let current = fileSystem["/"];
  for (let part of parts) {
    if (!current[part]) break;
    current = current[part];
  }

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [thanksMessage, setThanksMessage] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    filePath: null,
    fileContent: null,
  });

  const handleOpenFile = (filePath, content) => {
    onOpenFile(filePath, content);
  };

  // Move file to Trash
  const handleDeleteFile = () => {
    const path = contextMenu.filePath;
    const parts = path.split("/").filter(Boolean);

    // Don't allow deleting from /trash or /quarantine!
    if (parts[0] === "trash" || parts[0] === "quarantine") {
      setShowPermissionModal(true);
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }

    // Don't allow deleting folders (only allow files)
    let parent = fileSystem["/"];
    for (let i = 0; i < parts.length - 1; i++) {
      if (!parent[parts[i]]) return;
      parent = parent[parts[i]];
    }
    const filename = parts[parts.length - 1];
    const target = parent[filename];

    // Check if target is a folder
    const isFolder = typeof target === "object" && !target.content && !target.fileType;
    if (isFolder) {
      setShowPermissionModal(true);
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }

    // Special: Quarantine workflow for exploit.sh
    if (path === "/tmp/exploit.sh") {
      handleQuarantineFile();
      return;
    }

    if (parent[filename]) {
      if (!fileSystem["/"].trash) fileSystem["/"].trash = {};
      fileSystem["/"].trash[filename] = {
        ...parent[filename],
        __trashedFrom: "/" + parts.slice(0, -1).join("/"),
      };
      delete parent[filename];
      setThanksMessage("File moved to Trash!");
      setShowThanksModal(true);
      if (setVfs) setVfs(structuredClone(fileSystem));
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Quarantine handler for exploit.sh
  const handleQuarantineFile = () => {
    const path = contextMenu.filePath;
    const parts = path.split("/").filter(Boolean);

    // Find parent folder
    let parent = fileSystem["/"];
    for (let i = 0; i < parts.length - 1; i++) {
      if (!parent[parts[i]]) return;
      parent = parent[parts[i]];
    }
    const filename = parts[parts.length - 1];

    // Move file to /quarantine
    if (parent[filename]) {
      if (!fileSystem["/"].quarantine) fileSystem["/"].quarantine = {};
      fileSystem["/"].quarantine[filename] = {
        ...parent[filename],
        __quarantinedFrom: "/" + parts.slice(0, -1).join("/"),
      };
      delete parent[filename];
      setThanksMessage("You quarantined a suspicious file! Thanks for keeping the system safe.");
      setShowThanksModal(true);
      if (setVfs) setVfs(structuredClone(fileSystem));
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  // RESTORE logic for desktop icons (from trash)
  const handleRestoreDesktopIcon = () => {
    const key = contextMenu.filePath.split("/").pop();
    const fileObj = fileSystem["/"].trash[key];
    if (
      fileObj &&
      fileObj.fileType === "desktop-icon" &&
      setDesktopIcons &&
      getDesktopIconConfig &&
      iconContext
    ) {
      delete fileSystem["/"].trash[key];
      if (setVfs) setVfs(structuredClone(fileSystem));
      setDesktopIcons((icons) => [
        ...icons.filter((i) => i.id !== fileObj.id),
        {
          id: fileObj.id,
          name: fileObj.name,
          icon: fileObj.icon,
          ...getDesktopIconConfig(fileObj.id, iconContext),
        },
      ]);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  // RESTORE handler for all other files (not desktop icons)
  const handleRestoreFile = () => {
    const key = contextMenu.filePath.split("/").pop();
    const fileObj = fileSystem["/"].trash[key];
    if (fileObj && fileObj.__trashedFrom) {
      // Parse original path
      const originalPath = fileObj.__trashedFrom.replace(/^\//, '').split('/');
      let parent = fileSystem["/"];
      for (let part of originalPath) {
        if (!parent[part]) parent[part] = {}; // auto-create folders if needed
        parent = parent[part];
      }
      let restoreValue = { ...fileObj };
      if (!restoreValue.content && typeof fileObj === "string") {
        restoreValue = { content: fileObj };
      }
      delete restoreValue.__trashedFrom;
      delete restoreValue.fileType;
      parent[key] = restoreValue;
      delete fileSystem["/"].trash[key];
      if (setVfs) setVfs(structuredClone(fileSystem));
      setThanksMessage("File restored to original location!");
      setShowThanksModal(true);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Context menu logic for files
  const handleShowContextMenu = (x, y, filePath, fileContent) => {
    setContextMenu({
      visible: true,
      x,
      y,
      filePath,
      fileContent,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Responsive sizing for Rnd (windowed) File Explorer
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const width = isMobile ? window.innerWidth * 0.98 : 500;
  const height = isMobile ? window.innerHeight * 0.7 : 400;

  const isRestoreDesktopIcon =
    startPath === "/trash" &&
    contextMenu.fileContent &&
    contextMenu.fileContent.fileType === "desktop-icon";

  const isRestoreFile =
    startPath === "/trash" &&
    contextMenu.fileContent &&
    contextMenu.fileContent.fileType !== "desktop-icon";

  // Special-case: Show Quarantine for exploit.sh in /tmp
  const isQuarantineAction =
    contextMenu.filePath === "/tmp/exploit.sh";

  // --- ContextMenu Actions ---
  const contextActions =
    startPath === "/trash"
      ? isRestoreDesktopIcon
        ? [
            {
              label: "♻️ Restore to Desktop",
              onClick: handleRestoreDesktopIcon,
            },
          ]
        : isRestoreFile
        ? [
            {
              label: "♻️ Restore File",
              onClick: handleRestoreFile,
            },
          ]
        : []
      : isQuarantineAction
      ? [
          {
            label: "🦠 Quarantine",
            onClick: handleQuarantineFile,
            colorClass: "hover:bg-green-700",
          },
        ]
      : [
          {
            label: "🗑 Delete",
            onClick: handleDeleteFile,
          },
        ];

  return (
    <>
      <Rnd
        default={{
          x: isMobile ? 0 : 20,
          y: isMobile ? 0 : 20,
          width: width,
          height: height,
        }}
        minWidth={240}
        minHeight={180}
        bounds="window"
        dragHandleClassName="window-header"
        disableDragging={isMobile}
        className="z-50 border border-gray-700 rounded-md overflow-hidden shadow-lg"
      >
        <div
          className="bg-gray-900 text-white w-full h-full flex flex-col"
          style={{ touchAction: "pan-y" }}
          onClick={handleCloseContextMenu}
        >
          <div className="window-header flex justify-between items-center bg-gray-800 text-white px-3 py-2 border-b border-gray-700 cursor-move">
            <span className="font-semibold">Files</span>
            <button
              onClick={onClose}
              className="text-blue-400 hover:text-blue-500 px-2 py-0.5 rounded text-sm"
            >
              ✖
            </button>
          </div>
          <div className="p-2 sm:p-3 text-sm font-mono overflow-auto flex-1">
            {Object.entries(current)
              .sort((a, b) => {
                const aDate = a[1]?.date ? new Date(a[1].date) : new Date(0);
                const bDate = b[1]?.date ? new Date(b[1].date) : new Date(0);
                return bDate - aDate;
              })
              .map(([name, content]) => (
                <FileNode
                  key={name}
                  name={name}
                  content={content}
                  path={joinPath(startPath, name)}
                  onOpenFile={handleOpenFile}
                  onNavigateDenied={() => setShowPermissionModal(true)}
                  onShowContextMenu={handleShowContextMenu}
                  level={0}
                  isMobile={isMobile}
                />
              ))}
          </div>
        </div>
      </Rnd>

      {/* Modular Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        actions={contextActions}
        onClose={handleCloseContextMenu}
      />

      {showPermissionModal && (
        <PermissionDeniedModal onClose={() => setShowPermissionModal(false)} />
      )}
      {showThanksModal && (
        <ThankYouModal
          onClose={() => setShowThanksModal(false)}
          message={thanksMessage}
        />
      )}
    </>
  );
}
