import React, { useState } from 'react';
import { ListMusic, ArrowRight, Plus, Trash2, Eye, Play } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song, QueueItem } from '../../types';
import { formatDuration } from '../../utils/formatters';

export const QueueVisualizer: React.FC = () => {
  const { allSongs, queueItems, enqueueSong, removeFromQueue, clearQueue, playSong } = useAudioPlayer();

  const [selectedSongId, setSelectedSongId] = useState(allSongs[0]?.id || '');
  const [peekedItem, setPeekedItem] = useState<QueueItem | null>(null);
  const [logs, setLogs] = useState<string[]>([
    'Initialized Playback Queue (FIFO).',
    'Upcoming tracks will dequeue from the front and play in scheduled order.',
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  const handleEnqueue = () => {
    const song = allSongs.find(s => s.id === selectedSongId);
    if (!song) return;
    enqueueSong(song);
    addLog(`[O(1)] Enqueued "${song.title}" to back (tail) of queue.`);
  };

  const handleEnqueueFront = () => {
    const song = allSongs.find(s => s.id === selectedSongId);
    if (!song) return;
    enqueueSong(song, true);
    addLog(`[O(n) / Deque O(1)] Enqueued "${song.title}" at head of queue (Play Next).`);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) {
      addLog('Cannot dequeue from empty queue.');
      return;
    }
    const head = queueItems[0];
    removeFromQueue(head.id);
    addLog(`[O(1) amortized] Dequeued front item: "${head.song.title}".`);
  };

  const handlePeek = () => {
    if (queueItems.length === 0) {
      setPeekedItem(null);
      addLog('Peeked queue: Queue is currently empty.');
      return;
    }
    const head = queueItems[0];
    setPeekedItem(head);
    addLog(`[O(1)] Peeked front item: "${head.song.title}" (without removing).`);
  };

  const handleClear = () => {
    clearQueue();
    setPeekedItem(null);
    addLog('Cleared all queue items.');
  };

  return (
    <div className="space-y-6">
      {/* Overview & Complexity Card */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-amber-400" />
            <span>Playback Queue (FIFO – First In, First Out)</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Maintains the chronological list of user-queued songs. The song at the front of the queue plays next when the active track concludes.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Enqueue: <strong className="text-emerald-400">O(1)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Dequeue: <strong className="text-emerald-400">O(1)</strong>
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
            <label className="text-[11px] font-mono text-slate-400 uppercase">Select Song:</label>
            <select
              value={selectedSongId}
              onChange={(e) => setSelectedSongId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              {allSongs.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.genre})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleEnqueue}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Enqueue (Back)</span>
          </button>

          <button
            onClick={handleEnqueueFront}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Enqueue Front (Play Next)</span>
          </button>

          <button
            onClick={handleDequeue}
            disabled={queueItems.length === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Dequeue (Front)</span>
          </button>

          <button
            onClick={handlePeek}
            disabled={queueItems.length === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Peek Front</span>
          </button>

          <button
            onClick={handleClear}
            disabled={queueItems.length === 0}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-rose-400 rounded font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Queue</span>
          </button>
        </div>

        {peekedItem && (
          <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center justify-between">
            <span>
              Peeked Head Item: "{peekedItem.song.title}" by {peekedItem.song.artist} ({formatDuration(peekedItem.song.duration)})
            </span>
            <button
              onClick={() => playSong(peekedItem.song)}
              className="text-xs font-sans underline text-emerald-200 hover:text-white"
            >
              Play Now
            </button>
          </div>
        )}
      </div>

      {/* Visual Queue Conveyor */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            FRONT (Next to Dequeue) →
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            ← BACK (Tail)
          </span>
        </div>

        <div className="overflow-x-auto py-3">
          <div className="min-w-max flex items-center gap-3">
            {queueItems.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs w-full">
                Queue is empty (head = null, tail = null). Enqueue songs above.
              </div>
            ) : (
              queueItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div
                    className={`w-44 p-3 rounded-lg border flex flex-col justify-between transition-all select-none shadow-md ${
                      index === 0
                        ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/20'
                        : index === queueItems.length - 1
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-slate-900 border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Pos [{index}]</span>
                      {index === 0 && (
                        <span className="bg-emerald-400 text-slate-950 font-bold px-1 rounded text-[9px]">
                          FRONT (PEEK)
                        </span>
                      )}
                      {index === queueItems.length - 1 && index !== 0 && (
                        <span className="bg-amber-400 text-slate-950 font-bold px-1 rounded text-[9px]">
                          BACK
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 my-1">
                      <p className="font-semibold text-xs text-slate-200 truncate">
                        {item.song.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{item.song.artist}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{formatDuration(item.song.duration)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playSong(item.song)}
                          className="p-1 hover:text-amber-400 text-slate-400"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromQueue(item.id)}
                          className="p-1 hover:text-rose-400 text-slate-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {index < queueItems.length - 1 && (
                    <div className="text-slate-600 font-mono text-sm shrink-0">
                      →
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
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
            <div key={idx} className={idx === 0 ? 'text-amber-300 font-medium' : 'text-slate-400'}>
              › {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
