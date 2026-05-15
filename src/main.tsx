import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('App Initializing...');
console.log('Environment Debug:', {
  hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
  isPlaceholderUrl: import.meta.env.VITE_SUPABASE_URL?.includes('placeholder'),
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  apiUrl: import.meta.env.VITE_SUPABASE_URL ? `${import.meta.env.VITE_SUPABASE_URL.substring(0, 15)}...` : 'NONE'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
