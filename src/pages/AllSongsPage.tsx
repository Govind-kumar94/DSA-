import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Plus, CheckSquare, Square, Upload, ListMusic } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { TrackRow } from '../components/music/TrackRow';
import { TrackRowSkeleton } from '../components/ui/Skeleton';
import { Song } from '../types';

interface AllSongsPageProps {
  onOpenAddToPlaylist: (songs: Song[]) => void;
  onOpenImportModal: () => void;
}

export const AllSongsPage: React.FC<AllSongsPageProps> = ({
  onOpenAddToPlaylist,
  onOpenImportModal,
}) => {
  const { allSongs, favoriteIds, enqueueSong } = useAudioPlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortField, setSortField] = useState<'title' | 'artist' | 'album' | 'duration' | 'year'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
  const [isFiltering, setIsFiltering] = useState(false);

  const handleGenreChange = (genre: string) => {
    setIsFiltering(true);
    setSelectedGenre(genre);
    setTimeout(() => setIsFiltering(false), 120);
  };

  // Extract unique genres
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    allSongs.forEach(s => set.add(s.genre));
    return Array.from(set);
  }, [allSongs]);

  // Filter and sort songs
  const filteredSongs = useMemo(() => {
    let result = [...allSongs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== 'all') {
      result = result.filter(s => s.genre === selectedGenre);
    }

    if (onlyFavorites) {
      result = result.filter(s => favoriteIds.has(s.id));
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'duration') cmp = a.duration - b.duration;
      else if (sortField === 'year') cmp = (a.year || 0) - (b.year || 0);
      else if (sortField === 'artist') cmp = a.artist.localeCompare(b.artist);
      else if (sortField === 'album') cmp = a.album.localeCompare(b.album);
      else cmp = a.title.localeCompare(b.title);

      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allSongs, searchQuery, selectedGenre, onlyFavorites, sortField, sortDirection, favoriteIds]);

  const toggleSelectSong = (id: string) => {
    setSelectedSongIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedSongIds.size === filteredSongs.length) {
      setSelectedSongIds(new Set());
    } else {
      setSelectedSongIds(new Set(filteredSongs.map(s => s.id)));
    }
  };

  const selectedSongsList = useMemo(() => {
    return allSongs.filter(s => selectedSongIds.has(s.id));
  }, [allSongs, selectedSongIds]);

  const handleBulkQueue = () => {
    selectedSongsList.forEach(s => enqueueSong(s));
    setSelectedSongIds(new Set());
  };

  const handleBulkAddToPlaylist = () => {
    onOpenAddToPlaylist(selectedSongsList);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and Import Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans tracking-tight">
            All Songs Catalog
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {filteredSongs.length} of {allSongs.length} tracks available in hash table
          </p>
        </div>

        <button
          onClick={onOpenImportModal}
          className="px-3.5 py-2 bg-slate-100 hover:bg-white text-slate-900 rounded font-semibold text-xs flex items-center gap-2 self-start transition-colors shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Local Audio</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-lg bg-[#0e131b] border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search input */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-slate-900 border border-slate-700/80 rounded px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, artist, or album..."
              className="w-full bg-transparent text-slate-100 text-xs focus:outline-none placeholder-slate-500"
            />
          </div>

          {/* Genre tabs / selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Genres</option>
              {availableGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Favorite filter toggle */}
            <button
              onClick={() => setOnlyFavorites(prev => !prev)}
              className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
                onlyFavorites
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Favorites Only
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="title">Sort: Title</option>
              <option value="artist">Sort: Artist</option>
              <option value="album">Sort: Album</option>
              <option value="duration">Sort: Duration</option>
              <option value="year">Sort: Year</option>
            </select>

            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-300 hover:text-white font-mono text-xs"
              title="Toggle sort direction"
            >
              {sortDirection === 'asc' ? 'ASC ↑' : 'DESC ↓'}
            </button>
          </div>
        </div>

        {/* Multi-Selection Bulk Toolbar */}
        {selectedSongIds.size > 0 && (
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-2 rounded">
            <div className="flex items-center gap-2 font-mono text-amber-300">
              <span className="font-semibold">{selectedSongIds.size}</span>
              <span>track(s) selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkAddToPlaylist}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Selected to Playlist</span>
              </button>

              <button
                onClick={handleBulkQueue}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Selected to Queue</span>
              </button>

              <button
                onClick={() => setSelectedSongIds(new Set())}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Table */}
      <div className="rounded-lg bg-[#0e131b] border border-slate-800 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0a0d14] text-[11px] font-mono text-slate-400 uppercase select-none">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={handleSelectAll}
              title="Select / Deselect All"
              className="text-slate-500 hover:text-slate-300"
            >
              {selectedSongIds.size > 0 && selectedSongIds.size === filteredSongs.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="w-6 text-center">#</span>
            <span className="w-8"></span>
            <span>Title & Artist</span>
          </div>
          <div className="hidden md:flex items-center gap-4 w-1/3 text-left">
            <span className="flex-1">Album</span>
            <span className="w-20">Genre</span>
          </div>
          <div className="w-28 text-right pr-2">Duration</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-800/40 p-1">
          {isFiltering ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TrackRowSkeleton key={i} />
            ))
          ) : filteredSongs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No tracks match the selected filters.
            </div>
          ) : (
            filteredSongs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                isSelected={selectedSongIds.has(song.id)}
                onToggleSelect={toggleSelectSong}
                onOpenAddToPlaylist={(s) => onOpenAddToPlaylist([s])}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
