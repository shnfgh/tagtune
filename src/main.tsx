// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Polyfill Buffer and process for browser environment (required by music-metadata-browser)
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;

  // Minimal process shim (no extra dependency needed)
  if (!(window as any).process) {
    (window as any).process = {
      env: { NODE_ENV: 'production' },
      browser: true,
      nextTick: (fn: (...args: any[]) => void, ...args: any[]) => setTimeout(() => fn(...args), 0),
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
