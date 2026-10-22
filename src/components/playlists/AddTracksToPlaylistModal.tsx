import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check, Music2 } from 'lucide-react';
import { Song, Playlist } from '../../types';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

interface AddTracksToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string | null;
}

export const AddTracksToPlaylistModal: React.FC<AddTracksToPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistId,
}) => {
  const { allSongs, playlists, addSongToPlaylist } = useAudioPlayer();
  const [searchQuery, setSearchQuery] = useState('');

  const playlist = playlists.find(p => p.id === playlistId);

  // Filter songs that are not yet in this playlist
  const availableSongs = useMemo(() => {
    if (!playlist) return [];
    let list = allSongs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allSongs, playlist, searchQuery]);

  if (!isOpen || !playlist) return null;

  const handleAddSong = (songId: string) => {
    addSongToPlaylist(playlist.id, songId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-[#0e131b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100 font-sans">
                Add Tracks to "{playlist.title}"
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Currently contains {playlist.songIds.length} tracks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Filter */}
        <div className="p-3 border-b border-slate-800 bg-[#0a0d14]">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter catalog by title, artist, or genre..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Available Songs List */}
        <div className="p-3 overflow-y-auto divide-y divide-slate-800/60 text-xs flex-1">
          {availableSongs.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-mono text-xs">
              No matching tracks found.
            </div>
          ) : (
            availableSongs.map((song) => {
              const isAlreadyIn = playlist.songIds.includes(song.id);
              return (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-slate-900/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded bg-slate-800 overflow-hidden shrink-0">
                      <img
                        src={song.artwork}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-slate-200 truncate">{song.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{song.artist} · {song.genre}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[11px] tabular-nums text-slate-400">
                      {formatDuration(song.duration)}
                    </span>

                    {isAlreadyIn ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Check className="w-3 h-3" /> In Playlist
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddSong(song.id)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0a0d14] flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Changes persist automatically to local storage.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
