import React, { useState } from 'react';
import { Play, Shuffle, MoreVertical, Copy, Trash2, Edit3, Music } from 'lucide-react';
import { Playlist } from '../../types';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatTotalDuration } from '../../utils/formatters';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlist: Playlist) => void;
  onDelete?: (playlist: Playlist) => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onEdit, onDelete }) => {
  const { playPlaylist, setSelectedPlaylistId, setActivePage, duplicatePlaylist, songHashMap } = useAudioPlayer();
  const [showMenu, setShowMenu] = useState(false);

  // Calculate total duration using songHashMap
  let totalDurationSec = 0;
  playlist.songIds.forEach(id => {
    const s = songHashMap.get(id).value;
    if (s) totalDurationSec += s.duration;
  });

  const handleCardClick = () => {
    setSelectedPlaylistId(playlist.id);
    setActivePage('playlist-detail');
  };

  const handlePlayAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPlaylist(playlist.id, false);
  };

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPlaylist(playlist.id, true);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative p-3 rounded-lg bg-[#0f141d]/80 hover:bg-[#141b26] border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all duration-200 select-none flex flex-col"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full rounded bg-slate-900 border border-slate-800 overflow-hidden mb-3">
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-850 text-slate-500">
            <Music className="w-10 h-10 stroke-[1.5]" />
          </div>
        )}

        {/* Quick Play Controls Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handlePlayAll}
            title="Play All"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
          >
            <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
          </button>
          <button
            onClick={handleShuffle}
            title="Shuffle Play"
            className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Track count badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/75 rounded text-[10px] font-mono text-slate-300 border border-white/10">
          {playlist.songIds.length} tracks
        </div>
      </div>

      {/* Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-amber-300 truncate font-sans">
            {playlist.title}
          </h4>

          {/* Context menu toggle */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(prev => !prev);
              }}
              className="p-0.5 text-slate-500 hover:text-slate-200 rounded"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-6 w-36 bg-[#161e2a] border border-slate-700 rounded-md shadow-xl py-1 z-20 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(playlist);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300"
                  >
                    <Edit3 className="w-3 h-3 text-sky-400" />
                    <span>Rename/Edit</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    duplicatePlaylist(playlist.id);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300"
                >
                  <Copy className="w-3 h-3 text-amber-400" />
                  <span>Duplicate</span>
                </button>
                {onDelete && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(playlist);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
          {playlist.description || 'Custom playlist'}
        </p>
      </div>

      {/* Footer stats */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>{formatTotalDuration(totalDurationSec)}</span>
        <span className="text-amber-400/80">Details →</span>
      </div>
    </div>
  );
};
