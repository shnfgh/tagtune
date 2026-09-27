// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Polyfill Buffer for browser environment (required by music-metadata-browser)
if (typeof window !== 'undefined') { (window as any).Buffer = Buffer; (window as any).global = window; }

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
