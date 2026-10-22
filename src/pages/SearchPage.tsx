import React, { useState, useMemo } from 'react';
import { Search, X, Music2, Library, Disc, User, Play, ArrowRight } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { Song, Playlist } from '../types';

interface SearchPageProps {
  onOpenAddToPlaylist: (songs: Song[]) => void;
  onEditPlaylist: (pl: Playlist) => void;
  onDeletePlaylist: (pl: Playlist) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onOpenAddToPlaylist,
  onEditPlaylist,
  onDeletePlaylist,
}) => {
  const { allSongs, playlists, playSong } = useAudioPlayer();
  const [query, setQuery] = useState('');

  const normalized = query.toLowerCase().trim();

  // Search Results Grouped
  const results = useMemo(() => {
    if (!normalized) return { songs: [], playlists: [], artists: [], albums: [] };

    const matchingSongs = allSongs.filter(s => 
      s.title.toLowerCase().includes(normalized) ||
      s.artist.toLowerCase().includes(normalized) ||
      s.album.toLowerCase().includes(normalized) ||
      s.genre.toLowerCase().includes(normalized)
    );

    const matchingPlaylists = playlists.filter(p =>
      p.title.toLowerCase().includes(normalized) ||
      p.description.toLowerCase().includes(normalized)
    );

    // Group matching unique artists
    const artistMap = new Map<string, Song[]>();
    matchingSongs.forEach(s => {
      if (s.artist.toLowerCase().includes(normalized)) {
        if (!artistMap.has(s.artist)) artistMap.set(s.artist, []);
        artistMap.get(s.artist)!.push(s);
      }
    });

    return {
      songs: matchingSongs,
      playlists: matchingPlaylists,
      artists: Array.from(artistMap.entries()),
    };
  }, [allSongs, playlists, normalized]);

  const quickSearches = ['Classical', 'Bach', 'Satie', 'Ambient', 'Transit', 'Electronic', 'Lo-Fi'];

  return (
    <div className="space-y-6 pb-12">
      {/* Search Bar Input */}
      <div className="p-4 rounded-xl bg-[#0e131b] border border-slate-800 space-y-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, artist, album, genre, or playlist..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Quick queries:</span>
          {quickSearches.map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Empty State */}
      {!normalized ? (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <Search className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
          <p className="text-sm font-semibold text-slate-300 font-sans">
            Ready to explore the library
          </p>
          <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
            Type any song name, composer, synthesizer artist, or genre to begin instantaneous searching.
          </p>
        </div>
      ) : results.songs.length === 0 && results.playlists.length === 0 ? (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <p className="text-sm font-semibold text-slate-300 font-sans">
            No matching results for "{query}"
          </p>
          <p className="text-xs font-mono text-slate-400">
            Check the spelling or try searching for genres like Classical, Ambient, or Electronic.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Matching Songs */}
          {results.songs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-amber-400" />
                  <span>Matching Songs ({results.songs.length})</span>
                </h3>
              </div>

              <div className="rounded-lg bg-[#0e131b] border border-slate-800 overflow-hidden divide-y divide-slate-800/40 p-1">
                {results.songs.map((song, idx) => (
                  <TrackRow
                    key={song.id}
                    song={song}
                    index={idx}
                    onOpenAddToPlaylist={(s) => onOpenAddToPlaylist([s])}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matching Playlists */}
          {results.playlists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <Library className="w-4 h-4 text-sky-400" />
                <span>Matching Playlists ({results.playlists.length})</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.playlists.map(pl => (
                  <PlaylistCard
                    key={pl.id}
                    playlist={pl}
                    onEdit={onEditPlaylist}
                    onDelete={onDeletePlaylist}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matching Artists */}
          {results.artists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Matching Artists</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {results.artists.map(([artistName, songs]) => (
                  <div
                    key={artistName}
                    onClick={() => playSong(songs[0])}
                    className="p-3.5 rounded-lg bg-[#0e131b] border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between group transition-colors text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-200 group-hover:text-emerald-300 font-sans">
                        {artistName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        {songs.length} track(s) in catalog
                      </p>
                    </div>
                    <Play className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
