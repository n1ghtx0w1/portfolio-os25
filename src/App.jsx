import { useState } from 'react';
import BootScreen from './components/BootScreen';
import Terminal from './components/Terminal';

export default function App() {
  const [booted, setBooted] = useState(false);

  return booted ? (
    <Terminal />
  ) : (
    <BootScreen onComplete={() => setBooted(true)} />
  );
}
