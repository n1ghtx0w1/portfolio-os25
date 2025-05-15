# 🖥 OS25 Portfolio Terminal

**OS25** is a linux inspired portfolio site built as a terminal-emulated desktop environment.

This interactive experience launches with a bootloader screen, drops users into a fake Linux terminal, and allows them to transition into a desktop UI with a taskbar, terminal icon, and start menu.

---

## 🎮 Live Features

- ✅ Boot screen with animated service logs (Press `Enter` to skip)
- ✅ Terminal-style login shell (`guest@os25:~$`)
- ✅ Custom commands like `start`, `help`, `whoami`, and more
- ✅ Transition into a full desktop UI
- ✅ Start menu with basic app launcher
- ✅ Terminal icon to return to command view
- ✅ Clock and volume slider like a real OS

---

## 🚀 Tech Stack

- **React** (via Vite)
- **Tailwind CSS**
- **JavaScript**
- No backend or authentication needed
- Fully client-side

---

## 📁 Project Structure

/public # Static files (icons, backgrounds)
├── icons/ # Terminal SVG, etc.
/src
├── components/ # Terminal.jsx, BootScreen.jsx, Desktop.jsx
├── App.jsx # Routing logic
├── main.jsx # React entry point

---

## 🛠 Setup Instructions

git clone https://github.com/n1ghtx0w1/portfolio-os25.git
cd portfolio-os25
npm install
npm run dev
Then open http://localhost:5173 in your browser.

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

📜 License
MIT © 2024 Robert Head (n1ghtx0w1)
---
