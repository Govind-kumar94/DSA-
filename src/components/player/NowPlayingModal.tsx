import React from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, Plus, Sparkles } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

export const NowPlayingModal: React.FC = () => {
  const { 
    isNowPlayingOpen, 
    setIsNowPlayingOpen, 
    playbackState, 
    playSong,
    togglePlayPause, 
    nextTrack, 
    prevTrack, 
    seek, 
    setVolume, 
    toggleShuffle, 
    cycleRepeatMode, 
    toggleFavorite,
    enqueueSong,
    songGraph,
    favoriteIds
  } = useAudioPlayer();

  if (!isNowPlayingOpen || !playbackState.currentSong) return null;

  const current = playbackState.currentSong;
  const isFav = favoriteIds.has(current.id);
  const progressPercent = playbackState.duration > 0 ? (playbackState.currentTime / playbackState.duration) * 100 : 0;

  // Find graph neighbors for this track
  const neighbors = songGraph.getNeighbors(current.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none">
      <div 
        className="w-full max-w-2xl bg-[#0e131b] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">Now Playing Focus</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">{current.genre}</span>
          </div>
          <button
            onClick={() => setIsNowPlayingOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Artwork and Track Bio */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg bg-slate-900 border border-slate-800 shadow-xl overflow-hidden shrink-0 relative group">
              <img
                src={current.artwork}
                alt={current.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              {/* Subtle Audio Visualizer overlay when playing */}
              {playbackState.isPlaying && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center gap-1.5 h-16">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 70, 60, 85].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-amber-400 rounded-full transition-all duration-300"
                      style={{
                        height: `${Math.max(15, (h * (0.4 + (idx % 3) * 0.3)))}%`,
                        animation: `pulse ${0.6 + (idx * 0.1)}s infinite alternate ease-in-out`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  {current.genre}
                </span>
                {current.bpm && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    {current.bpm} BPM
                  </span>
                )}
                {current.year && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {current.year}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans tracking-tight">
                {current.title}
              </h1>
              <p className="text-sm font-medium text-slate-300">{current.artist}</p>
              <p className="text-xs text-slate-400 font-mono">Album: {current.album}</p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => toggleFavorite(current.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                    isFav
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                  <span>{isFav ? 'Favorited' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={() => enqueueSong(current)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enqueue</span>
                </button>
              </div>
            </div>
          </div>

          {/* Seek Bar & Timestamps */}
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={playbackState.duration || 100}
                value={playbackState.currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400">
              <span>{formatDuration(playbackState.currentTime)}</span>
              <span>{formatDuration(playbackState.duration)}</span>
            </div>
          </div>

          {/* Full Player Controls */}
          <div className="flex items-center justify-center gap-6 py-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                playbackState.isShuffle ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Previous"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full bg-slate-100 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              title={playbackState.isPlaying ? 'Pause' : 'Play'}
            >
              {playbackState.isPlaying ? (
                <Pause className="w-6 h-6 fill-slate-900" />
              ) : (
                <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Next"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={cycleRepeatMode}
              className={`p-2 rounded-full transition-colors ${
                playbackState.repeatMode !== 'off' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`Repeat: ${playbackState.repeatMode}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Connected Graph Nodes / Recommended Musical Neighbors */}
          {neighbors.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-200 font-sans">
                  Graph Affinity Recommendations
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  (Based on genre & tempo edges)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {neighbors.slice(0, 4).map(edge => {
                  const targetSong = songGraph.getSong(edge.targetId);
                  if (!targetSong) return null;
                  return (
                    <div
                      key={edge.targetId}
                      onClick={() => playSong(targetSong)}
                      className="p-2 rounded bg-slate-900/60 hover:bg-slate-850 border border-slate-800 cursor-pointer flex items-center justify-between group transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded bg-slate-800 overflow-hidden shrink-0">
                          <img src={targetSong.artwork} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-200 truncate group-hover:text-amber-400">
                            {targetSong.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{edge.reason}</p>
                        </div>
                      </div>
                      <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 shrink-0 ml-1" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
