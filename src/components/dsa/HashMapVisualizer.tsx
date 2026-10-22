import React, { useState } from 'react';
import { Database, Search, Plus, Trash2, RefreshCw } from 'lucide-react';
import { SongHashMap } from '../../structures/SongHashMap';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song } from '../../types';

export const HashMapVisualizer: React.FC = () => {
  const { allSongs } = useAudioPlayer();

  // Create local map for interactive sandbox
  const [map] = useState<SongHashMap<Song>>(() => {
    const m = new SongHashMap<Song>(8);
    // Seed with 6 tracks to show realistic bucket distribution
    allSongs.slice(0, 6).forEach(s => m.put(s.id, s));
    return m;
  });

  const [snapshot, setSnapshot] = useState(() => map.getVisualizationSnapshot());
  const [capacity, setCapacity] = useState(() => map.getCapacity());
  const [loadFactor, setLoadFactor] = useState(() => map.getLoadFactor());
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null);

  const [logs, setLogs] = useState<string[]>([
    'Initialized SongHashMap with initial capacity 8 and separate chaining.',
    'Seeded 6 songs into hash buckets.',
  ]);

  const [newKey, setNewKey] = useState('track-99');
  const [newTitle, setNewTitle] = useState('Transit Echoes');
  const [newArtist, setNewArtist] = useState('Modular Rail');

  const refresh = (msg: string) => {
    setSnapshot(map.getVisualizationSnapshot());
    setCapacity(map.getCapacity());
    setLoadFactor(map.getLoadFactor());
    setLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  const handleSearch = () => {
    if (!searchKey.trim()) return;
    const res = map.get(searchKey.trim());
    setHighlightBucket(res.bucketIndex);

    if (res.value) {
      setSearchResult(`Found in Bucket [${res.bucketIndex}] after ${res.steps} step(s): "${res.value.title}" by ${res.value.artist}`);
      refresh(`[O(1) Avg] GET("${searchKey}") -> Bucket [${res.bucketIndex}], ${res.steps} node step(s). Value found.`);
    } else {
      setSearchResult(`Key "${searchKey}" not found in Bucket [${res.bucketIndex}].`);
      refresh(`[O(1) Avg] GET("${searchKey}") -> Bucket [${res.bucketIndex}], searched ${res.steps} node(s). Miss.`);
    }
  };

  const handleInsert = () => {
    if (!newKey.trim()) return;
    const mockSong: Song = {
      id: newKey.trim(),
      title: newTitle.trim() || 'Custom Track',
      artist: newArtist.trim() || 'Unknown Artist',
      album: 'Custom Session',
      genre: 'Experimental',
      duration: 180,
      artwork: '/src/assets/images/cover_transit_focus_1792695542804.jpg',
      audioUrl: 'synth://ambient-custom',
    };

    const res = map.put(mockSong.id, mockSong);
    setHighlightBucket(res.bucketIndex);

    const desc = res.collided
      ? `[Collision] Hash collision at Bucket [${res.bucketIndex}]. Chained entry onto linked list.`
      : `[O(1)] Inserted "${mockSong.id}" into empty Bucket [${res.bucketIndex}].`;

    refresh(res.rehashed ? `${desc} [Rehash Triggered! Capacity doubled to ${map.getCapacity()}]` : desc);
  };

  const handleDelete = (key: string) => {
    const res = map.remove(key);
    setHighlightBucket(res.bucketIndex);
    if (res.success) {
      refresh(`[O(1) Avg] REMOVE("${key}") from Bucket [${res.bucketIndex}]. Unlinked from chain.`);
    } else {
      refresh(`Key "${key}" not found for removal.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description & Complexity Card */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Song Hash Map with Separate Chaining</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Uses polynomial rolling hash function <code className="text-amber-400 font-mono">hash(key) % capacity</code> to map song IDs directly to memory buckets. Resolves collisions using linked list chaining.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Average Lookup: <strong className="text-emerald-400">O(1)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Worst Case: <strong className="text-rose-400">O(n)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Load Factor: <strong className={loadFactor > 0.75 ? 'text-rose-400' : 'text-amber-400'}>{(loadFactor * 100).toFixed(0)}%</strong>
          </span>
        </div>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Panel */}
        <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3 text-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
            Key Lookup (Search)
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="e.g. track-01, track-04..."
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-emerald-400 font-mono"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup O(1)</span>
            </button>
          </div>
          {searchResult && (
            <p className="text-[11px] font-mono text-amber-300 bg-slate-900 p-2 rounded border border-slate-800">
              {searchResult}
            </p>
          )}
        </div>

        {/* Insert Panel */}
        <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3 text-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
            Insert / Put Entry
          </span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Key (ID)"
              className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs font-mono"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Track Title"
              className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs"
            />
            <input
              type="text"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              placeholder="Artist"
              className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs"
            />
          </div>
          <button
            onClick={handleInsert}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Put into Map</span>
          </button>
        </div>
      </div>

      {/* Buckets Array & Chains */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Bucket Array (Capacity: {capacity})</span>
          <span className="text-[11px]">Separate Chaining for Collisions</span>
        </div>

        <div className="space-y-2">
          {snapshot.map((bucket) => {
            const isHighlighted = highlightBucket === bucket.index;
            return (
              <div
                key={bucket.index}
                className={`p-2.5 rounded border flex items-center gap-3 transition-colors text-xs ${
                  isHighlighted
                    ? 'bg-amber-500/10 border-amber-400/80 ring-1 ring-amber-400/20'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                {/* Bucket Index Indicator */}
                <div className="w-14 shrink-0 font-mono text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <span>[{bucket.index}]</span>
                  <span className="text-slate-600">→</span>
                </div>

                {/* Chained Linked Entries */}
                <div className="flex-1 flex flex-wrap items-center gap-2">
                  {bucket.entries.length === 0 ? (
                    <span className="text-slate-600 font-mono text-[11px]">null (empty)</span>
                  ) : (
                    bucket.entries.map((entry, idx) => (
                      <React.Fragment key={entry.key}>
                        <div className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 flex items-center gap-2 group">
                          <div>
                            <span className="text-amber-400 font-mono text-[10px] font-bold">
                              {entry.key}:
                            </span>{' '}
                            <span className="text-slate-200 text-xs font-medium">
                              {entry.value.title}
                            </span>
                            <span className="text-slate-400 text-[10px] ml-1">
                              ({entry.value.artist})
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(entry.key)}
                            title="Delete entry"
                            className="text-slate-500 hover:text-rose-400 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {idx < bucket.entries.length - 1 && (
                          <span className="text-amber-400 font-mono text-xs font-bold">
                            ⇄ link
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trace Log */}
      <div className="p-3 rounded-lg bg-[#0a0d14] border border-slate-800">
        <div className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-semibold">
          Execution Trace Log
        </div>
        <div className="space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className={idx === 0 ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
              › {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
