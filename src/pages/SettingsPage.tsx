import React, { useState, useRef } from 'react';
import { Settings, Download, Upload, RefreshCw, FileText, Keyboard, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { StorageService } from '../services/storageService';

export const SettingsPage: React.FC = () => {
  const { allSongs, playlists, favoriteIds, resetDemoData, addToast } = useAudioPlayer();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportAllDataAsJSON(allSongs, playlists, Array.from(favoriteIds));
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TuneFlow_Library_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Library exported', 'JSON backup file generated', 'success');
  };

  const handleExportCSV = () => {
    const csvStr = StorageService.exportSongsAsCSV(allSongs);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TuneFlow_Songs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Songs exported', 'CSV file generated', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.playlists) {
          StorageService.savePlaylists(parsed.playlists);
        }
        if (parsed.favorites) {
          StorageService.saveFavoriteIds(parsed.favorites);
        }
        if (parsed.customSongs) {
          StorageService.saveCustomTracks(parsed.customSongs);
        }
        addToast('Backup restored successfully', 'Reloading catalog state...', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        addToast('Invalid backup file', 'Could not parse JSON structure', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl text-xs">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans tracking-tight">
          System Preferences & Storage
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          TuneFlow v2.0 · Local storage persistence & data management
        </p>
      </div>

      {/* Backup & Data Portability Card */}
      <div className="p-5 rounded-xl bg-[#0e131b] border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 font-sans flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400" />
            <span>Data Portability (Export & Import)</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Save or restore all your playlists, favorites, and track indices to your local device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Library Backup (JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded font-medium flex items-center gap-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Tracks as CSV</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Restore Backup (JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="p-5 rounded-xl bg-[#0e131b] border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 font-sans flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-sky-400" />
          <span>Keyboard Shortcuts Reference</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Play / Pause</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              Space
            </kbd>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Command & Search Palette</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              Ctrl + K / ⌘ + K
            </kbd>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Next Track</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              Ctrl + →
            </kbd>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Previous Track</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              Ctrl + ←
            </kbd>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Mute / Unmute Audio</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              M
            </kbd>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Close Modals / Drawers</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              ESC
            </kbd>
          </div>
        </div>
      </div>

      {/* Audio Engine Architecture Notice */}
      <div className="p-5 rounded-xl bg-[#0e131b] border border-slate-800 space-y-2">
        <h3 className="text-sm font-semibold text-slate-200 font-sans flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>TuneFlow Hybrid Audio Engine</span>
        </h3>
        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          TuneFlow combines native HTML5 Audio for streaming verified legal public-domain audio (Bach, Chopin, Satie, Vivaldi, Debussy) with a procedural Web Audio harmonic synthesizer. If an external connection drops or audio files are restricted by browser sandbox, the procedural synthesizer renders real harmonic chords and rhythmic pulses corresponding to the song's key and tempo so music playback never breaks.
        </p>
      </div>

      {/* Factory Reset */}
      <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm font-sans">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset Demo Catalog</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Restore default initial playlists, remove custom uploaded tracks, and reset playback history.
        </p>

        {showResetConfirm ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleConfirmReset}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
            >
              Confirm Factory Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-1.5 bg-slate-900 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
