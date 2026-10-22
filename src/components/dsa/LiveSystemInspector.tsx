import React, { useState } from 'react';
import { Activity, Play, SkipForward, SkipBack, Database, ListMusic, Layers, ArrowLeftRight, CheckCircle2, HelpCircle, Code } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

export const LiveSystemInspector: React.FC = () => {
  const {
    currentPlaylistDLL,
    songHashMap,
    queueItems,
    historyItems,
    playbackState,
    allSongs,
    playlists,
    activePlaylistId,
    nextTrack,
    prevTrack,
    playSong,
    togglePlayPause,
  } = useAudioPlayer();

  const [activeVivaTab, setActiveVivaTab] = useState<number>(0);

  const activePlaylist = playlists.find(p => p.id === activePlaylistId);
  const dllSnapshot = currentPlaylistDLL.toArray();

  const vivaQuestions = [
    {
      q: 'Why use a Doubly Linked List instead of a standard dynamic Array for the Playlist playback engine?',
      answer: `1. O(1) Traversal & Navigational Pointers: In a music player, moving to the next or previous track requires referencing 'current.next' or 'current.prev', an O(1) pointer jump without recalculating or indexing array offsets.
2. O(1) Mid-Stream Insertions & Deletions: When a user reorders a track or removes the playing song, Doubly Linked Lists update adjacent 'prev' and 'next' references in O(1) time without having to shift O(n) array elements in memory.
3. Looping & Repeat All: Setting 'tail.next = head' transforms the Doubly Linked List into a Circular Doubly Linked List in O(1) time, allowing seamless seamless infinite looping without boundary checks.`,
    },
    {
      q: 'How does the Song Hash Map achieve O(1) lookup, and how are collisions handled?',
      answer: `1. Polynomial Rolling Hash Function: The song ID string is converted into an integer index:
   h(s) = [sum(s[i] * 31^(n - 1 - i))] mod Capacity
2. Separate Chaining: Each bucket holds a linked list of key-value nodes. If two distinct IDs map to the same bucket index (collision), the new entry is appended to the bucket chain.
3. Dynamic Rehashing: When the load factor (count / capacity) exceeds 0.75, the capacity doubles and all elements are re-distributed, maintaining an average O(1) time complexity.`,
    },
    {
      q: 'What is the precise structural difference between the Playback Queue and the Playback History Stack?',
      answer: `1. Playback Queue (FIFO - First-In, First-Out): Used for scheduled upcoming tracks. Newly queued tracks are enqueued at the back (tail). As tracks finish, the next track is dequeued from the front (head).
2. Playback History Stack (LIFO - Last-In, First-Out): Used for chronological backtracking. Whenever a song plays to completion, it is pushed to the top of the history stack. When the user clicks "Previous Track", the most recently played song is popped from the top.`,
    },
    {
      q: 'Why choose Merge Sort over Quick Sort for deterministic playlist ordering?',
      answer: `1. Stability: Merge Sort is guaranteed to be stable. If two tracks have identical runtimes (e.g., both 3:20), Merge Sort guarantees their original relative order (such as track number or album sequence) is strictly preserved.
2. Guaranteed O(n log n) Worst Case: Quick Sort has an O(n²) worst-case when partition pivots are poorly chosen (e.g., already sorted inputs with basic Lomuto partitioning). Merge Sort guarantees O(n log n) comparisons under all input distributions.`,
    },
    {
      q: 'How does the Graph BFS / DFS recommendation model work?',
      answer: `1. Graph Representation: Songs represent vertices (V); shared genres, artist affinities, and matching tempo BPM ranges form weighted edges (E).
2. Breadth-First Search (BFS): Uses a FIFO Queue to explore level 1 neighbors (nearest musical similarities) before venturing outward. Ideal for "acoustic neighbor discovery".
3. Depth-First Search (DFS): Uses a LIFO Stack to traverse deep stylistic branches before backtracking. Ideal for "long exploratory listening trails". Time complexity is O(V + E).`,
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm font-sans">
              Live Runtime Engine Inspector (Audio Player Synchronization)
            </h3>
          </div>
          <p className="text-slate-400 text-[11px] font-mono">
            This panel monitors the exact memory structures currently driving the active audio player in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            Current Status: <strong className={playbackState.isPlaying ? 'text-emerald-400' : 'text-slate-400'}>
              {playbackState.isPlaying ? 'PLAYING' : 'PAUSED'}
            </strong>
          </span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            Active List: <strong className="text-amber-400">{activePlaylist ? activePlaylist.title : 'Global Catalog'}</strong>
          </span>
        </div>
      </div>

      {/* Grid of 4 Live Running Structures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Live Doubly Linked List */}
        <div className="p-4 rounded-xl bg-[#0e131b] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 text-xs font-sans flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>1. Active Doubly Linked List (Playlist Traversal)</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
              Nodes: {currentPlaylistDLL.size}
            </span>
          </div>

          <div className="bg-[#0a0d14] rounded-lg p-3 font-mono text-[11px] border border-slate-850 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>HEAD POINTER:</span>
              <span className="text-emerald-400">{currentPlaylistDLL.head?.data.title || 'null'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CURRENT PLAYING NODE:</span>
              <span className="text-amber-400 font-bold">{currentPlaylistDLL.current?.data.title || playbackState.currentSong?.title || 'null'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>TAIL POINTER:</span>
              <span className="text-sky-400">{currentPlaylistDLL.tail?.data.title || 'null'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>NEXT (current.next):</span>
              <span className="text-slate-300">{currentPlaylistDLL.current?.next?.data.title || 'null (tail/loop)'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PREV (current.prev):</span>
              <span className="text-slate-300">{currentPlaylistDLL.current?.prev?.data.title || 'null (head)'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={prevTrack}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-mono text-[11px] flex items-center justify-center gap-1"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>prev() O(1)</span>
            </button>
            <button
              onClick={togglePlayPause}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded font-mono text-[11px]"
            >
              {playbackState.isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={nextTrack}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-mono text-[11px] flex items-center justify-center gap-1"
            >
              <span>next() O(1)</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Live Song Hash Map */}
        <div className="p-4 rounded-xl bg-[#0e131b] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 text-xs font-sans flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>2. Active Song Hash Map (ID Key Lookup)</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700">
              Capacity: {songHashMap.getCapacity()}
            </span>
          </div>

          <div className="bg-[#0a0d14] rounded-lg p-3 font-mono text-[11px] border border-slate-850 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>TOTAL ITEMS STORED:</span>
              <span className="text-slate-200 font-bold">{songHashMap.size()} tracks</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>LOAD FACTOR:</span>
              <span className="text-amber-400">{(songHashMap.getLoadFactor() * 100).toFixed(1)}% / 75% max</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>COLLISION RESOLUTION:</span>
              <span className="text-emerald-400">Separate Chaining</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CURRENT SONG ID LOOKUP:</span>
              <span className="text-sky-300">
                {playbackState.currentSong ? `${playbackState.currentSong.id} -> Bucket [${songHashMap.getHashIndex(playbackState.currentSong.id)}]` : 'None'}
              </span>
            </div>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            Hash Formula: <span className="text-amber-300">h(key) = (hash * 31 + charCode) % {songHashMap.getCapacity()}</span>
          </div>
        </div>

        {/* 3. Live Playback Queue (FIFO) */}
        <div className="p-4 rounded-xl bg-[#0e131b] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 text-xs font-sans flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-sky-400" />
              <span>3. Live Playback Queue (FIFO Schedule Buffer)</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
              Size: {queueItems.length}
            </span>
          </div>

          <div className="bg-[#0a0d14] rounded-lg p-3 font-mono text-[11px] border border-slate-850 min-h-[96px] overflow-y-auto space-y-1">
            {queueItems.length === 0 ? (
              <span className="text-slate-500">Queue is empty. Click "+ Enqueue" on any track.</span>
            ) : (
              queueItems.slice(0, 3).map((item, idx) => (
                <div key={item.id} className="flex justify-between text-slate-300">
                  <span>{idx === 0 ? '▶ [FRONT]' : `  [POS ${idx}]`} {item.song.title}</span>
                  <span className="text-slate-500">{formatDuration(item.song.duration)}</span>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] font-mono text-slate-400">
            When active song completes, next track dequeues from Front in O(1) amortized time.
          </p>
        </div>

        {/* 4. Live Playback History Stack (LIFO) */}
        <div className="p-4 rounded-xl bg-[#0e131b] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 text-xs font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>4. Live Playback History Stack (LIFO Backtrack)</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-800 text-rose-300 px-2 py-0.5 rounded border border-slate-700">
              Depth: {historyItems.length}
            </span>
          </div>

          <div className="bg-[#0a0d14] rounded-lg p-3 font-mono text-[11px] border border-slate-850 min-h-[96px] overflow-y-auto space-y-1">
            {historyItems.length === 0 ? (
              <span className="text-slate-500">History stack is empty. Play songs to push onto stack.</span>
            ) : (
              historyItems.slice(0, 3).map((item, idx) => (
                <div key={`${item.song.id}-${idx}`} className="flex justify-between text-slate-300">
                  <span>{idx === 0 ? '▲ [TOP]' : `  [HIST ${idx}]`} {item.song.title}</span>
                  <span className="text-slate-500">{formatDuration(item.song.duration)}</span>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] font-mono text-slate-400">
            Clicking "Previous" pops from Top in O(1) time to backtrack to recently visited tracks.
          </p>
        </div>
      </div>

      {/* College Project Viva Defense Guide */}
      <div className="p-5 rounded-xl bg-[#0e131b] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-sans">
                College Project Viva & Examination Defense Guide
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Model answers for computer science faculty review & project presentation
              </p>
            </div>
          </div>
        </div>

        {/* Viva Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {vivaQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVivaTab(idx)}
              className={`p-2.5 rounded-lg text-left text-xs font-sans transition-colors border ${
                activeVivaTab === idx
                  ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Q{idx + 1}: {q.q.slice(0, 42)}...
            </button>
          ))}
        </div>

        {/* Active Viva Question and Answer */}
        <div className="p-4 rounded-lg bg-[#0a0d14] border border-slate-800 space-y-2">
          <h4 className="font-bold text-slate-200 text-xs font-sans flex items-center gap-2">
            <span className="text-amber-400 font-mono">Q:</span>
            <span>{vivaQuestions[activeVivaTab].q}</span>
          </h4>
          <div className="text-slate-300 text-xs font-sans whitespace-pre-line leading-relaxed pl-4 border-l-2 border-amber-400/40 mt-2">
            {vivaQuestions[activeVivaTab].answer}
          </div>
        </div>
      </div>
    </div>
  );
};
