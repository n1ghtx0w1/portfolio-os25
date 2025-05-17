import React, { useState, useRef } from "react";

// Helper to join file paths
const joinPath = (...segments) =>
  segments.join("/").replace(/\/+/g, "/").replace(/\/$/, "");

export default function FileNode({
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
    const isInTrash = path.startsWith("/trash");
    const isInQuarantine = path.startsWith("/quarantine");
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
    e.preventDefault();
    touchTimeout.current = setTimeout(() => {
      handleLongPress(e);
    }, 800);
  };

  const handleTouchEnd = () => clearTimeout(touchTimeout.current);

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
