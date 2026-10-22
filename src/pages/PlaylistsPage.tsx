import React, { useState } from 'react';
import { Plus, Library, Sparkles, FolderPlus } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { Playlist } from '../types';

interface PlaylistsPageProps {
  onOpenCreateModal: () => void;
  onEditPlaylist: (pl: Playlist) => void;
  onDeletePlaylist: (pl: Playlist) => void;
}

export const PlaylistsPage: React.FC<PlaylistsPageProps> = ({
  onOpenCreateModal,
  onEditPlaylist,
  onDeletePlaylist,
}) => {
  const { playlists, allSongs, createPlaylist } = useAudioPlayer();

  const handleCreateQuickMood = (genre: string) => {
    const matching = allSongs.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
    const pl = createPlaylist(`${genre} Express`, `Auto-curated ${genre} tracks from library.`);
    matching.forEach(s => pl.songIds.push(s.id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans tracking-tight">
            Curated Playlists
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {playlists.length} playlists · Bidirectional Doubly Linked List playback traversal
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs flex items-center gap-2 self-start transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Quick Generators Banner */}
      <div className="p-4 rounded-lg bg-[#0e131b] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-200">Instant Smart Generators:</span>
          <span className="text-slate-400 hidden sm:inline">Build focused lists from library genres</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          {['Classical', 'Ambient', 'Electronic', 'Synthwave'].map(genre => (
            <button
              key={genre}
              onClick={() => handleCreateQuickMood(genre)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-amber-300 transition-colors"
            >
              + {genre} List
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Playlists */}
      {playlists.length === 0 ? (
        <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg p-8">
          <FolderPlus className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No playlists yet</p>
          <p className="text-xs text-slate-500 mt-1">Create your first playlist to begin sequencing tracks.</p>
          <button
            onClick={onOpenCreateModal}
            className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-semibold text-xs rounded hover:bg-amber-400"
          >
            Create First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map(pl => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onEdit={onEditPlaylist}
              onDelete={onDeletePlaylist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
