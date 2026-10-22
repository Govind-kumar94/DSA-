import React, { useState } from 'react';
import { Play, Pause, Heart, Plus, ListPlus, ArrowUp, ArrowDown, Trash2, Volume2 } from 'lucide-react';
import { Song } from '../../types';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

interface TrackRowProps {
  song: Song;
  index: number;
  fromPlaylistId?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemoveFromPlaylist?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onOpenAddToPlaylist?: (song: Song) => void;
  isSelected?: boolean;
  onToggleSelect?: (songId: string) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  song,
  index,
  fromPlaylistId,
  onMoveUp,
  onMoveDown,
  onRemoveFromPlaylist,
  canMoveUp,
  canMoveDown,
  onOpenAddToPlaylist,
  isSelected,
  onToggleSelect,
}) => {
  const { playbackState, playSong, togglePlayPause, toggleFavorite, favoriteIds, enqueueSong } = useAudioPlayer();
  const isCurrent = playbackState.currentSong?.id === song.id;
  const isPlaying = isCurrent && playbackState.isPlaying;
  const isFav = favoriteIds.has(song.id);

  const handleRowPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song, fromPlaylistId);
    }
  };

  return (
    <div
      onClick={() => onToggleSelect && onToggleSelect(song.id)}
      className={`group flex items-center justify-between px-3 py-2 rounded-md transition-colors text-xs select-none border border-transparent ${
        isSelected
          ? 'bg-amber-500/10 border-amber-500/30'
          : isCurrent
          ? 'bg-slate-800/80 border-slate-700/60'
          : 'hover:bg-slate-900/60 hover:border-slate-800/80'
      }`}
    >
      {/* Left: Index / Play Icon & Track Meta */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect(song.id);
            }}
            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-amber-500 accent-amber-500 cursor-pointer"
          />
        )}

        <div className="w-6 text-center shrink-0">
          {isPlaying ? (
            <div className="flex items-center justify-center gap-0.5" onClick={handleRowPlay}>
              <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
              <span className="w-1 h-4 bg-amber-400 animate-pulse delay-75 rounded-full" />
              <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
            </div>
          ) : (
            <button
              onClick={handleRowPlay}
              className="text-slate-500 group-hover:text-slate-200 transition-colors"
            >
              <span className="group-hover:hidden font-mono tabular-nums text-[11px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Play className="w-3.5 h-3.5 hidden group-hover:inline-block ml-0.5 fill-current" />
            </button>
          )}
        </div>

        <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
          <img
            src={song.artwork}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <p className={`font-medium truncate ${isCurrent ? 'text-amber-400' : 'text-slate-100 group-hover:text-amber-300'}`}>
            {song.title}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {song.artist}
          </p>
        </div>
      </div>

      {/* Middle: Album & Genre */}
      <div className="hidden md:flex items-center gap-4 w-1/3 min-w-0 text-slate-400 text-[11px]">
        <span className="truncate flex-1 font-sans">{song.album}</span>
        <span className="font-mono text-[10px] text-slate-400 bg-slate-850 px-2 py-0.5 rounded shrink-0">
          {song.genre}
        </span>
      </div>

      {/* Right: Actions & Duration */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {/* Playlist Move Controls (if in playlist detail view) */}
        {onMoveUp && canMoveUp && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            title="Move track up"
            className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        )}
        {onMoveDown && canMoveDown && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            title="Move track down"
            className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
          title={isFav ? 'Remove Favorite' : 'Save Favorite'}
          className={`p-1 transition-colors ${
            isFav ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-400 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Add to Queue */}
        <button
          onClick={(e) => { e.stopPropagation(); enqueueSong(song); }}
          title="Enqueue Track"
          className="p-1 text-slate-500 group-hover:text-slate-300 hover:text-amber-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Add to Playlist button */}
        {onOpenAddToPlaylist && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenAddToPlaylist(song); }}
            title="Add to Playlist"
            className="p-1 text-slate-500 group-hover:text-slate-300 hover:text-sky-400 transition-colors"
          >
            <ListPlus className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Remove from Playlist (if in playlist detail view) */}
        {onRemoveFromPlaylist && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemoveFromPlaylist(); }}
            title="Remove from Playlist"
            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Duration */}
        <span className="font-mono text-[11px] tabular-nums text-slate-400 w-11 text-right">
          {formatDuration(song.duration)}
        </span>
      </div>
    </div>
  );
};
