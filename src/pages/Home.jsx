import React, { useState, useEffect } from 'react';
import HardnessForm from '../components/HardnessForm';
import ResultCard from '../components/ResultCard';
import History from '../components/History';
import FutureModules from '../components/FutureModules';
import hardnessData from '../data/hardness.json';
import { History as HistoryIcon, Layers } from 'lucide-react';

export default function Home() {
  const [selectedBar, setSelectedBar]     = useState('');
  const [selectedCasting, setSelectedCasting] = useState('');
  const [factor, setFactor]               = useState('1.00');
  const [history, setHistory]             = useState([]);
  const [activeTab, setActiveTab]         = useState('history');

  // ── Result state: only set when Calculate is clicked ────────────────────────
  const [tableHardness, setTableHardness]         = useState(null);
  const [correctedHardness, setCorrectedHardness] = useState(null);
  // Tracks whether the current inputs differ from the last calculated result
  const [isDirty, setIsDirty] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('brinell_calculator_history');
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Mark inputs as dirty (needs recalculation) whenever user changes any field
  useEffect(() => {
    setIsDirty(true);
  }, [selectedBar, selectedCasting, factor]);

  // ── Calculate on button click ────────────────────────────────────────────────
  const handleCalculate = () => {
    if (!selectedBar || !selectedCasting) return;

    let tbl = null;
    let cor = null;

    if (hardnessData[selectedBar] && hardnessData[selectedBar][selectedCasting] !== undefined) {
      tbl = hardnessData[selectedBar][selectedCasting];
      const parsedFactor = parseFloat(factor) || 1.0;
      cor = Math.round(tbl * parsedFactor * 10) / 10;
    }

    setTableHardness(tbl);
    setCorrectedHardness(cor);
    setIsDirty(false);

    // Save to history only if valid result
    if (tbl !== null && cor !== null) {
      const last = history[0];
      const isDup =
        last &&
        last.bar === selectedBar &&
        last.casting === selectedCasting &&
        parseFloat(last.factor) === (parseFloat(factor) || 1.0) &&
        last.correctedBHN === cor;

      if (!isDup) {
        const timestamp = new Date().toLocaleString([], {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        });

        const entry = {
          id: Date.now().toString(),
          timestamp,
          bar: selectedBar,
          casting: selectedCasting,
          tableBHN: tbl,
          factor: factor || '1.00',
          correctedBHN: cor,
        };

        const updated = [entry, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem('brinell_calculator_history', JSON.stringify(updated));
      }
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setSelectedBar('');
    setSelectedCasting('');
    setFactor('1.00');
    setTableHardness(null);
    setCorrectedHardness(null);
    setIsDirty(false);
  };

  const handleSelectHistoryItem = (item) => {
    setSelectedBar(item.bar);
    setSelectedCasting(item.casting);
    setFactor(item.factor);
    // Immediately show results when loading from history
    setTableHardness(item.tableBHN);
    setCorrectedHardness(item.correctedBHN);
    setIsDirty(false);
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('brinell_calculator_history', JSON.stringify(updated));
  };

  // Clear All — no window.confirm, uses inline confirm state in History component
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('brinell_calculator_history');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 transition-colors duration-300">

      {/* ── TOP: Hardness parameters only ────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
          <HardnessForm
            selectedBar={selectedBar}
            setSelectedBar={setSelectedBar}
            selectedCasting={selectedCasting}
            setSelectedCasting={setSelectedCasting}
            factor={factor}
            setFactor={setFactor}
            onReset={handleReset}
            onCalculate={handleCalculate}
            isDirty={isDirty}
            data={hardnessData}
          />

          <ResultCard
            tableHardness={tableHardness}
            correctedHardness={correctedHardness}
            selectedBar={selectedBar}
            selectedCasting={selectedCasting}
            factor={factor}
            isDirty={isDirty}
            onReset={handleReset}
          />
        </div>
      </section>

      {/* ── BOTTOM: Tabbed section (History / Modules) ───────────────────────── */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden transition-colors duration-300">
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all cursor-pointer border-0 ${
              activeTab === 'history'
                ? 'border-b-2 border-sky-600 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-500/5'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent'
            }`}
          >
            <HistoryIcon className="h-4 w-4" />
            Calculation History
            {history.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-600 text-white">
                {history.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all cursor-pointer border-0 ${
              activeTab === 'modules'
                ? 'border-b-2 border-sky-600 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-500/5'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent'
            }`}
          >
            <Layers className="h-4 w-4" />
            Analysis & Tools
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'history' ? (
            <History
              history={history}
              onSelect={handleSelectHistoryItem}
              onDelete={handleDeleteHistoryItem}
              onClearAll={handleClearHistory}
            />
          ) : (
            <FutureModules activeBHN={correctedHardness} history={history} />
          )}
        </div>
      </section>

    </main>
  );
}
