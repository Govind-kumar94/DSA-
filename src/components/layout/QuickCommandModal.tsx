import React, { useState, useEffect, useRef } from 'react';
import { Search, Music2, Library, Cpu, X, Play, ArrowRight } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song, Playlist } from '../../types';

export const QuickCommandModal: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    allSongs, 
    playlists, 
    playSong, 
    playPlaylist, 
    setActivePage, 
    setSelectedPlaylistId 
  } = useAudioPlayer();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const normalized = query.toLowerCase().trim();

  const matchingSongs = normalized
    ? allSongs.filter(s => 
        s.title.toLowerCase().includes(normalized) || 
        s.artist.toLowerCase().includes(normalized) ||
        s.genre.toLowerCase().includes(normalized)
      ).slice(0, 5)
    : allSongs.slice(0, 4);

  const matchingPlaylists = normalized
    ? playlists.filter(p => p.title.toLowerCase().includes(normalized)).slice(0, 3)
    : playlists.slice(0, 3);

  const handleSelectSong = (song: Song) => {
    playSong(song);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectPlaylist = (pl: Playlist) => {
    setSelectedPlaylistId(pl.id);
    setActivePage('playlist-detail');
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div 
        className="w-full max-w-xl bg-[#0f141d] border border-slate-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a song title, artist, playlist, or algorithm..."
            className="w-full bg-transparent px-3 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Section */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Songs */}
          {matchingSongs.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Music2 className="w-3 h-3 text-amber-400" />
                <span>Songs</span>
              </div>
              <div className="space-y-0.5">
                {matchingSongs.map(song => (
                  <div
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-800/80 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={song.artwork} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate group-hover:text-amber-400">{song.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">{song.genre}</span>
                      <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists */}
          {matchingPlaylists.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Library className="w-3 h-3 text-sky-400" />
                <span>Playlists</span>
              </div>
              <div className="space-y-0.5">
                {matchingPlaylists.map(pl => (
                  <div
                    key={pl.id}
                    onClick={() => handleSelectPlaylist(pl)}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-800/80 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                        <img src={pl.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate group-hover:text-sky-400">{pl.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{pl.songIds.length} tracks</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>TuneFlow Command Engine</span>
        </div>
      </div>
    </div>
  );
};
