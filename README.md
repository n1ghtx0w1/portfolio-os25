# 🖥 OS25 Portfolio Terminal

**OS25** is a linux inspired portfolio site built as a terminal-emulated desktop environment.

This interactive experience launches with a bootloader screen, drops users into a fake Linux terminal, and allows them to transition into a desktop UI with a taskbar, terminal icon, and start menu.

---

## 🎮 Live Features

- ✅ Boot screen with animated service logs (Press `Enter` to skip)
- ✅ Terminal-style login shell (`guest@os25:~$`)
- ✅ Custom commands like `start`, `help`, `whoami`, and more
- ✅ Transition into a full desktop UI
- ✅ Start menu with external links and file explorer
- ✅ File Explorer with full Linux-style virtual file system
- ✅ Markdown support: `.md` files render inside a styled reader
- ✅ Blog system: folder loads markdown posts from `/src/content/blog`
- ✅ Desktop folder shortcut to open blog directly
- ✅ Folder and file icons for consistent UI across terminal and desktop
- ✅ Clock and volume slider in the taskbar
- ✅ Responsive, rounded, blurred taskbar with custom start button
- ✅ About window with profile image and bio text

---

## 🚀 Tech Stack

- **React** (via Vite)
- **Tailwind CSS**
- **JavaScript**
- No backend or authentication needed
- Fully client-side

---

## 📁 Project Structure
```
portfolio-os25/
├── public/                 
│   └── icons/              # Folder and terminal icons
├── src/
│   ├── components/         # Terminal, Desktop, FileExplorer, Viewers
│   ├── content/
│   │   └── blog/           # Markdown blog posts (auto-loaded)
│   ├── data/               # Virtual file system and loaders
│   ├── App.jsx             # Routing logic
│   └── main.jsx            # React entry point
└── README.md
```

---

## 🛠 Setup Instructions

```bash
git clone https://github.com/n1ghtx0w1/portfolio-os25.git
cd portfolio-os25
npm install
npm run dev
```

🧪 Example Commands (in terminal)
Command	Description
start	Launches desktop UI
help	Lists all available commands
whoami	Displays current user
motd	Shows message of the day
clear	Clears the screen
exit	Logs out or exits terminal mode

🌐 Demo
Coming soon...

📜 Credits & Attribution
I appreciate the amazing creative work of these artists and sources that made OS25 feel truly immersive:

📁 Folder Icon: SVGRepo - Files Folder
Licensed and hosted via SVGRepo.

🖥 Terminal Icon: Icons8 - Terminal Icons
Free for personal/non-commercial use with attribution.

🌌 Desktop Background: Wallpaper by vexel78 on Wallhaven
Visit their profile for more amazing artwork.

🎵 Rickroll Video: “Never Gonna Give You Up” by Rick Astley on YouTube
Copyright belongs to the original artist and label.

🙏 Thank you to all the creators above!

📜 License
MIT © 2024 Robert (n1ghtx0w1)
---
