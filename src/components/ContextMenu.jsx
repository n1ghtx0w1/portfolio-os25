import React from "react";

/**
 * ContextMenu component for file actions.
 * Props:
 * - visible: boolean
 * - x, y: coordinates for positioning
 * - actions: array of { label, onClick, icon (optional), colorClass (optional) }
 * - onClose: callback when clicking backdrop or outside
 */
export default function ContextMenu({ visible, x, y, actions, onClose }) {
  if (!visible) return null;

  return (
    <>
      {/* Fullscreen invisible backdrop to close context menu on outside click */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "transparent" }}
        onClick={onClose}
      />
      {/* The actual context menu */}
      <div
        className="fixed z-50 bg-gray-800 text-white text-sm border border-gray-600 rounded shadow"
        style={{
          top: y,
          left: x,
          width: "180px",
        }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {actions.map((action, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 hover:bg-gray-700 cursor-pointer transition ${action.colorClass || ""}`}
            onClick={() => {
              action.onClick();
              onClose();
            }}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </div>
        ))}
      </div>
    </>
  );
}
