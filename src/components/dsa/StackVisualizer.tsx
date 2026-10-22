import React, { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, Eye, Trash2, Plus, Play } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song, HistoryItem } from '../../types';
import { formatDuration } from '../../utils/formatters';

export const StackVisualizer: React.FC = () => {
  const { allSongs, historyItems, playbackHistory, playSong } = useAudioPlayer();

  const [selectedSongId, setSelectedSongId] = useState(allSongs[1]?.id || allSongs[0]?.id);
  const [peekedItem, setPeekedItem] = useState<HistoryItem | null>(null);
  const [localStack, setLocalStack] = useState<HistoryItem[]>(() => {
    // Seed with 3 previous plays if empty
    return [
      { song: allSongs[3], playedAt: Date.now() - 300000 },
      { song: allSongs[2], playedAt: Date.now() - 180000 },
      { song: allSongs[0], playedAt: Date.now() - 60000 },
    ];
  });

  const [logs, setLogs] = useState<string[]>([
    'Initialized Playback History Stack (LIFO).',
    'Most recently played songs sit at the top of the stack.',
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  const handlePush = () => {
    const song = allSongs.find(s => s.id === selectedSongId);
    if (!song) return;
    const item: HistoryItem = { song, playedAt: Date.now() };
    setLocalStack(prev => [item, ...prev]);
    addLog(`[O(1)] PUSH: Pushed "${song.title}" to TOP of stack.`);
  };

  const handlePop = () => {
    if (localStack.length === 0) {
      addLog('Cannot POP from an empty stack.');
      return;
    }
    const popped = localStack[0];
    setLocalStack(prev => prev.slice(1));
    addLog(`[O(1)] POP: Removed top item "${popped.song.title}" from stack.`);
  };

  const handlePeek = () => {
    if (localStack.length === 0) {
      setPeekedItem(null);
      addLog('Stack is empty (peek returned null).');
      return;
    }
    const top = localStack[0];
    setPeekedItem(top);
    addLog(`[O(1)] PEEK: Inspected top track: "${top.song.title}". Stack unmodified.`);
  };

  const handleClear = () => {
    setLocalStack([]);
    setPeekedItem(null);
    addLog('Stack cleared. Top pointer reset to null.');
  };

  return (
    <div className="space-y-6">
      {/* Overview & Complexity Card */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Playback History Stack (LIFO – Last In, First Out)</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Stores played songs in reverse chronological sequence. When a listener clicks "Previous Track", the app pops from this stack in O(1) time.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Push: <strong className="text-emerald-400">O(1)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Pop: <strong className="text-emerald-400">O(1)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Peek: <strong className="text-emerald-400">O(1)</strong>
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase">Song to Push:</label>
            <select
              value={selectedSongId}
              onChange={(e) => setSelectedSongId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              {allSongs.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.artist})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePush}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Push [O(1)]</span>
          </button>

          <button
            onClick={handlePop}
            disabled={localStack.length === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-rose-400 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Pop (Rewind) [O(1)]</span>
          </button>

          <button
            onClick={handlePeek}
            disabled={localStack.length === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-emerald-400 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Peek Top [O(1)]</span>
          </button>

          <button
            onClick={handleClear}
            disabled={localStack.length === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-400 rounded font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Stack</span>
          </button>
        </div>

        {peekedItem && (
          <div className="p-2.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center justify-between">
            <span>
              Top of Stack: "{peekedItem.song.title}" by {peekedItem.song.artist} ({formatDuration(peekedItem.song.duration)})
            </span>
            <button
              onClick={() => playSong(peekedItem.song)}
              className="text-xs font-sans underline text-sky-200 hover:text-white"
            >
              Replay Track
            </button>
          </div>
        )}
      </div>

      {/* Visual Vertical Stack Container */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-sky-400 font-semibold flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5" /> TOP (Last In / First Out)
          </span>
          <span>Stack Height: {localStack.length} items</span>
        </div>

        <div className="max-w-md mx-auto space-y-2 border-x-2 border-b-2 border-slate-700/80 p-3 pt-6 rounded-b-xl bg-[#0b0e14]/60 min-h-[220px] flex flex-col justify-end">
          {localStack.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-mono text-xs">
              Stack is empty. Push songs onto the stack above.
            </div>
          ) : (
            localStack.map((item, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={`${item.song.id}-${item.playedAt}-${index}`}
                  className={`p-2.5 rounded border transition-all text-xs flex items-center justify-between ${
                    isTop
                      ? 'bg-sky-500/15 border-sky-400/80 ring-1 ring-sky-400/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono text-slate-400 w-6">
                      [{localStack.length - index - 1}]
                    </span>
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${isTop ? 'text-sky-300' : 'text-slate-200'}`}>
                        {item.song.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{item.song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isTop && (
                      <span className="bg-sky-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] font-mono">
                        TOP (PEEK)
                      </span>
                    )}
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">
                      {formatDuration(item.song.duration)}
                    </span>
                    <button
                      onClick={() => playSong(item.song)}
                      className="p-1 text-slate-400 hover:text-sky-400"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
          {/* Base of Stack */}
          <div className="text-center pt-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-t border-slate-800">
            Stack Base (Oldest Memory)
          </div>
        </div>
      </div>

      {/* Trace Log */}
      <div className="p-3 rounded-lg bg-[#0a0d14] border border-slate-800">
        <div className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-semibold">
          Execution Trace Log
        </div>
        <div className="space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className={idx === 0 ? 'text-sky-300 font-medium' : 'text-slate-400'}>
              › {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
