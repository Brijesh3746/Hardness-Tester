import React from 'react';
import { Sun, Moon, Database, Activity, ShieldCheck, Download, Smartphone } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, showInstallBanner, onInstall, installPromptAvailable }) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-600/10 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl border border-sky-600/20 dark:border-sky-500/20 shadow-inner">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Brinell Hardness Calculator
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-sky-600/10 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-600/20 dark:border-sky-500/20">
                Castings
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Foundry Metallurgy & Quality Assurance System • ISO 6506 Standards
            </p>
          </div>
        </div>

        {/* Status Indicators & Theme Toggle */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {showInstallBanner && (
            <div className="flex items-center gap-2 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-500/10 px-3 py-1.5">
              {installPromptAvailable ? (
                <button
                  onClick={onInstall}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-sky-600 text-white border border-sky-500 shadow-sm hover:bg-sky-700 transition-all cursor-pointer rounded-md px-2.5 py-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install App
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile: open browser menu → Add to Home screen
                </div>
              )}
            </div>
          )}
          {/* Offline/Database Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Database className="h-3.5 w-3.5" />
            <span>Local Database Offline-Ready</span>
          </div>

          {/* System Calibration Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Calibration Verified</span>
          </div>

          {/* Theme Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
