import React from 'react';
import { X, Trash2, ArrowUp, ArrowDown, Play, ListMusic } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { queueItems, removeFromQueue, clearQueue, reorderQueue, playSong } = useAudioPlayer();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#0e131b] border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-100 font-sans">Upcoming Queue</h2>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {queueItems.length} (FIFO)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queueItems.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description tag for DSA project clarity */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
        First-In, First-Out: Next track plays from head of queue.
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {queueItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <ListMusic className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-400">Queue is empty</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Add songs from the catalog or playlists to sequence upcoming playback.
            </p>
          </div>
        ) : (
          queueItems.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-2 rounded bg-slate-900/50 hover:bg-slate-850 border border-slate-800/60 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-slate-400 w-4 text-center">
                  {index + 1}
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

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <span className="text-[10px] font-mono tabular-nums text-slate-400 mr-1">
                  {formatDuration(item.song.duration)}
                </span>
                
                {/* Play now button */}
                <button
                  onClick={() => playSong(item.song)}
                  title="Play immediately"
                  className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                >
                  <Play className="w-3 h-3" />
                </button>

                {/* Move Up */}
                {index > 0 && (
                  <button
                    onClick={() => reorderQueue(index, index - 1)}
                    title="Move up in queue"
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                )}

                {/* Move Down */}
                {index < queueItems.length - 1 && (
                  <button
                    onClick={() => reorderQueue(index, index + 1)}
                    title="Move down in queue"
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                )}

                {/* Remove */}
                <button
                  onClick={() => removeFromQueue(item.id)}
                  title="Remove from queue"
                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
