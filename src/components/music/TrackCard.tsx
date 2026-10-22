import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { Song } from '../../types';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

interface TrackCardProps {
  song: Song;
  onOpenAddToPlaylist?: (song: Song) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ song, onOpenAddToPlaylist }) => {
  const { playbackState, playSong, togglePlayPause, toggleFavorite, favoriteIds, enqueueSong } = useAudioPlayer();
  const isCurrent = playbackState.currentSong?.id === song.id;
  const isPlaying = isCurrent && playbackState.isPlaying;
  const isFav = favoriteIds.has(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  return (
    <div 
      onClick={() => playSong(song)}
      className="group relative p-3 rounded-lg bg-[#0f141d]/80 hover:bg-[#141b26] border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all duration-200 select-none flex flex-col"
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded bg-slate-900 border border-slate-800 overflow-hidden mb-2.5">
        <img
          src={song.artwork}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />

        {/* Quick Play Button overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-900" />
            ) : (
              <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
            )}
          </button>
        </div>

        {/* Duration tag */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/75 rounded text-[10px] font-mono tabular-nums text-slate-300">
          {formatDuration(song.duration)}
        </div>
      </div>

      {/* Track Meta */}
      <div className="min-w-0 flex-1">
        <h4 className={`text-xs font-semibold truncate font-sans ${isCurrent ? 'text-amber-400' : 'text-slate-100 group-hover:text-amber-300'}`}>
          {song.title}
        </h4>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {song.artist}
        </p>
      </div>

      {/* Quiet footer meta */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="text-slate-400">{song.genre}</span>
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
            className={`p-1 hover:text-rose-400 ${isFav ? 'text-rose-400' : 'text-slate-500'}`}
          >
            <Heart className={`w-3 h-3 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); enqueueSong(song); }}
            title="Enqueue"
            className="p-1 hover:text-amber-400 text-slate-500"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
