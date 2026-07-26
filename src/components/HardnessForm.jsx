import React from 'react';
import { RefreshCw, Compass, Calculator, ChevronDown } from 'lucide-react';

export default function HardnessForm({
  selectedBar,
  setSelectedBar,
  selectedCasting,
  setSelectedCasting,
  factor,
  setFactor,
  onReset,
  onCalculate,
  isDirty,
  data
}) {
  // All available Standard Test Bar diameters
  const barOptions = Object.keys(data);

  // Casting options filtered by selected bar
  const castingOptions =
    selectedBar && data[selectedBar] ? Object.keys(data[selectedBar]) : [];

  const minCasting = castingOptions[0] || null;
  const maxCasting = castingOptions[castingOptions.length - 1] || null;

  // When bar changes via <select>, reset casting if it's no longer valid
  const handleBarChange = (e) => {
    const bar = e.target.value;
    setSelectedBar(bar);
    if (bar && data[bar]) {
      const valid = Object.keys(data[bar]);
      if (!valid.includes(selectedCasting)) {
        setSelectedCasting('');
      }
    } else {
      setSelectedCasting('');
    }
  };

  // When the user manually types in the bar input
  const handleBarInput = (e) => {
    const bar = e.target.value;
    setSelectedBar(bar);
    // If the typed value is a valid key, auto-filter casting options
    if (data[bar]) {
      const valid = Object.keys(data[bar]);
      if (!valid.includes(selectedCasting)) {
        setSelectedCasting('');
      }
    } else {
      setSelectedCasting('');
    }
  };

  const handleFactorChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      setFactor(val);
    }
  };

  const inputClass =
    'w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all';

  const labelClass =
    'block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md transition-colors duration-300">
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Compass className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        <h2 className="text-base font-bold text-slate-950 dark:text-white">Specimen Parameters</h2>
      </div>

      <div className="space-y-4">

        {/* ── Test Bar Diameter: native select + manual text side by side ── */}
        <div>
          <label className={labelClass}>Standard Test Bar Diameter (mm)</label>
          <div className="flex gap-2">
            {/* Native dropdown */}
            <div className="relative flex-1">
              <select
                value={barOptions.includes(selectedBar) ? selectedBar : ''}
                onChange={handleBarChange}
                className={`${inputClass} appearance-none pr-8`}
              >
                <option value="">Select…</option>
                {barOptions.map((bar) => (
                  <option key={bar} value={bar}>{bar} mm</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>
            {/* Manual text input */}
            <input
              type="text"
              inputMode="decimal"
              placeholder="or type"
              value={selectedBar}
              onChange={handleBarInput}
              className={`${inputClass} w-24 shrink-0`}
            />
          </div>
        </div>

        {/* ── Casting Diameter: native select + manual text side by side ── */}
        <div>
          <label className={labelClass}>Casting Indentation Diameter (mm)</label>
          <div className="flex gap-2">
            {/* Native dropdown — disabled until bar is selected */}
            <div className="relative flex-1">
              <select
                value={castingOptions.includes(selectedCasting) ? selectedCasting : ''}
                onChange={(e) => setSelectedCasting(e.target.value)}
                disabled={!selectedBar}
                className={`${inputClass} appearance-none pr-8 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">{selectedBar ? 'Select…' : 'Pick bar first'}</option>
                {castingOptions.map((c) => (
                  <option key={c} value={c}>{c} mm</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>
            {/* Manual text input */}
            <input
              type="text"
              inputMode="decimal"
              placeholder="or type"
              value={selectedCasting}
              onChange={(e) => setSelectedCasting(e.target.value)}
              disabled={!selectedBar}
              className={`${inputClass} w-24 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
          {selectedBar && minCasting && (
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Valid: {minCasting} – {maxCasting} mm
            </p>
          )}
        </div>

        {/* ── Correction Factor ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass.replace('mb-1.5', '')}>Correction Factor</label>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-semibold">
              Default: 1.00
            </span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            placeholder="1.00"
            value={factor}
            onChange={handleFactorChange}
            className={inputClass}
          />
          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
            Leave blank to use 1.00
          </p>
        </div>

        {/* ── Buttons row: Calculate + Reset side by side ── */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCalculate}
            disabled={!selectedBar || !selectedCasting}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isDirty
                ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Calculator className="h-4 w-4 shrink-0" />
            {isDirty ? 'Calculate' : '✓ Done'}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 shrink-0" />
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
