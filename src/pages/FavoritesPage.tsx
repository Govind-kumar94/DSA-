import React, { useMemo } from 'react';
import { Heart, Play, Shuffle, Plus, Music2 } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { TrackRow } from '../components/music/TrackRow';
import { formatTotalDuration } from '../utils/formatters';
import { Song } from '../types';

interface FavoritesPageProps {
  onOpenAddToPlaylist: (songs: Song[]) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onOpenAddToPlaylist }) => {
  const { allSongs, favoriteIds, playSong, enqueueSong, setActivePage } = useAudioPlayer();

  const favoriteSongs = useMemo(() => {
    return allSongs.filter(s => favoriteIds.has(s.id));
  }, [allSongs, favoriteIds]);

  const totalDuration = favoriteSongs.reduce((acc, s) => acc + s.duration, 0);

  const handlePlayAll = () => {
    if (favoriteSongs.length === 0) return;
    playSong(favoriteSongs[0]);
    favoriteSongs.slice(1).forEach(s => enqueueSong(s));
  };

  const handleShufflePlay = () => {
    if (favoriteSongs.length === 0) return;
    const shuffled = [...favoriteSongs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0]);
    shuffled.slice(1).forEach(s => enqueueSong(s));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#0e131b] border border-slate-800 flex flex-col sm:flex-row items-center sm:items-end gap-6 shadow-xl">
        <div className="w-32 h-32 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-lg text-rose-400">
          <Heart className="w-14 h-14 fill-rose-500 stroke-none" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider font-semibold">
            Listener Collection
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-100 font-sans tracking-tight">
            Favorite Tracks
          </h1>
          <p className="text-xs font-mono text-slate-400">
            {favoriteSongs.length} favorited tracks · {formatTotalDuration(totalDuration)}
          </p>

          {favoriteSongs.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={handlePlayAll}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Favorites</span>
              </button>

              <button
                onClick={handleShufflePlay}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium rounded text-xs flex items-center gap-2 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5 text-rose-400" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={() => onOpenAddToPlaylist(favoriteSongs)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save as Playlist</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tracks List */}
      <div className="rounded-lg bg-[#0e131b] border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0a0d14] text-[11px] font-mono text-slate-400 uppercase select-none">
          <div className="flex items-center gap-3 flex-1">
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

        <div className="divide-y divide-slate-800/40 p-1">
          {favoriteSongs.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">
              <Heart className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
              <p className="text-slate-300 font-sans font-semibold">No favorites yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click the heart icon on any song to save it to your personal favorites.
              </p>
              <button
                onClick={() => setActivePage('songs')}
                className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
              >
                Browse All Songs
              </button>
            </div>
          ) : (
            favoriteSongs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                onOpenAddToPlaylist={(s) => onOpenAddToPlaylist([s])}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
