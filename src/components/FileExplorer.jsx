import { useState } from "react";
import { Rnd } from "react-rnd";

const joinPath = (...segments) =>
  segments.join("/").replace(/\/+/g, "/").replace(/\/$/, "");

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

function ThankYouModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-[90vw] max-w-xs mx-auto text-center shadow-lg border border-green-500">
        <div className="text-3xl mb-2">👍</div>
        <h2 className="text-lg font-bold mb-2">Thank You</h2>
        <p className="mb-4 text-sm">
          You removed a malicious file from the OS!
        </p>
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

function FileNode({
  name,
  content,
  path,
  onOpenFile,
  onNavigateDenied,
  onShowContextMenu,
  level = 0,
}) {
  const isFolder = typeof content === "object" && !content.content;
  const [expanded, setExpanded] = useState(false);

  // Check for folder restriction
  const isRestricted = !(path.startsWith("/home") || path.startsWith("/tmp"));

  const handleClick = (e) => {
    e.stopPropagation();
    if (isFolder) {
      if (isRestricted) {
        onNavigateDenied();
        return;
      }
      setExpanded(!expanded);
    } else {
      onOpenFile(path, content.content || content);
    }
  };

  const handleRightClick = (e) => {
    if (name === "exploit.sh") {
      e.preventDefault();
      onShowContextMenu(e.clientX, e.clientY, path);
    }
  };

  // Responsive indent: less left margin on mobile
  const indentClass =
    level === 0
      ? ""
      : `ml-${Math.min(level, 4) * (window.innerWidth < 640 ? 1 : 2)}`;

  return (
    <div className={indentClass}>
      <div
        className={`flex items-center px-1 py-1 rounded cursor-pointer select-none hover:bg-white/10`}
        style={{
          fontWeight: isFolder ? 600 : 400,
          fontSize: "1rem",
          gap: 4,
        }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
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
      {/* Only render folder children if allowed and expanded */}
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
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({
  fileSystem,
  onClose,
  onOpenFile,
  startPath = "/",
}) {
  const parts = startPath.split("/").filter(Boolean);
  let current = fileSystem["/"];
  for (let part of parts) {
    if (!current[part]) break;
    current = current[part];
  }

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    filePath: null,
  });

  const handleOpenFile = (filePath, content) => {
    onOpenFile(filePath, content);
  };

  const handleDeleteExploit = () => {
    const path = contextMenu.filePath;
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "tmp" && parts[1] === "exploit.sh") {
      delete fileSystem["/"].tmp["exploit.sh"];
      setShowThanksModal(true);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleShowContextMenu = (x, y, filePath) => {
    setContextMenu({ visible: true, x, y, filePath });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Responsive sizing for Rnd (windowed) File Explorer
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const width = isMobile ? window.innerWidth * 0.98 : 500;
  const height = isMobile ? window.innerHeight * 0.7 : 400;

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
                />
              ))}
          </div>
        </div>
      </Rnd>

      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-sm border border-gray-600 rounded shadow"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            width: "140px",
          }}
        >
          <div
            className="px-3 py-2 hover:bg-red-600 cursor-pointer"
            onClick={handleDeleteExploit}
          >
            🗑 Delete
          </div>
        </div>
      )}

      {showPermissionModal && (
        <PermissionDeniedModal onClose={() => setShowPermissionModal(false)} />
      )}

      {showThanksModal && (
        <ThankYouModal onClose={() => setShowThanksModal(false)} />
      )}
    </>
  );
}
