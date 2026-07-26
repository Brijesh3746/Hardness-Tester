import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    };

    const mobileMatch = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    setIsMobileDevice(mobileMatch);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const updateStandaloneMode = () => {
      setIsStandalone(mediaQuery.matches || Boolean(window.navigator.standalone));
    };
    updateStandaloneMode();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateStandaloneMode);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateStandaloneMode);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const shouldShowInstallBanner = !isStandalone && (showInstallBanner || isMobileDevice);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      <div>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showInstallBanner={shouldShowInstallBanner}
          onInstall={handleInstallClick}
          installPromptAvailable={Boolean(installPrompt)}
        />
        <Home />
      </div>

      {/* Footer / Metal Standard conformity label */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">
        <p>© 2026 Foundry Metallurgy Automation Systems. All rights reserved.</p>
        <p className="mt-1 font-medium">ISO 6506-1:2014 Metallic Materials - Brinell Hardness Test Comparison Standard. Local Database Version: 1.0.0 (Calibration Checked).</p>
      </footer>
    </div>
  );
}

export default App;
