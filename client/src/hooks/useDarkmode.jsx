// hooks/useDarkMode.js
import { useState, useEffect } from "react";




export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Manual check first
    const bodyDark = document.body.classList.contains("dark");
    console.log('🟢 Manual check:', bodyDark); // ← Check this!
    setIsDark(bodyDark);

    const observer = new MutationObserver(() => {
      const nowDark = document.body.classList.contains("dark");
      console.log('🔄 Observer triggered:', nowDark);
      setIsDark(nowDark);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  console.log('📤 Returning isDark:', isDark); // ← FINAL CHECK
  return isDark;
}