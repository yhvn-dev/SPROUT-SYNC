
import {ArrowBigDown} from 'lucide-react';
import { useState, useEffect } from 'react';


export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      console.log("🔥 beforeinstallprompt fired");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User installed SproutSync");
    }
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleInstall}
      className="cursor-pointer flex fixed bottom-6 right-6 z-50 px-6 py-4 rounded-full 
      bg-[var(--sancgb)] hover:bg-[var(--sancgc)] text-white"
    >
     <ArrowBigDown className="mr-8"/> Install SproutSync
    </button>
  );
}

