import React from 'react';
import { X, History, Play, Layers } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const { historyItems, playSong } = useAudioPlayer();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#0e131b] border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-slate-100 font-sans">Playback History</h2>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {historyItems.length} (LIFO)
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description tag */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
        Last-In, First-Out Stack: Most recently played tracks at the top.
      </div>

      {/* Stack Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {historyItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Layers className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-400">History stack is empty</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Played songs will be pushed to the top of this stack for backtracking.
            </p>
          </div>
        ) : (
          historyItems.map((item, index) => (
            <div
              key={`${item.song.id}-${item.playedAt}`}
              className="flex items-center justify-between p-2 rounded bg-slate-900/40 hover:bg-slate-850 border border-slate-800/60 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-slate-400 w-4 text-center">
                  #{historyItems.length - index}
                </span>
                <div className="w-8 h-8 rounded bg-slate-800 overflow-hidden shrink-0">
                  <img
                    src={item.song.artwork}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-200 truncate">{item.song.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] font-mono tabular-nums text-slate-400">
                  {formatDuration(item.song.duration)}
                </span>
                <button
                  onClick={() => playSong(item.song)}
                  title="Replay track"
                  className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
