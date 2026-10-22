import React, { useState } from 'react';
import { Network, GitBranch, Play, RotateCcw, SkipForward, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { SongGraph, GraphTraversalStep } from '../../structures/songGraph';
import { Song } from '../../types';

export const GraphVisualizer: React.FC = () => {
  const { allSongs, songGraph, playSong, enqueueSong } = useAudioPlayer();

  const [traversalType, setTraversalType] = useState<'BFS' | 'DFS'>('BFS');
  const [startSongId, setStartSongId] = useState<string>(allSongs[0]?.id || '');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Compute traversal result
  const traversalResult = React.useMemo(() => {
    return traversalType === 'BFS' ? songGraph.bfs(startSongId) : songGraph.dfs(startSongId);
  }, [songGraph, traversalType, startSongId]);

  const currentStep: GraphTraversalStep | undefined = traversalResult.steps[currentStepIndex] || traversalResult.steps[0];
  const allNodes = songGraph.getAllNodes().slice(0, 14); // Display manageable subset in visualizer
  const allEdges = songGraph.getAllEdges();

  const handleNextStep = () => {
    setCurrentStepIndex(prev => Math.min(traversalResult.steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const handlePlayDiscoveryPath = () => {
    if (traversalResult.order.length > 0) {
      playSong(traversalResult.order[0]);
      // Enqueue remaining discovered songs
      traversalResult.order.slice(1).forEach(song => enqueueSong(song));
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview & Complexity Card */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <span>Song Relationship Graph: BFS vs DFS Recommendation Engine</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Models musical connections using shared genre, tempo, and artist affinity. BFS traverses immediate musical neighbors first (Queue). DFS explores deep branch journeys (Stack).
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Graph Complexity: <strong className="text-emerald-400">O(V + E)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Total Vertices (V): <strong className="text-amber-400">{allNodes.length}</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Total Edges (E): <strong className="text-sky-400">{allEdges.length}</strong>
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* BFS vs DFS toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded border border-slate-800">
            <button
              onClick={() => { setTraversalType('BFS'); setCurrentStepIndex(0); }}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                traversalType === 'BFS' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BFS (Queue - Nearest Neighbors)
            </button>
            <button
              onClick={() => { setTraversalType('DFS'); setCurrentStepIndex(0); }}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                traversalType === 'DFS' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DFS (Stack - Deep Exploration)
            </button>
          </div>

          {/* Root Track Node selector */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-mono text-slate-400">ROOT NODE:</label>
            <select
              value={startSongId}
              onChange={(e) => { setStartSongId(e.target.value); setCurrentStepIndex(0); }}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              {allSongs.slice(0, 12).map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.genre})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            title="Reset Traversal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex >= traversalResult.steps.length - 1}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold rounded flex items-center gap-1"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePlayDiscoveryPath}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Traversal Path ({traversalResult.order.length})</span>
          </button>
        </div>
      </div>

      {/* Traversal State: Frontier (Queue/Stack) & Visited Set */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Frontier */}
        <div className="p-3 rounded-lg bg-[#0e131b] border border-slate-800 space-y-1.5">
          <span className="text-[11px] text-amber-400 uppercase font-semibold">
            {traversalType === 'BFS' ? 'Frontier Queue (FIFO)' : 'Frontier Stack (LIFO)'}:
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentStep?.frontier.length === 0 ? (
              <span className="text-slate-600 text-[11px]">Empty (traversal complete)</span>
            ) : (
              currentStep?.frontier.map((id, idx) => {
                const song = songGraph.getSong(id);
                return (
                  <span
                    key={`${id}-${idx}`}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px]"
                  >
                    {song?.title || id}
                  </span>
                );
              })
            )}
          </div>
        </div>

        {/* Visited Set */}
        <div className="p-3 rounded-lg bg-[#0e131b] border border-slate-800 space-y-1.5">
          <span className="text-[11px] text-emerald-400 uppercase font-semibold">
            Visited Set ({currentStep?.visited.length || 0}):
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentStep?.visited.map((id) => {
              const song = songGraph.getSong(id);
              return (
                <span
                  key={id}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]"
                >
                  ✓ {song?.title || id}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Network Map Visualization */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Active Song Nodes Network</span>
          <span className="text-emerald-300">{currentStep?.action}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 py-2">
          {allNodes.map((song) => {
            const isCurrent = currentStep?.currentNodeId === song.id;
            const isVisited = currentStep?.visited.includes(song.id);
            const inFrontier = currentStep?.frontier.includes(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50'
                    : isVisited
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : inFrontier
                    ? 'bg-sky-500/15 border-sky-400/60'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{song.genre}</span>
                  {isCurrent && <span className="text-amber-400 font-bold">CURRENT</span>}
                  {isVisited && !isCurrent && <span className="text-emerald-400">VISITED</span>}
                  {inFrontier && !isCurrent && <span className="text-sky-400">QUEUED</span>}
                </div>

                <div className="my-1">
                  <p className="font-semibold text-xs text-slate-200 truncate">{song.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{song.artist}</p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>{songGraph.getNeighbors(song.id).length} edges</span>
                  <Play className="w-3 h-3 hover:text-amber-400 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
