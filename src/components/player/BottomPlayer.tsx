import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  ListMusic, 
  History, 
  Maximize2 
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';
import { QueueDrawer } from './QueueDrawer';
import { HistoryDrawer } from './HistoryDrawer';
import { NowPlayingModal } from './NowPlayingModal';

export const BottomPlayer: React.FC = () => {
  const { 
    playbackState, 
    togglePlayPause, 
    nextTrack, 
    prevTrack, 
    seek, 
    setVolume, 
    toggleMute, 
    toggleShuffle, 
    cycleRepeatMode, 
    toggleFavorite, 
    favoriteIds,
    queueItems,
    historyItems,
    setIsNowPlayingOpen 
  } = useAudioPlayer();

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const current = playbackState.currentSong;
  const isFav = current ? favoriteIds.has(current.id) : false;

  return (
    <>
      <div className="h-20 bg-[#0b0f15]/95 backdrop-blur-md border-t border-slate-800/90 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none relative z-30">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[280px]">
          {current ? (
            <>
              <div 
                onClick={() => setIsNowPlayingOpen(true)}
                className="w-12 h-12 rounded bg-slate-900 border border-slate-800 overflow-hidden shrink-0 cursor-pointer group relative shadow-md"
              >
                <img
                  src={current.artwork}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p 
                    onClick={() => setIsNowPlayingOpen(true)}
                    className="text-xs font-semibold text-slate-100 truncate hover:text-amber-400 cursor-pointer font-sans"
                  >
                    {current.title}
                  </p>
                  {playbackState.isPlaying && (
                    <span className="flex items-end gap-0.5 h-2.5 shrink-0" title="Audio streaming active">
                      <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse delay-75" />
                      <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-150" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {current.artist} · <span className="font-mono text-[10px] text-slate-500">{current.genre}</span>
                </p>
              </div>

              <button
                onClick={() => toggleFavorite(current.id)}
                title={isFav ? 'Remove Favorite' : 'Save to Favorites'}
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-400 font-mono">No track selected</div>
          )}
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
          {/* Button Row */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              title={`Shuffle ${playbackState.isShuffle ? 'On' : 'Off'}`}
              className={`p-1.5 rounded transition-colors ${
                playbackState.isShuffle ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={prevTrack}
              title="Previous Track (Ctrl+Left)"
              className="p-1.5 text-slate-300 hover:text-white rounded transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              title="Play/Pause (Space)"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-white text-slate-900 flex items-center justify-center shadow transition-transform active:scale-95"
            >
              {playbackState.isPlaying ? (
                <Pause className="w-4 h-4 fill-slate-900" />
              ) : (
                <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              title="Next Track (Ctrl+Right)"
              className="p-1.5 text-slate-300 hover:text-white rounded transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={cycleRepeatMode}
              title={`Repeat: ${playbackState.repeatMode}`}
              className={`p-1.5 rounded transition-colors ${
                playbackState.repeatMode !== 'off' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {playbackState.repeatMode === 'one' ? (
                <Repeat1 className="w-3.5 h-3.5" />
              ) : (
                <Repeat className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Time Seek Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono tabular-nums text-slate-400 w-10 text-right">
              {formatDuration(playbackState.currentTime)}
            </span>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max={playbackState.duration || 100}
                value={playbackState.currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300"
              />
            </div>
            <span className="text-[11px] font-mono tabular-nums text-slate-400 w-10 text-left">
              {formatDuration(playbackState.duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Auxiliary Panels */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
          {/* History drawer toggle */}
          <button
            onClick={() => {
              setIsHistoryOpen(prev => !prev);
              setIsQueueOpen(false);
            }}
            title="Playback History Stack (LIFO)"
            className={`p-1.5 rounded relative transition-colors ${
              isHistoryOpen ? 'text-sky-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            {historyItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-sky-500/80 text-[9px] font-mono font-bold text-white flex items-center justify-center">
                {historyItems.length > 9 ? '9+' : historyItems.length}
              </span>
            )}
          </button>

          {/* Queue drawer toggle */}
          <button
            onClick={() => {
              setIsQueueOpen(prev => !prev);
              setIsHistoryOpen(false);
            }}
            title="Upcoming Playback Queue (FIFO)"
            className={`p-1.5 rounded relative transition-colors ${
              isQueueOpen ? 'text-amber-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            {queueItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-mono font-bold text-slate-900 flex items-center justify-center">
                {queueItems.length > 9 ? '9+' : queueItems.length}
              </span>
            )}
          </button>

          {/* Volume control */}
          <div className="hidden sm:flex items-center gap-1.5 w-24">
            <button
              onClick={toggleMute}
              className="p-1 text-slate-400 hover:text-slate-200"
              title={playbackState.isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {playbackState.isMuted || playbackState.volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={playbackState.isMuted ? 0 : playbackState.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-slate-300 hover:accent-amber-400"
            />
          </div>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsNowPlayingOpen(true)}
            title="Expand Player"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-900"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawers and Modals */}
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <NowPlayingModal />
    </>
  );
};
