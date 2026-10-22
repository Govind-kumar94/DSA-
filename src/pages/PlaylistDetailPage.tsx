import React, { useState, useMemo } from 'react';
import { Play, Shuffle, Plus, ArrowLeft, Clock, Music, ArrowUpDown, Trash2, Edit3 } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { TrackRow } from '../components/music/TrackRow';
import { formatTotalDuration, formatTimestamp } from '../utils/formatters';
import { Playlist, Song } from '../types';

interface PlaylistDetailPageProps {
  onOpenAddSongsModal: (playlistId: string) => void;
  onEditPlaylist: (pl: Playlist) => void;
}

export const PlaylistDetailPage: React.FC<PlaylistDetailPageProps> = ({
  onOpenAddSongsModal,
  onEditPlaylist,
}) => {
  const { 
    selectedPlaylistId, 
    playlists, 
    setActivePage, 
    playPlaylist, 
    songHashMap, 
    removeSongFromPlaylist, 
    reorderPlaylistTracks,
    activePlaylistId,
    playbackState
  } = useAudioPlayer();

  const playlist = playlists.find(p => p.id === selectedPlaylistId);
  const [sortInternal, setSortInternal] = useState<'custom' | 'title' | 'duration'>('custom');

  // Hydrate songs from SongHashMap (demonstrates fast O(1) retrieval)
  const playlistSongs = useMemo(() => {
    if (!playlist) return [];
    const songs: Song[] = [];
    playlist.songIds.forEach(id => {
      const entry = songHashMap.get(id);
      if (entry.value) songs.push(entry.value);
    });

    if (sortInternal === 'title') {
      return [...songs].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortInternal === 'duration') {
      return [...songs].sort((a, b) => a.duration - b.duration);
    }
    return songs;
  }, [playlist, songHashMap, sortInternal]);

  if (!playlist) {
    return (
      <div className="py-12 text-center text-slate-400 font-mono text-xs">
        <p>Playlist not found.</p>
        <button
          onClick={() => setActivePage('playlists')}
          className="mt-3 text-amber-400 underline"
        >
          Return to Playlists
        </button>
      </div>
    );
  }

  const totalDuration = playlistSongs.reduce((acc, s) => acc + s.duration, 0);
  const isPlayingThisList = activePlaylistId === playlist.id && playbackState.isPlaying;

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderPlaylistTracks(playlist.id, index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < playlist.songIds.length - 1) {
      reorderPlaylistTracks(playlist.id, index, index + 1);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActivePage('playlists')}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Playlists</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl bg-[#0e131b] border border-slate-800 flex flex-col sm:flex-row items-center sm:items-end gap-6 shadow-xl">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 shadow-lg">
          {playlist.coverImage ? (
            <img
              src={playlist.coverImage}
              alt={playlist.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <Music className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Curated Playlist · DLL Sequence
            </span>
            {isPlayingThisList && (
              <span className="text-[10px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                Now Playing
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-100 font-sans tracking-tight">
            {playlist.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-sans">
            {playlist.description || 'Custom listener playlist.'}
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-slate-400">
            <span>{playlist.songIds.length} tracks</span>
            <span>·</span>
            <span>{formatTotalDuration(totalDuration)}</span>
            <span>·</span>
            <span>Created {formatTimestamp(playlist.createdAt)}</span>
          </div>

          {/* Action Row */}
          <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => playPlaylist(playlist.id, false)}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play All</span>
            </button>

            <button
              onClick={() => playPlaylist(playlist.id, true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-medium rounded text-xs flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>Shuffle Play</span>
            </button>

            <button
              onClick={() => onOpenAddSongsModal(playlist.id)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-medium rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Songs</span>
            </button>

            <button
              onClick={() => onEditPlaylist(playlist)}
              className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 rounded border border-slate-750"
              title="Edit Playlist Details"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sorting bar within playlist */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
        <span className="text-[11px] uppercase">
          Track Reordering: Use Up/Down arrows to swap Doubly Linked List pointers
        </span>
        <div className="flex items-center gap-2">
          <span>Sort View:</span>
          <select
            value={sortInternal}
            onChange={(e) => setSortInternal(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
          >
            <option value="custom">Original Sequence (DLL)</option>
            <option value="title">By Title</option>
            <option value="duration">By Duration</option>
          </select>
        </div>
      </div>

      {/* Playlist Track Table */}
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
          <div className="w-36 text-right pr-2">Reorder & Time</div>
        </div>

        <div className="divide-y divide-slate-800/40 p-1">
          {playlistSongs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              <p>This playlist has no songs yet.</p>
              <button
                onClick={() => onOpenAddSongsModal(playlist.id)}
                className="mt-2 text-amber-400 underline"
              >
                + Add Tracks to Playlist
              </button>
            </div>
          ) : (
            playlistSongs.map((song, idx) => (
              <TrackRow
                key={`${song.id}-${idx}`}
                song={song}
                index={idx}
                fromPlaylistId={playlist.id}
                canMoveUp={sortInternal === 'custom' && idx > 0}
                canMoveDown={sortInternal === 'custom' && idx < playlistSongs.length - 1}
                onMoveUp={() => handleMoveUp(idx)}
                onMoveDown={() => handleMoveDown(idx)}
                onRemoveFromPlaylist={() => removeSongFromPlaylist(playlist.id, song.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
