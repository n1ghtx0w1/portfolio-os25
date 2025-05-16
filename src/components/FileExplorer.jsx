import { useState } from "react";
import { Rnd } from "react-rnd";
import { fileSystem } from "../data/fileSystem";

const joinPath = (...segments) =>
  segments.join("/").replace(/\/+/g, "/").replace(/\/$/, "");

function PermissionDeniedModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-red-600 max-w-sm w-full">
        <h2 className="text-xl font-bold text-red-400 mb-2">Permission Denied</h2>
        <p className="mb-4">You do not have access to this directory.</p>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function ThankYouModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg border border-green-400 max-w-sm w-full">
        <h2 className="text-xl font-bold text-green-400 mb-2">You're a Good Human!</h2>
        <p className="mb-4">Thanks for deleting the exploit before it could run.  You saved
            the day but more than that you proved to be an outstanding person!  Thank you! 🧠💻</p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
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
}) {
  const isFolder = typeof content === "object";
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (isFolder) {
      if (!(path.startsWith("/home") || path.startsWith("/tmp"))) {
        onNavigateDenied();
        return;
      }
      setExpanded(!expanded);
    } else {
      onOpenFile(path);
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
        className="cursor-pointer hover:bg-white/10 rounded px-1 py-0.5"
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        {isFolder ? (
          <img
            src="/icons/folder-icon.png"
            alt="Folder"
            className="inline-block w-4 h-4 mr-1"
          />
        ) : (
          "📄"
        )}{" "}
        {name}
      </div>
      {isFolder && expanded && (
        <div className="pl-2">
          {Object.entries(content).map(([childName, childContent]) => (
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

export default function FileExplorer({ onClose, onOpenFile, startPath = "/" }) {
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

  const handleOpenFile = (filePath) => {
    const parts = filePath.split("/").filter(Boolean);
    let current = fileSystem["/"];

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) return;
      current = current[parts[i]];
    }

    const fileName = parts[parts.length - 1];
    const fileContent = current[fileName];

    if (fileContent) {
      onOpenFile(filePath, fileContent);
    }
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
          x: 100,
          y: 100,
          width: 400,
          height: 400,
        }}
        minWidth={300}
        minHeight={200}
        bounds="window"
        dragHandleClassName="window-header"
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
            {Object.entries(current).map(([name, content]) => (
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
