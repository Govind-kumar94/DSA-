import React, { useState } from 'react';
import { ArrowLeftRight, ArrowRight, ArrowLeft, Plus, Trash2, RotateCcw, Play } from 'lucide-react';
import { DoublyLinkedList, DLLNode } from '../../structures/DoublyLinkedList';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song } from '../../types';

export const DoublyLinkedListVisualizer: React.FC = () => {
  const { allSongs, playSong } = useAudioPlayer();

  // Standalone visual DLL seeded with 5 songs
  const [dll] = useState<DoublyLinkedList<Song>>(() => {
    const list = new DoublyLinkedList<Song>();
    allSongs.slice(0, 5).forEach(s => list.append(s, s.id));
    return list;
  });

  const [nodes, setNodes] = useState(() => dll.toArray());
  const [logs, setLogs] = useState<string[]>([
    'Initialized Doubly Linked List with 5 playlist nodes.',
    'Head points to Node 1. Tail points to Node 5.',
  ]);

  const [selectedSongId, setSelectedSongId] = useState(allSongs[5]?.id || allSongs[0]?.id);
  const [insertIndex, setInsertIndex] = useState<number>(0);

  const refreshState = (message: string) => {
    setNodes(dll.toArray());
    setLogs(prev => [message, ...prev.slice(0, 15)]);
  };

  const handleAppend = () => {
    const song = allSongs.find(s => s.id === selectedSongId);
    if (!song) return;
    const node = dll.append(song);
    refreshState(`[O(1)] Appended "${song.title}" to tail. New size: ${dll.size}`);
  };

  const handlePrepend = () => {
    const song = allSongs.find(s => s.id === selectedSongId);
    if (!song) return;
    const node = dll.prepend(song);
    refreshState(`[O(1)] Prepended "${song.title}" to head. New size: ${dll.size}`);
  };

  const handleInsertAt = () => {
    const song = allSongs.find(s => s.id === selectedSongId);
    if (!song) return;
    const idx = Math.max(0, Math.min(dll.size, insertIndex));
    dll.insertAt(idx, song);
    refreshState(`[O(n)] Inserted "${song.title}" at index ${idx}. Linked prev & next pointers.`);
  };

  const handleRemoveAt = (index: number) => {
    const removed = dll.removeAt(index);
    if (removed) {
      refreshState(`[O(n)] Removed "${removed.title}" at index ${index}. Re-linked adjacent pointers.`);
    }
  };

  const handleNext = () => {
    const nextSong = dll.next();
    if (nextSong) {
      refreshState(`[O(1)] Traversed forward (current = current.next) -> "${nextSong.title}"`);
    } else {
      refreshState(`Reached tail boundary (next is null).`);
    }
  };

  const handlePrev = () => {
    const prevSong = dll.prev();
    if (prevSong) {
      refreshState(`[O(1)] Traversed backward (current = current.prev) -> "${prevSong.title}"`);
    } else {
      refreshState(`Reached head boundary (prev is null).`);
    }
  };

  const handleResetHead = () => {
    const headSong = dll.resetToHead();
    refreshState(`[O(1)] Reset pointer to head -> "${headSong?.title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Complexity Card */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-amber-400" />
            <span>Doubly Linked List (Playlist Sequential Traversal)</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Each track node references both its previous and next track. Enables instant O(1) next/previous track changes without array shift costs.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Next/Prev: <strong className="text-emerald-400">O(1)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Insert/Del Ends: <strong className="text-emerald-400">O(1)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Current Nodes: <strong className="text-amber-400">{dll.size}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Controls Toolbar */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase">Track to Insert:</label>
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
            onClick={handlePrepend}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Prepend (Head O(1))</span>
          </button>

          <button
            onClick={handleAppend}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Append (Tail O(1))</span>
          </button>

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              max={dll.size}
              value={insertIndex}
              onChange={(e) => setInsertIndex(parseInt(e.target.value) || 0)}
              className="w-12 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-slate-200 text-xs"
            />
            <button
              onClick={handleInsertAt}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium transition-colors"
            >
              Insert at Index
            </button>
          </div>
        </div>

        {/* Traversal Controls */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Traverse Pointers:</span>
          <button
            onClick={handlePrev}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3 text-sky-400" />
            <span>prev() [O(1)]</span>
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium flex items-center gap-1"
          >
            <span>next() [O(1)]</span>
            <ArrowRight className="w-3 h-3 text-sky-400" />
          </button>
          <button
            onClick={handleResetHead}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Head</span>
          </button>
        </div>
      </div>

      {/* Visual Node Chain */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 overflow-x-auto">
        <div className="min-w-max flex items-center gap-3 py-6 px-2">
          {nodes.length === 0 ? (
            <div className="text-slate-500 font-mono text-xs">Empty list (head = null, tail = null)</div>
          ) : (
            nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`relative w-44 rounded-lg border p-3 flex flex-col justify-between transition-all select-none shadow-md ${
                    node.isCurrent
                      ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-900 border-slate-700/80'
                  }`}
                >
                  {/* Indicators for Head, Tail, Current */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="text-slate-500">[{index}]</span>
                    <div className="flex items-center gap-1">
                      {index === 0 && <span className="text-emerald-400 font-bold">HEAD</span>}
                      {index === nodes.length - 1 && <span className="text-sky-400 font-bold">TAIL</span>}
                      {node.isCurrent && (
                        <span className="bg-amber-400 text-slate-950 font-bold px-1 rounded text-[9px]">
                          CURRENT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Track Meta */}
                  <div className="min-w-0 my-1">
                    <p className={`font-semibold text-xs truncate ${node.isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                      {node.data.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{node.data.artist}</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">{node.data.genre}</p>
                  </div>

                  {/* Pointer status inside node */}
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>prev: {index === 0 ? 'null' : `[${index - 1}]`}</span>
                    <span>next: {index === nodes.length - 1 ? 'null' : `[${index + 1}]`}</span>
                  </div>

                  {/* Actions on this node */}
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <button
                      onClick={() => playSong(node.data)}
                      title="Play Audio"
                      className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveAt(index)}
                      title="Remove Node"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Double Arrow between nodes */}
                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center text-slate-500 shrink-0 font-mono text-[10px] px-1">
                    <span className="text-sky-400">→ next</span>
                    <span className="text-slate-600">⇄</span>
                    <span className="text-amber-400">prev ←</span>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Operation Log */}
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
