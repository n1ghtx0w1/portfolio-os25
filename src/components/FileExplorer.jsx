import { useState } from "react";
import { Rnd } from "react-rnd";

const joinPath = (...segments) =>
  segments.join("/").replace(/\/+/g, "/").replace(/\/$/, "");

function PermissionDeniedModal({ onClose }) { /* ...same as before... */ }
function ThankYouModal({ onClose }) { /* ...same as before... */ }

function FileNode({
  name,
  content,
  path,
  onOpenFile,
  onNavigateDenied,
  onShowContextMenu,
}) {
  const isFolder = typeof content === "object" && !content.content;
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (isFolder) {
      if (!(path.startsWith("/home") || path.startsWith("/tmp"))) {
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

  return (
    <div className="ml-4">
      <div
        className="cursor-pointer hover:bg-white/10 rounded px-1 py-0.5 flex justify-between items-center"
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        <div className="flex-1">
          {isFolder ? (
            <img
              src="/icons/folder-icon.png"
              alt="Folder"
              className="inline-block w-4 h-4 mr-1"
            />
          ) : (
            "📄"
          )}{" "}
          {content?.title || name}
        </div>
        {content?.date && (
          <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
            {new Date(content.date).toLocaleDateString()}
          </div>
        )}
      </div>
      {isFolder && expanded && (
        <div className="pl-2">
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

  return (
    <>
      <Rnd
        default={{
          x: 20,
          y: 20,
          width: window.innerWidth < 640 ? window.innerWidth * 0.9 : 500,
          height: window.innerHeight < 640 ? window.innerHeight * 0.6 : 400,
        }}
        minWidth={280}
        minHeight={200}
        bounds="window"
        dragHandleClassName="window-header"
        disableDragging={window.innerWidth < 640}
        className="z-50 border border-gray-700 rounded-md overflow-hidden shadow-lg"
      >
        <div
          className="bg-gray-900 text-white w-full h-full flex flex-col"
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
          <div className="p-3 text-sm font-mono overflow-auto flex-1">
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
