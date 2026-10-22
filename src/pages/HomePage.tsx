import React from 'react';
import { Play, Shuffle, Sparkles, Clock, Compass, Music2, Library, Cpu, ArrowRight } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { TrackCard } from '../components/music/TrackCard';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { getGreeting, formatTotalDuration } from '../utils/formatters';
import { Song, Playlist } from '../types';

interface HomePageProps {
  onOpenAddToPlaylist: (song: Song) => void;
  onEditPlaylist: (pl: Playlist) => void;
  onDeletePlaylist: (pl: Playlist) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAddToPlaylist,
  onEditPlaylist,
  onDeletePlaylist,
}) => {
  const { 
    allSongs, 
    playlists, 
    playSong, 
    playPlaylist, 
    setActivePage, 
    setSelectedPlaylistId,
    historyItems,
    queueItems 
  } = useAudioPlayer();

  const greeting = getGreeting();
  const totalCatalogSeconds = allSongs.reduce((sum, s) => sum + s.duration, 0);

  // Featured tracks
  const trendingTracks = allSongs.slice(0, 6);
  const ambientTracks = allSongs.filter(s => s.genre === 'Ambient' || s.genre === 'Lo-Fi').slice(0, 4);
  const classicalTracks = allSongs.filter(s => s.genre === 'Classical').slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Soundscape Banner - Railway Aesthetic */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0c1017] shadow-xl">
        <div className="h-64 sm:h-72 w-full relative">
          <img
            src="/src/assets/images/hero_railway_soundscape_1792695527791.jpg"
            alt="TuneFlow Soundscape"
            className="w-full h-full object-cover object-center brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e131b] via-[#0e131b]/60 to-transparent" />
        </div>

        {/* Content Over Hero */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold px-2 py-0.5 rounded bg-black/60 border border-amber-400/30">
              Curated Transit Soundscapes
            </span>
            <span className="text-slate-400 font-mono text-xs">· SBB / European Audio System</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-100 font-sans tracking-tight max-w-xl">
            {greeting}, Listener.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1.5 font-sans">
            A quiet, disciplined music platform designed for deep focus, overnight travel, and uninterrupted acoustic listening.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => playPlaylist(playlists[0]?.id || '', false)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Transit Session</span>
            </button>

            <button
              onClick={() => setActivePage('songs')}
              className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-750 font-medium rounded text-xs flex items-center gap-2 transition-colors"
            >
              <Music2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-[#0e131b] border border-slate-800/80 text-xs">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Music Catalog</p>
          <p className="text-lg font-bold text-slate-100 font-sans mt-0.5">{allSongs.length} Tracks</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Verified masters</p>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0e131b] border border-slate-800/80 text-xs">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Curated Playlists</p>
          <p className="text-lg font-bold text-slate-100 font-sans mt-0.5">{playlists.length} Lists</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Seamless sequence</p>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0e131b] border border-slate-800/80 text-xs">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Catalog Duration</p>
          <p className="text-lg font-bold text-slate-100 font-sans mt-0.5">{formatTotalDuration(totalCatalogSeconds)}</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Continuous audio</p>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0e131b] border border-slate-800/80 text-xs">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Upcoming Queue</p>
          <p className="text-lg font-bold text-amber-400 font-sans mt-0.5">{queueItems.length} Enqueued</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Active scheduled</p>
        </div>
      </div>

      {/* Curated Playlists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight">
              Featured Curated Playlists
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Modeled as Doubly Linked Lists for seamless bidirectional playback
            </p>
          </div>
          <button
            onClick={() => setActivePage('playlists')}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {playlists.slice(0, 4).map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onEdit={onEditPlaylist}
              onDelete={onDeletePlaylist}
            />
          ))}
        </div>
      </div>

      {/* Featured Tracks Departure Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight">
              Trending Catalog Tracks
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Immediate playback with verified legal audio and harmonic synth fallback
            </p>
          </div>
          <button
            onClick={() => setActivePage('songs')}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {trendingTracks.map(song => (
            <TrackCard
              key={song.id}
              song={song}
              onOpenAddToPlaylist={onOpenAddToPlaylist}
            />
          ))}
        </div>
      </div>

      {/* Recently Played from Stack History */}
      {historyItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight">
                Recently Visited (Playback Stack)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Preserved in LIFO order for backtracking
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {historyItems.slice(0, 4).map((item, idx) => (
              <div
                key={`${item.song.id}-${item.playedAt}`}
                onClick={() => playSong(item.song)}
                className="p-3 rounded-lg bg-[#0e131b] border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center gap-3 group transition-colors text-xs"
              >
                <div className="w-10 h-10 rounded bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                  <img src={item.song.artwork} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-200 truncate group-hover:text-amber-400">
                    {item.song.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{item.song.artist}</p>
                </div>
                <Play className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
