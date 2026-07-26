import React, { useState } from 'react';
import { 
  Wrench, FileSpreadsheet, FileText, Printer, Cpu, 
  Activity, HelpCircle, CheckCircle2, RefreshCcw 
} from 'lucide-react';

export default function FutureModules({ activeBHN, history }) {
  const [limsStatus, setLimsStatus] = useState('offline'); // offline, connecting, synced
  const [ceCarbon, setCeCarbon] = useState('3.2');
  const [ceSilicon, setCeSilicon] = useState('2.1');
  const [cePhosphorus, setCePhosphorus] = useState('0.15');

  // Hardness conversion estimates based on current corrected BHN
  const vickersHV = activeBHN ? Math.round(activeBHN * 1.02) : null;
  // HRC is defined generally for > 100 BHN. Very approximate ASTM conversion:
  const rockwellHRC = activeBHN && activeBHN > 240 
    ? (Math.round((0.11 * activeBHN - 15.4) * 10) / 10).toFixed(1)
    : 'N/A (<240 BHN)';
  // Tensile strength MPa estimation (UTS ≈ 3.45 * BHN for grey iron / steel)
  const tensileStrengthMPa = activeBHN ? Math.round(activeBHN * 3.45) : null;
  const tensileStrengthPSI = tensileStrengthMPa ? Math.round(tensileStrengthMPa * 145.038) : null;

  // Carbon Equivalent (CE) calculation
  const carbon = parseFloat(ceCarbon) || 0;
  const silicon = parseFloat(ceSilicon) || 0;
  const phosphorus = parseFloat(cePhosphorus) || 0;
  const carbonEquivalent = (carbon + (silicon + phosphorus) / 3).toFixed(2);

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  // CSV export logic for history
  const handleExportCSV = () => {
    if (history.length === 0) {
      alert('No history logs available to export.');
      return;
    }
    const headers = 'ID,Timestamp,Test Bar Diameter (mm),Casting Diameter (mm),Table BHN,Correction Factor,Corrected BHN\n';
    const rows = history.map(item => 
      `"${item.id}","${item.timestamp}","${item.bar}","${item.casting}","${item.tableBHN}","${item.factor}","${item.correctedBHN}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `brinell_hardness_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate ERP/LIMS API Sync
  const handleLimsSync = () => {
    setLimsStatus('connecting');
    setTimeout(() => {
      setLimsStatus('synced');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Conversions Card (Available when a BHN is active) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Activity className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Mechanical Conversions (ASTM E140 Estimate)
          </h2>
        </div>

        {activeBHN ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Vickers Hardness</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">{vickersHV}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">HV</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Rockwell Hardness</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">{rockwellHRC}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">HRC</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Tensile Strength (UTS)</span>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-800 dark:text-slate-200">{tensileStrengthMPa} MPa</span>
                <span className="text-[10px] text-slate-400 font-semibold">({tensileStrengthPSI?.toLocaleString()} PSI)</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium py-3">
            Select specimen parameters to calculate live hardness and tensile conversions.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chemical Carbon Equivalent (CE) Calculator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Cpu className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Casting CE Calculator
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Carbon %</label>
                <input
                  type="text"
                  value={ceCarbon}
                  onChange={(e) => setCeCarbon(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Silicon %</label>
                <input
                  type="text"
                  value={ceSilicon}
                  onChange={(e) => setCeSilicon(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Phos %</label>
                <input
                  type="text"
                  value={cePhosphorus}
                  onChange={(e) => setCePhosphorus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-xl mt-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Carbon Equivalent (CE)</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CE = C + (Si + P)/3</span>
              </div>
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {carbonEquivalent}%
              </span>
            </div>
          </div>
        </div>

        {/* Integration and Export Modules */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Wrench className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              System Sync & Export
            </h2>
          </div>

          <div className="space-y-4">
            {/* LIMS API Status / Sync simulation */}
            <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Foundry ERP / LIMS</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  {limsStatus === 'offline' && <span className="h-2 w-2 rounded-full bg-slate-400 inline-block"></span>}
                  {limsStatus === 'connecting' && <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping inline-block"></span>}
                  {limsStatus === 'synced' && <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>}
                  {limsStatus === 'offline' && 'LIMS API Endpoint Offline'}
                  {limsStatus === 'connecting' && 'Testing Sync Pipe...'}
                  {limsStatus === 'synced' && 'Synced (API Simulator)'}
                </span>
              </div>
              <button
                onClick={handleLimsSync}
                disabled={limsStatus === 'connecting'}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1"
              >
                {limsStatus === 'connecting' ? <RefreshCcw className="h-3 w-3 animate-spin" /> : 'Sync API'}
              </button>
            </div>

            {/* Print and CSV export actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4 text-sky-500" />
                Print Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
