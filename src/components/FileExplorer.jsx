import { useState, useRef } from "react";
import { Rnd } from "react-rnd";

// Helper to join file paths
const joinPath = (...segments) =>
  segments.join("/").replace(/\/+/g, "/").replace(/\/$/, "");

// Permission modal
function PermissionDeniedModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-[90vw] max-w-xs mx-auto text-center shadow-lg border border-red-500">
        <div className="text-3xl mb-2">⛔</div>
        <h2 className="text-lg font-bold mb-2">Access Denied</h2>
        <p className="mb-4 text-sm">
          You do not have permission to open this folder as a guest user.
        </p>
        <button
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}

// Thank you modal
function ThankYouModal({ onClose, message = "You removed a malicious file from the OS!" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-[90vw] max-w-xs mx-auto text-center shadow-lg border border-green-500">
        <div className="text-3xl mb-2">👍</div>
        <h2 className="text-lg font-bold mb-2">Thank You</h2>
        <p className="mb-4 text-sm">{message}</p>
        <button
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// FileNode component
function FileNode({
  name,
  content,
  path,
  onOpenFile,
  onNavigateDenied,
  onShowContextMenu,
  level = 0,
  isMobile,
}) {
  const isFolder = typeof content === "object" && !content.content && !content.fileType;
  const [expanded, setExpanded] = useState(false);
  const touchTimeout = useRef();

  // Restrict guest user from certain folders
  const isRestricted = !(path.startsWith("/home") || path.startsWith("/tmp") || path.startsWith("/trash") || path.startsWith("/quarantine"));

  const handleClick = (e) => {
    e.stopPropagation();
    if (isFolder) {
      if (isRestricted) {
        onNavigateDenied();
        return;
      }
      setExpanded(!expanded);
    } else {
      // Block opening quarantined files!
      if (path.startsWith("/quarantine")) {
        alert("You cannot open or run quarantined files.");
        return;
      }
      onOpenFile(path, content.content || content);
    }
  };

  const handleRightClick = (e) => {
    // Always allow context menu for files in /trash or /quarantine, or special files
    const isInTrash = path.startsWith("/trash");
    const isInQuarantine = path.startsWith("/quarantine");
    // Special-case: allow context menu for exploit.sh in /tmp
    if (
      !isFolder ||
      isInTrash ||
      isInQuarantine ||
      path === "/tmp/exploit.sh"
    ) {
      e.preventDefault();
      onShowContextMenu(e.clientX, e.clientY, path, content);
    }
  };

  // iOS/Android: reliable long-press for context menu
  const handleLongPress = (e) => {
    if (
      !isFolder ||
      path.startsWith("/trash") ||
      path.startsWith("/quarantine") ||
      path === "/tmp/exploit.sh"
    ) {
      e.preventDefault?.();
      onShowContextMenu(
        e.touches ? e.touches[0].clientX : e.clientX,
        e.touches ? e.touches[0].clientY : e.clientY,
        path,
        content
      );
    }
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault(); // <- try adding this here!
    touchTimeout.current = setTimeout(() => {
      handleLongPress(e);
    }, 800);
  };

  const handleTouchEnd = () => clearTimeout(touchTimeout.current);

  // Responsive indent for folder level
  const indentClass =
    level === 0
      ? ""
      : `ml-${Math.min(level, 4) * (window.innerWidth < 640 ? 1 : 2)}`;

  return (
    <div className={indentClass}>
      <div
        className="flex items-center px-1 py-1 rounded cursor-pointer select-none hover:bg-white/10"
        style={{
          fontWeight: isFolder ? 600 : 400,
          fontSize: "1rem",
          gap: 4,
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent"
        }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        onTouchCancel={isMobile ? handleTouchEnd : undefined}
        onPointerDown={isMobile ? handleTouchStart : undefined}
        onPointerUp={isMobile ? handleTouchEnd : undefined}
      >
        {isFolder ? (
          <img
            src="/icons/folder-icon.png"
            alt="Folder"
            className="inline-block w-4 h-4 mr-1"
            draggable={false}
          />
        ) : (
          "📄"
        )}
        <span className="truncate">{content?.title || name}</span>
        {content?.date && (
          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
            {new Date(content.date).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Render folder children if expanded and allowed */}
      {isFolder && expanded && !isRestricted && (
        <div>
          {Object.entries(content)
            .sort((a, b) => {
              const aDate = a[1]?.date ? new Date(a[1].date) : new Date(0);
              const bDate = b[1]?.date ? new Date(b[1].date) : new Date(0);
              return bDate - aDate;
            })
            .map(([childName, childContent]) => (
              <FileNode
                key={childName}
                name={childName}
                content={childContent}
                path={joinPath(path, childName)}
                onOpenFile={onOpenFile}
                onNavigateDenied={onNavigateDenied}
                onShowContextMenu={onShowContextMenu}
                level={level + 1}
                isMobile={isMobile}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// Main FileExplorer
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
      setThanksMessage("This file cannot be deleted from here!");
      setShowThanksModal(true);
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }

    // Special: Quarantine workflow for exploit.sh
    if (path === "/tmp/exploit.sh") {
      handleQuarantineFile();
      return;
    }

    // Find parent folder
    let parent = fileSystem["/"];
    for (let i = 0; i < parts.length - 1; i++) {
      if (!parent[parts[i]]) return;
      parent = parent[parts[i]];
    }
    const filename = parts[parts.length - 1];

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

      {/* Context menu for files and desktop icons */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-sm border border-gray-600 rounded shadow"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            width: "180px",
          }}
        >
          {startPath === "/trash" ? (
            isRestoreDesktopIcon ? (
              <div
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition"
                onClick={handleRestoreDesktopIcon}
              >
                ♻️ Restore to Desktop
              </div>
            ) : isRestoreFile ? (
              <div
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition"
                onClick={handleRestoreFile}
              >
                ♻️ Restore File
              </div>
            ) : null
          ) : isQuarantineAction ? (
            <div
              className="px-3 py-2 hover:bg-green-700 cursor-pointer transition"
              onClick={handleQuarantineFile}
            >
              🦠 Quarantine
            </div>
          ) : (
            <div
              className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition"
              onClick={handleDeleteFile}
            >
              🗑 Delete
            </div>
          )}
        </div>
      )}

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
