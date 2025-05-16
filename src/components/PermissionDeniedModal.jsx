export default function PermissionDeniedModal({ onClose }) {
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
