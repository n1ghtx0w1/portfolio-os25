export const fileSystem = {
  "/": {
    home: {
      guest: {
        documents: {
          "readme.txt": "Welcome to OS25!",
        },
        blog: {
          // blog files are injected at runtime as:
          // "filename.md": { content: "...", title: "...", date: Date }
        },
      },
    },
    tmp: {
      "exploit.sh": `#!/bin/bash
echo "Accessing secure subsystem..."
sleep 1😈"
`,
    },
    etc: {
      "h4x0r.conf": "# elite config\nroot_access=true\n",
      passwd: "root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:Guest:/home/guest:/bin/bash",
    },
    usr: {
      bin: {
        neofetch: "#!/bin/bash\necho 'Welcome to OS25 — Hack the Planet!'",
      },
    },
    var: {
      log: {
        "mission.log": "login success: agent=root\nalert: intrusion detected\n",
      },
    },
    root: {
      "flag.txt": "congrats_you_f0und_it",
      "diary.md": "# Private\nToday I launched OS25. No one knows yet...",
    },
    opt: {},
  },
};
