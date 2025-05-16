import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

export default function MarkdownViewer({ filename, content, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 overflow-y-auto">
      <div className="flex justify-between items-center bg-gray-800 px-4 py-3 border-b border-gray-700">
        <span className="text-lg font-bold">{filename}</span>
        <button
          onClick={onClose}
          className="text-sm text-blue-400 hover:text-blue-500 px-2 py-1 rounded"
        >
          ✖ Close
        </button>
      </div>

      <div className="prose prose-invert max-w-4xl mx-auto px-6 py-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
