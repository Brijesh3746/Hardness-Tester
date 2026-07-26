import React, { useState, useEffect } from 'react';
import { Copy, Check, Info, Award, AlertTriangle } from 'lucide-react';

export default function ResultCard({
  tableHardness,
  correctedHardness,
  selectedBar,
  selectedCasting,
  factor,
  isDirty,
  onReset
}) {
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);

  const copyTextToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback', error);
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return copied;
    } catch (error) {
      console.error('Copy fallback failed', error);
      return false;
    }
  };

  // Trigger pulse animation when correctedHardness changes
  useEffect(() => {
    if (correctedHardness) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [correctedHardness]);

  const handleCopy = async () => {
    if (!correctedHardness) return;

    const text = `Corrected Hardness: ${correctedHardness} BHN
Test Bar Diameter: ${selectedBar} mm
Casting Diameter:  ${selectedCasting} mm
Correction Factor: ${parseFloat(factor || 1.00).toFixed(2)}`;

    const copied = await copyTextToClipboard(text);

    if (copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasSelection = selectedBar && selectedCasting;
  const hasData = tableHardness !== null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Award className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Analysis Report
          </h2>
        </div>

        {/* Stale result banner — shown when inputs changed after last calculate */}
        {isDirty && correctedHardness !== null && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              Inputs changed — click <strong>Calculate Hardness</strong> to update.
            </p>
          </div>
        )}

        {!hasSelection ? (
          /* Empty State prompt */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 mb-4 border border-slate-200/50 dark:border-slate-800/50">
              <Info className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Awaiting Indentation Inputs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px]">
              Select a Test Bar and specimen Casting diameter in the parameters form to view BHN calculations.
            </p>
          </div>
        ) : !hasData ? (
          /* Missing Combination warning */
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-amber-500/20 rounded-xl bg-amber-500/5">
            <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 border border-amber-500/25">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">
              No hardness data available.
            </h3>
            <p className="text-xs text-amber-700/80 dark:text-amber-500/80 max-w-[260px] px-4">
              The selected indentation combination ({selectedBar}mm / {selectedCasting}mm) does not exist in the standard comparison table.
            </p>
          </div>
        ) : (
          /* Output display */
          <div className="space-y-6">
            {/* Table Hardness baseline */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/50">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Standard Table Hardness
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {tableHardness}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  BHN
                </span>
              </div>
            </div>

            {/* Corrected Hardness (Live Multiplied) */}
            <div className="bg-sky-600/5 dark:bg-sky-500/5 rounded-xl p-5 border border-sky-600/20 dark:border-sky-500/20 relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-600/10 text-sky-600 dark:text-sky-400 border border-sky-600/25">
                Factor Applied: {parseFloat(factor || 1.00).toFixed(2)}
              </div>

              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Corrected Hardness
              </span>

              <div className={`flex items-baseline gap-2 transition-all duration-300 ${pulse ? 'scale-105 text-sky-600 dark:text-sky-400' : ''
                }`}>
                <span className="text-5xl font-black tracking-tight text-slate-950 dark:text-white drop-shadow-md">
                  {correctedHardness}
                </span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                  BHN
                </span>
              </div>

              {/* Metal evaluation note */}
              <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Metallurgic assessment: {correctedHardness >= 300 ? (
                  <span className="text-red-500 font-semibold">High Hardness / Brittle</span>
                ) : correctedHardness >= 180 ? (
                  <span className="text-emerald-500 font-semibold">Standard Grey Iron range</span>
                ) : (
                  <span className="text-amber-500 font-semibold">Low Hardness / Soft</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {hasSelection && hasData && (
        <div className="grid grid-cols-2 gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Action: Copy results */}
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${copied
              ? 'bg-emerald-600 text-white border border-emerald-600'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/10'
              }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Result
              </>
            )}
          </button>

          {/* Action: Reset */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/40 transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
