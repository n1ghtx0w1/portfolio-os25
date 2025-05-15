import profileImg from '../assets/images/profile1.jpg'; 


export default function AboutWindow({ onClose }) {
  return (
<div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[600px] max-h-[calc(100vh-6rem)] bg-white text-black rounded-xl border border-gray-300 shadow-lg p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">👤 About Me</h2>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-red-500">❌</button>
      </div>

      <div className="flex gap-6">
        <img src={profileImg} alt="Profile" className="w-32 h-32 rounded-lg object-cover border border-gray-400" />

        <div>
          <p className="text-sm mb-3">
            Hi, I’m <strong>Robert</strong>, Lorem ipsum dolor sit amet, consectetur adipiscing 
            elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
          </p>

          <p className="text-sm mb-3">
            My skills include consequat. Duis aute irure dolor in reprehenderit in voluptate 
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <p className="text-sm">🛠 Tools I work with: React, Supabase, Tailwind, Linux, Burp, Wireshark</p>
        </div>
      </div>
    </div>
  );
}
