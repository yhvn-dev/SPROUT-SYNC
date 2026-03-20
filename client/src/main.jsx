import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { UserProvider } from './hooks/userContext.jsx'


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        reg.update(); // ✅ check for new SW version on every page load
        console.log('✅ SW registered');

        // ✅ If a new SW is waiting, force it to activate immediately
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New version available, reloading...');
              window.location.reload();
            }
          });
        });
      })
      .catch((err) => console.log('❌ SW failed', err));
  });
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
