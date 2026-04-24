import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clean mangled /admin URLs (reset links get rewritten by some email
// scanners into paths like /admin/?/&/~and~/~and~/...~and~reset=<token>).
// Runs before React mounts so refreshes immediately land on a canonical URL.
(() => {
  const href = window.location.href;
  if (!/\/admin(\/|$|\?)/i.test(window.location.pathname + window.location.search)) return;
  const needsCleanup = /~and~/.test(href) || window.location.pathname !== '/admin';
  if (!needsCleanup) return;
  const token = /reset=([a-f0-9]{32,})/i.exec(href)?.[1];
  const target = token ? `/admin?reset=${token}` : '/admin';
  window.history.replaceState({}, '', target);
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
