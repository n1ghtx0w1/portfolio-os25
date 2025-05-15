import { useEffect, useRef, useState } from 'react';

const banner = `
             Welcome to
 ________    _________________   .________
\\_____  \\  /   _____/\\_____  \\  |   ____/
 /   |   \\ \\_____  \\  /  ____/  |____  \\ 
/    |    \\/        \\/       \\  /       \\
\\_______  /_______  /\\_______ \\/______  /
        \\/        \\/         \\/       \\/ 

            Latest @ v1.0
`;

const bootMessages = [
  '[ OK ] Initializing OS25 Kernel v1.3.2',
  '[ OK ] Detected CPU',
  '[ OK ] Detected memory',
  '[ OK ] Initializing virtual memory subsystem...',
  '[ OK ] Mounting root filesystem as read-write',
  '[ OK ] Starting udev kernel device manager...',
  '[ OK ] Activating swap partitions...',
  '[ OK ] Loading device drivers...',
  '[ OK ] Starting journaling file system...',
  '[ OK ] Checking disk quotas...',
  '[ OK ] Mounting /boot/efi',
  '[ OK ] Setting hostname to os25',
  '[ OK ] Applying SELinux security contexts...',
  '[ OK ] Configuring network interfaces...',
  '[ OK ] Bringing up loopback interface...',
  '[ OK ] Starting RPC bind service...',
  '[ OK ] Mounting NFS shares...',
  '[ OK ] Initializing USB controllers...',
  '[ OK ] Detecting SATA/IDE storage devices...',
  '[ OK ] Checking file system integrity...',
  '[ OK ] Starting system logging daemon...',
  '[ OK ] Launching D-Bus system message bus...',
  '[ OK ] Starting system time synchronization...',
  '[ OK ] Starting Avahi mDNS/DNS-SD daemon...',
  '[ OK ] Mounting /home volume...',
  '[ OK ] Starting CUPS printing service...',
  '[ OK ] Loading ACPI modules...',
  '[ OK ] Calibrating CPU frequency governor...',
  '[ OK ] Detecting available GPUs...',
  '[ OK ] Initializing ALSA sound system...',
  '[ OK ] Starting BlueZ Bluetooth stack...',
  '[ OK ] Starting NetworkManager daemon...',
  '[ OK ] Enabling AppArmor profiles...',
  '[ OK ] Setting up login services...',
  '[ OK ] Starting user profile daemon...',
  '[ OK ] Starting GNOME display manager...',
  '[ OK ] Applying system localization settings...',
  '[ OK ] Binding virtual file systems...',
  '[ OK ] Initializing shell environment...',
  '[ OK ] Starting cron daemon...',
  '[ OK ] Enabling scheduled tasks...',
  '[ WARN ] No DNS server specified — falling back to default.',
  '[ FAIL ] Unable to mount /mnt/backup. Skipping.',
  '[ OK ] Cleaning temporary directories...',
  '[ OK ] Starting update notifier daemon...',
  '[ OK ] Launching OS25 terminal session...',
  '[ OK ] Setting permissions on shared folders...',
  '[ OK ] Compiling dynamic kernel modules...',
  '[ OK ] Writing boot logs to /var/log/boot.log',
  '[ OK ] Starting SSH server...',
  '[ OK ] System ready for login.',
  '',
  'Type `start` or `help` to begin.',
];

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);
  const bootComplete = useRef(false);

  useEffect(() => {
    // Reset all refs when component (re)mounts
    indexRef.current = 0;
    bootComplete.current = false;
    setLines([]);

    function showNextLine() {
      if (bootComplete.current) return;

      const index = indexRef.current;
      if (index < bootMessages.length) {
        setLines((prev) => [...prev, bootMessages[index]]);
        indexRef.current++;

        const delay = index >= 15 ? 160 : 200;
        timeoutRef.current = setTimeout(showNextLine, delay);
      } else {
        bootComplete.current = true;
        setTimeout(onComplete, 500);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Enter' && !bootComplete.current) {
        bootComplete.current = true;
        clearTimeout(timeoutRef.current);
        setLines([...bootMessages]);
        setTimeout(onComplete, 100);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    showNextLine();

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const renderBootLine = (line, i) => {
    if (!line || typeof line !== 'string') {
      return <div key={i} className="text-white">&nbsp;</div>;
    }

    if (line.startsWith('[ OK ]')) {
      return (
        <div key={i}>
          <span className="text-green-400">[ OK ]</span>
          <span className="text-white">{line.slice(6)}</span>
        </div>
      );
    }

    if (line.startsWith('[ WARN ]')) {
      return (
        <div key={i}>
          <span className="text-yellow-400">[ WARN ]</span>
          <span className="text-white">{line.slice(8)}</span>
        </div>
      );
    }

    if (line.startsWith('[ FAIL ]')) {
      return (
        <div key={i}>
          <span className="text-red-500">[ FAIL ]</span>
          <span className="text-white">{line.slice(8)}</span>
        </div>
      );
    }

    return <div key={i} className="text-white">{line}</div>;
  };

  return (
    <div className="bg-black text-sm h-screen overflow-auto font-mono p-4 flex flex-col">
      <pre className="text-white mb-4 whitespace-pre leading-tight font-mono text-sm">
        {banner}
      </pre>
      <div className="text-gray-500 text-xs italic mb-2">(Press Enter to skip boot...)</div>
      <div className="text-green-400">
        {lines.map((line, i) => renderBootLine(line, i))}
      </div>
    </div>
  );
}
