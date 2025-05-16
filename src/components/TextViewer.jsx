import { Rnd } from "react-rnd";

export default function KateViewer({ filename, content, onClose }) {
  return (
    <Rnd
      default={{
        x: 120,
        y: 120,
        width: 600,
        height: 400,
      }}
      minWidth={300}
      minHeight={200}
      bounds="window"
      dragHandleClassName="kate-header"
      className="z-50 border border-blue-600 rounded-md overflow-hidden shadow-lg"
    >
      <div className="bg-gray-900 text-white flex flex-col h-full font-mono">
        {/* Header with filename tab */}
        <div className="kate-header flex items-center justify-between bg-blue-800 text-white px-4 py-2 cursor-move">
          <span className="font-bold">{filename} - Kate</span>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded text-sm"
          >
            ✖
          </button>
        </div>

        {/* Toolbar (optional) Here */}


        {/* Text area */}
        <textarea
          value={content}
          readOnly
          className="flex-1 bg-gray-950 text-white p-3 text-sm outline-none resize-none"
        />
      </div>
    </Rnd>
  );
}
