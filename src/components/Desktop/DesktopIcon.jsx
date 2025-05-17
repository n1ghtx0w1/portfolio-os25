import React from "react";

export default function DesktopIcon({
  icon,
  iconConfig,
  index,
  onClick,
  onContextMenu,
  isTrash,
  isTrashOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDragLeave,
}) {
  return (
    <div
      key={icon.id}
      className="absolute left-6 flex flex-col items-center cursor-pointer hover:opacity-90"
      style={{ top: `${6 + index * 72}px` }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...(isTrash
        ? {
            onDragOver,
            onDrop,
            onDragLeave,
            style: {
              top: `${6 + index * 72}px`,
              border: isTrashOver ? "2px solid red" : undefined,
            },
          }
        : {
            draggable: icon.trashable,
            onDragStart: () => onDragStart(icon.id),
            onDragEnd: onDragEnd,
          })}
    >
      <img src={icon.icon} alt={icon.name} className="w-12 h-12" />
      <span className="text-xs mt-1 text-center">{icon.name}</span>
    </div>
  );
}
