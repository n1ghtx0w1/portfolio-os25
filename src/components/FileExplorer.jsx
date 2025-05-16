import { useState } from "react";
import { Rnd } from "react-rnd";
import { fileSystem } from "../data/fileSystem";

const joinPath = (...segments) => {
  return segments
    .join("/")
    .replace(/\/+/g, "/") 
    .replace(/\/$/, ""); 
};

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

function FileNode({ name, content, path, onOpenFile, onNavigateDenied }) {
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

  return (
    <div className="ml-4">
      <div
        className="cursor-pointer hover:bg-white/10 rounded px-1 py-0.5"
        onClick={handleClick}
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
        <div className="bg-gray-900 text-white w-full h-full flex flex-col">
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
              />
            ))}
          </div>
        </div>
      </Rnd>

      {showPermissionModal && (
        <PermissionDeniedModal onClose={() => setShowPermissionModal(false)} />
      )}
    </>
  );
}
