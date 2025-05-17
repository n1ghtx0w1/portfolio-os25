export default function ThankYouModal({ onClose, message = "You removed a malicious file from the OS!" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-[90vw] max-w-xs mx-auto text-center shadow-lg border border-green-500">
        <div className="text-3xl mb-2">👍</div>
        <h2 className="text-lg font-bold mb-2">Thank You</h2>
        <p className="mb-4 text-sm">{message}</p>
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
