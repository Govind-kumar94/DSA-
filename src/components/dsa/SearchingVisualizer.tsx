import React, { useState } from 'react';
import { Search, Compass, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { runLinearSearch, runBinarySearch, SearchResult } from '../../algorithms/searching';
import { Song } from '../../types';

export const SearchingVisualizer: React.FC = () => {
  const { allSongs, playSong } = useAudioPlayer();

  const [searchTarget, setSearchTarget] = useState<string>('Gymnopédie');
  const [selectedAlgo, setSelectedAlgo] = useState<'Binary Search' | 'Linear Search'>('Binary Search');

  const [linearResult, setLinearResult] = useState<SearchResult>(() => runLinearSearch(allSongs, 'Gymnopédie'));
  const [binaryResult, setBinaryResult] = useState<SearchResult>(() => runBinarySearch(allSongs, 'Gymnopédie'));

  const handleSearch = (query: string) => {
    setSearchTarget(query);
    setLinearResult(runLinearSearch(allSongs, query));
    setBinaryResult(runBinarySearch(allSongs, query));
  };

  const activeResult = selectedAlgo === 'Binary Search' ? binaryResult : linearResult;

  return (
    <div className="space-y-6">
      {/* Overview & Complexity Comparison */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-400" />
            <span>Searching Algorithms: Binary Search vs Linear Search</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Linear search probes every element sequentially ($O(n)$). Binary search repeatedly divides the search space in half ($O(\log n)$) on sorted data.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Binary Search: <strong className="text-emerald-400">O(log n)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Linear Search: <strong className="text-rose-400">O(n)</strong>
          </span>
        </div>
      </div>

      {/* Head-to-Head Benchmark Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Binary Card */}
        <div className={`p-4 rounded-lg border text-xs transition-all ${
          selectedAlgo === 'Binary Search' ? 'bg-sky-500/10 border-sky-400' : 'bg-[#0e131b] border-slate-800'
        }`}>
          <div className="flex items-center justify-between font-mono mb-2">
            <span className="text-sky-400 font-bold">BINARY SEARCH (Logarithmic)</span>
            <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px]">
              {binaryResult.comparisons} comparisons ({binaryResult.timeMs}ms)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {binaryResult.foundSong
              ? `Found "${binaryResult.foundSong.title}" in ${binaryResult.steps.length} step(s).`
              : 'Target not found in catalog.'}
          </p>
        </div>

        {/* Linear Card */}
        <div className={`p-4 rounded-lg border text-xs transition-all ${
          selectedAlgo === 'Linear Search' ? 'bg-amber-500/10 border-amber-400' : 'bg-[#0e131b] border-slate-800'
        }`}>
          <div className="flex items-center justify-between font-mono mb-2">
            <span className="text-amber-400 font-bold">LINEAR SEARCH (Sequential)</span>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px]">
              {linearResult.comparisons} comparisons ({linearResult.timeMs}ms)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {linearResult.foundSong
              ? `Found "${linearResult.foundSong.title}" after inspecting ${linearResult.comparisons} tracks.`
              : `Scanned all ${linearResult.comparisons} items without match.`}
          </p>
        </div>
      </div>

      {/* Search Input Bar & Algorithm Chooser */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            value={searchTarget}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type song title to search..."
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">VISUALIZE:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded border border-slate-800">
            <button
              onClick={() => setSelectedAlgo('Binary Search')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                selectedAlgo === 'Binary Search' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Binary Search
            </button>
            <button
              onClick={() => setSelectedAlgo('Linear Search')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                selectedAlgo === 'Linear Search' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linear Search
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between font-mono text-slate-400">
          <span>{selectedAlgo} Steps Trace</span>
          <span className="text-sky-300">Total Steps: {activeResult.steps.length}</span>
        </div>

        <div className="space-y-2">
          {activeResult.steps.map((step) => (
            <div
              key={step.stepIndex}
              className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                step.isMatch
                  ? 'bg-emerald-500/10 border-emerald-500/60'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-500 w-12">
                  Step {step.stepIndex}
                </span>

                {selectedAlgo === 'Binary Search' && step.lowIndex !== undefined && (
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 shrink-0">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">low: {step.lowIndex}</span>
                    <span className="bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.5 rounded">
                      mid: {step.midIndex}
                    </span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded">high: {step.highIndex}</span>
                  </div>
                )}

                <p className="font-medium text-slate-200">{step.explanation}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {step.isMatch ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MATCH FOUND
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">Probe</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
