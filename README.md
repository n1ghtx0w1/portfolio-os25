# 🖥 OS25 Portfolio Terminal

**OS25** is a linux inspired portfolio site built as a terminal-emulated desktop environment.

This interactive experience launches with a bootloader screen, drops users into a fake Linux terminal, and allows them to transition into a desktop UI with a taskbar, terminal icon, and start menu.

![Bootloader](/images/bootloader-image.png)

![Terminal](/images/terminal-image.png)

![Desktop](/images/desktop-image.png)

---

## 🎮 Live Features

- ✅ Boot screen with animated service logs (Press `Enter` to skip)
- ✅ Terminal-style login shell (`guest@os25:~$`)
- ✅ Custom commands like `start`, `help`, `whoami`, and more
- ✅ Transition into a full desktop UI
- ✅ Start menu with external links and file explorer
- ✅ File Explorer with full Linux-style virtual file system
- ✅ Markdown support: `.md` files render inside a styled reader
- ✅ Blog system: auto-loads `.md` posts from `/src/blog`, sorted by date with title and preview image support
- ✅ Desktop folder shortcut to open blog directly
- ✅ Folder and file icons for consistent UI across terminal and desktop
- ✅ Clock and volume slider in the taskbar
- ✅ Responsive, rounded, blurred taskbar with custom start button
- ✅ About window with profile image and bio text
- ✅ Achievements & Awards modal: Accessible from the About window, displays certificates and CTF awards from markdown, with images served from `/public/certificates/`

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
│   └── certificates/       # Award & certificate images (for achievements modal)
├── src/
│   ├── components/         # Terminal, Desktop, FileExplorer, Viewers
│   │── blog/               # Markdown blog posts (auto-loaded from frontmatter)
│   ├── data/               # Virtual file system and loaders
│   ├── App.jsx             # Routing logic
│   └── main.jsx            # React entry point
└── README.md
```

---

## 📝 Writing Blog Posts

To add a new blog post, create a `.md` file inside `/src/blog/` with the following structure:

```md
---
title: "My Latest Blog Post"
date: "2025-05-17"
---
```
---

## 🏆 Adding Certificates & Awards

To display certificates/awards in the Achievements modal:

1. Place your `.jpg` or `.png` images in `/public/certificates/`
2. Reference them in your markdown as:
*Do not include `/public` in the path!*

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

---

🌐 **Live Demo:** [https://www.headsec.blog](https://www.headsec.blog)

---

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
