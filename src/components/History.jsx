import React, { useState } from 'react';
import { Trash2, Search, RotateCcw, Calendar, AlertTriangle, Copy, Check } from 'lucide-react';

export default function History({ history, onSelect, onDelete, onClearAll }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

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

  // Filter history logs by search term
  const filteredHistory = history.filter((item) => {
    const term = searchQuery.toLowerCase();
    return (
      item.bar.toString().includes(term) ||
      item.casting.toString().includes(term) ||
      item.correctedBHN.toString().includes(term) ||
      (item.timestamp && item.timestamp.toLowerCase().includes(term))
    );
  });

  const handleClearClick = () => {
    if (confirmClear) {
      // Second click — actually clear
      onClearAll();
      setConfirmClear(false);
    } else {
      // First click — show confirmation state
      setConfirmClear(true);
      // Auto-cancel confirmation after 3 seconds if user does nothing
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleCopyAll = async () => {
    const values = history
      .map((item) => item.correctedBHN)
      .filter((value) => value !== null && value !== undefined && value !== '')
      .join('\n');

    if (!values) return;

    const copied = await copyTextToClipboard(values);

    if (copied) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <div>
      {/* Top row: hint + Clear All button */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap sm:flex-nowrap">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Click any entry to reload its parameters.
        </p>
        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 text-xs font-bold transition-all bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg border-0 cursor-pointer whitespace-nowrap"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy All Hardness
                </>
              )}
            </button>
            <button
              onClick={handleClearClick}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all bg-transparent border-0 cursor-pointer whitespace-nowrap ${confirmClear
                ? 'text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg'
                : 'text-red-500 hover:text-red-600'
                }`}
            >
              {confirmClear ? (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Confirm Clear All?
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            No calculations recorded yet. Click <strong>Calculate Hardness</strong> to log a result.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search history (e.g. 3.5, 174)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* History list */}
          <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <p className="text-center py-4 text-[11px] text-slate-400">
                No logs match search criteria.
              </p>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-100/50 dark:hover:bg-slate-950/60 transition-all duration-200"
                >
                  {/* Clickable data area */}
                  <div
                    onClick={() => onSelect(item)}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded">
                        Bar {item.bar} mm
                      </span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded">
                        Cast {item.casting} mm
                      </span>
                      {parseFloat(item.factor) !== 1.00 && (
                        <span className="text-[9px] bg-sky-600/10 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold px-1.5 py-0.5 rounded">
                          F: {parseFloat(item.factor).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {item.correctedBHN}
                      </span>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">BHN</span>
                      {item.tableBHN && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          (Base: {item.tableBHN})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button
                      onClick={() => onSelect(item)}
                      title="Load into calculator"
                      className="p-2 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-600/10 transition-all cursor-pointer border-0 bg-transparent"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Delete entry"
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-600/10 transition-all cursor-pointer border-0 bg-transparent"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
