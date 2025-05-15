import { useState } from 'react';
import Desktop from './Desktop';

const banner = `
 ________    _________________   .________
\\_____  \\  /   _____/\\_____  \\  |   ____/
 /   |   \\ \\_____  \\  /  ____/  |____  \\ 
/    |    \\/        \\/       \\  /       \\
\\_______  /_______  /\\_______ \\/______  /
        \\/        \\/         \\/       \\/ 

Welcome to OS25 Terminal
`;

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'Start to enter or help for more options',
  ]);
  const [desktop, setDesktop] = useState(false);
  const [loadingDesktop, setLoadingDesktop] = useState(false);


  if (loadingDesktop) {
  return (
    <div className="w-screen h-screen bg-black text-green-400 flex items-center justify-center text-xl font-mono">
      <div className="animate-pulse">Launching OS25 Desktop...</div>
    </div>
  );
}

  // Handle desktop switch 
  if (desktop) return <Desktop onExit={() => setDesktop(false)} />;

const handleCommand = (e) => {
  if (e.key === 'Enter') {
    const trimmed = input.trim().toLowerCase();
    let response = '';

    if (trimmed === 'start') {
      setLoadingDesktop(true);
      setTimeout(() => {
        setLoadingDesktop(false);
        setDesktop(true);
      }, 1000);
      return;
    } else if (trimmed === 'help') {
      response = 'Available commands: start, help, about, clear, exit, motd, whoami, date';
    } else if (trimmed === 'about') {
      response = 'This portfolio belongs to Robert Head, a cybersecurity developer.';
    } else if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (trimmed === 'exit') {
      response = 'Logging out...';
    } else if (trimmed === 'motd') {
      response = 'Start to enter or help for more options';
    } else if (trimmed === 'whoami') {
      response = 'guest';
    } else if (trimmed === 'date') {
      response = new Date().toString();
    } else {
      response = `Command not recognized: ${trimmed}`;
    }

    setHistory((prev) => [...prev, `guest@os25:~$ ${input}`, response]);
    setInput('');
  }
};

  return (
    <div className="bg-black text-white h-screen p-4 font-mono text-sm overflow-auto">
      {/* Login prompt */}
      <div className="mb-2">
        <div className="text-white">OS25 Secure Terminal tty1</div>
      </div>

      {/* ASCII Banner */}
      <pre className="text-white mb-4 whitespace-pre leading-tight">
        {banner}
      </pre>

      {/* Message of the Day */}
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}

      {/* User Input */}
      <div className="flex">
        <span className="pr-1 text-red-500">guest@os25:~$</span>
        <input
          className="bg-black text-white outline-none w-full"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
        />
      </div>
    </div>
  );
}

