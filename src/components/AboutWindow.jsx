import profileImg from '../assets/images/profile1.jpg';
import { Rnd } from "react-rnd";

export default function AboutWindow({ onClose }) {
  const isMobile = window.innerWidth < 640;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-2 sm:p-4">
      <Rnd
        default={{
          x: isMobile ? 0 : 100,
          y: isMobile ? 0 : 100,
          width: isMobile ? "100%" : 600,
          height: "auto",
        }}
        minWidth={300}
        bounds="window"
        disableDragging={isMobile}
        enableResizing={false}
        className="mx-auto my-auto border border-gray-300 rounded-xl shadow-lg bg-white text-black"
      >
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 cursor-move">
            <h2 className="text-xl font-semibold">👤 About Me</h2>
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-red-500">❌</button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <img
              src={profileImg}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border border-gray-400 mx-auto sm:mx-0"
            />

            <div>
              <p className="text-sm mb-3">
                Hi, I’m <strong>Robert</strong>, Lorem ipsum dolor sit amet, consectetur adipiscing 
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <p className="text-sm mb-3">
                My skills include consequat. Duis aute irure dolor in reprehenderit in voluptate 
                velit esse cillum dolore eu fugiat nulla pariatur.
              </p>

              <p className="text-sm">🛠 Tools I work with: React, Supabase, Tailwind, Linux, Burp, Wireshark</p>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
