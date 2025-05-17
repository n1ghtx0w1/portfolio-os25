import profileImg from '../assets/images/profile1.jpg';
import { Rnd } from "react-rnd";

export default function AboutWindow({ onClose, onShowAchievements }) {
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
                🧑‍💻 Hi, I’m <strong>Robert</strong>, and I'm a BSCIA student at Western Governors 
                University! I'm a member of the cyber club, I enjoy CTF competitions, and time 
                with my family. I love designing and engineering projects, and using my knowledge
                to protect and defend others.
              </p>

              <p className="text-sm mb-3">
                🔐 My skills & experience include: crisis management / major incident management, root cause analysis,
                full stack development, networking, DevOps, cloud environments (Oracle Gov, Amazon GCC, Google GCP), project management, 
                and cyber security / risk management.
              </p>

              <p className="text-sm">🛠 Tools I work with: Jira, Confluence, Salesforce, Office365 Suite, 
                eMASS, ServiceNow, VSCode, Ansible, Git, JavaScript, React, Supabase, MySQL, NoSQL, Tailwind, 
                Postman, Docker, Linux, Windows, IOS, Android, PFSense, Burp, Wireshark, Metasploit, 
                BloodHound, Mimikatz, and more.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => { onShowAchievements(); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-medium transition justify-center"
                  title="View Achievements, Awards, & Certificates"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75l-6.16 3.24 1.18-6.88L2 9.75l6.92-1.01L12 2.25l3.08 6.49 6.92 1.01-5.02 4.36 1.18 6.88z" /></svg>
                  Achievements
                </button>
                <a
                  href="https://www.linkedin.com/in/robert-head-0x0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium transition justify-center"
                  title="Connect on LinkedIn"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="inline-block" aria-hidden="true">
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 10.27h-3v-4.58c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.18-1.75 2.4v4.67h-3v-9h2.89v1.23h.04c.4-.75 1.36-1.54 2.8-1.54 2.99 0 3.54 1.97 3.54 4.53v4.78z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
