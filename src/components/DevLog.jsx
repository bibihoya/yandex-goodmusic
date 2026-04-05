import { useEffect, useState } from 'react';

export default function DevLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleError = (event) => {
      // In a real app this would just log, but here it's part of the UX
      setLogs(prev => {
        const newLogs = [...prev, `[ERROR] ${event.message || event.reason}`];
        if (newLogs.length > 5) return newLogs.slice(newLogs.length - 5);
        return newLogs;
      });
      // Prevent actual console errors from crashing UI if we want to handle them
      // event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/90 border border-red-500 rounded p-3 text-red-500 font-mono text-xs z-50 overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.5)]">
      <h4 className="border-b border-red-900 pb-1 mb-2">🐛 ДевЛог (Фича, а не баг)</h4>
      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap">{log}</div>
        ))}
      </div>
    </div>
  );
}
