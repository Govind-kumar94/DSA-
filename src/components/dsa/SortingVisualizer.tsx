import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpDown, Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { runMergeSort, runQuickSort, SortField, SortResult } from '../../algorithms/sorting';
import { Song } from '../../types';

export const SortingVisualizer: React.FC = () => {
  const { allSongs } = useAudioPlayer();

  const [selectedAlgo, setSelectedAlgo] = useState<'Merge Sort' | 'Quick Sort'>('Merge Sort');
  const [selectedField, setSelectedField] = useState<SortField>('title');
  const [sampleSize, setSampleSize] = useState<number>(8);

  // Take sample songs
  const songsSlice = allSongs.slice(0, sampleSize);

  const [result, setResult] = useState<SortResult>(() => {
    return runMergeSort(songsSlice, 'title');
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  const runAlgorithm = (algo: 'Merge Sort' | 'Quick Sort', field: SortField, count: number) => {
    setIsPlaying(false);
    if (playTimerRef.current) clearInterval(playTimerRef.current);

    const slice = allSongs.slice(0, count);
    const res = algo === 'Merge Sort' ? runMergeSort(slice, field) : runQuickSort(slice, field);
    setResult(res);
    setCurrentStepIndex(0);
  };

  const handleAlgoChange = (algo: 'Merge Sort' | 'Quick Sort') => {
    setSelectedAlgo(algo);
    runAlgorithm(algo, selectedField, sampleSize);
  };

  const handleFieldChange = (field: SortField) => {
    setSelectedField(field);
    runAlgorithm(selectedAlgo, field, sampleSize);
  };

  const handleSizeChange = (count: number) => {
    setSampleSize(count);
    runAlgorithm(selectedAlgo, selectedField, count);
  };

  const currentStep = result.steps[currentStepIndex] || result.steps[0];

  // Auto-play stepper
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= result.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, result.steps.length]);

  return (
    <div className="space-y-6">
      {/* Overview & Complexity Card */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-amber-400" />
            <span>Sorting Algorithms: {selectedAlgo} vs Quick Sort</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Compare Divide-and-Conquer Merge Sort ($O(n \log n)$ stable) with Partition-based Quick Sort ($O(n \log n)$ average).
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Time: <strong className="text-emerald-400">O(n log n)</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Comparisons: <strong className="text-amber-400">{result.comparisons}</strong>
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
            Runtime: <strong className="text-sky-400">{result.timeMs}ms</strong>
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Algorithm Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded border border-slate-800">
            <button
              onClick={() => handleAlgoChange('Merge Sort')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                selectedAlgo === 'Merge Sort'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Merge Sort
            </button>
            <button
              onClick={() => handleAlgoChange('Quick Sort')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                selectedAlgo === 'Quick Sort'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quick Sort
            </button>
          </div>

          {/* Sort Key Field */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-mono text-slate-400">KEY:</label>
            <select
              value={selectedField}
              onChange={(e) => handleFieldChange(e.target.value as SortField)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value="title">Title (Alphabetical)</option>
              <option value="duration">Duration (Seconds)</option>
              <option value="artist">Artist</option>
              <option value="year">Release Year</option>
            </select>
          </div>

          {/* Array Size */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-mono text-slate-400">TRACKS:</label>
            <select
              value={sampleSize}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value={6}>6 Tracks</option>
              <option value={8}>8 Tracks</option>
              <option value={12}>12 Tracks</option>
              <option value={16}>16 Tracks</option>
            </select>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded font-medium flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto-Step'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(result.steps.length - 1, prev + 1))}
            disabled={currentStepIndex >= result.steps.length - 1}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold rounded flex items-center gap-1"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Array Elements Visual Bar / Cards */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Step {currentStepIndex + 1} of {result.steps.length} · Comparisons: {currentStep?.comparisonsCount || 0}
          </span>
          <span className="text-amber-300 font-sans">{currentStep?.description}</span>
        </div>

        {/* Grid of tracks at this step */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 py-4">
          {currentStep?.arraySnapshot.map((item, idx) => {
            const isComparing = currentStep.highlightIndices.includes(idx);
            const isPivot = currentStep.pivotIndex === idx;

            return (
              <div
                key={`${item.id}-${idx}`}
                className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all duration-200 select-none text-xs min-h-[90px] shadow-sm ${
                  isPivot
                    ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/30'
                    : isComparing
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>[{idx}]</span>
                  {isPivot && (
                    <span className="bg-rose-500 text-white font-bold px-1 rounded text-[8px]">
                      PIVOT
                    </span>
                  )}
                  {isComparing && !isPivot && (
                    <span className="bg-amber-400 text-slate-950 font-bold px-1 rounded text-[8px]">
                      COMPARING
                    </span>
                  )}
                </div>

                <div className="my-1">
                  <p className="font-semibold truncate text-slate-200">{item.title}</p>
                </div>

                <div className="pt-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-400 tabular-nums">
                  {selectedField === 'duration' ? `${item.value}s` : item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Trace Log */}
      <div className="p-3 rounded-lg bg-[#0a0d14] border border-slate-800">
        <div className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-semibold">
          Step Operation Log
        </div>
        <div className="space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
          {result.steps.slice(0, currentStepIndex + 1).reverse().map((step) => (
            <div
              key={step.stepIndex}
              className={step.stepIndex === currentStepIndex ? 'text-amber-300 font-medium' : 'text-slate-400'}
            >
              [{step.stepIndex}] {step.description} (total comparisons: {step.comparisonsCount})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
