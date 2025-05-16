import { Rnd } from "react-rnd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

export default function MarkdownViewer({ filename, content, onClose }) {
  return (
    <Rnd
      default={{
        x: 140,
        y: 140,
        width: 600,
        height: 400,
      }}
      minWidth={300}
      minHeight={200}
      bounds="window"
      dragHandleClassName="md-header"
      className="z-50 border border-gray-700 rounded-md overflow-hidden shadow-lg"
    >
      <div className="bg-gray-900 text-white flex flex-col h-full">
        <div className="md-header flex justify-between items-center bg-gray-800 text-white px-4 py-2 cursor-move border-b border-gray-700">
          <span className="font-bold">{filename}</span>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-500 px-2 py-0.5 rounded text-sm"
          >
            ✖
          </button>
        </div>
        <div className="p-4 overflow-auto prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </Rnd>
  );
}
