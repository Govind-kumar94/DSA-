import React from 'react';
import { X, Library, Plus, Check } from 'lucide-react';
import { Song } from '../../types';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  songsToAdd: Song[];
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  songsToAdd,
}) => {
  const { playlists, addSongToPlaylist, createPlaylist } = useAudioPlayer();

  if (!isOpen || songsToAdd.length === 0) return null;

  const handleAdd = (playlistId: string) => {
    songsToAdd.forEach(s => addSongToPlaylist(playlistId, s.id));
    onClose();
  };

  const handleCreateAndAdd = () => {
    const title = `Selection (${songsToAdd.length} tracks)`;
    const newPl = createPlaylist(title);
    songsToAdd.forEach(s => addSongToPlaylist(newPl.id, s.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-sm bg-[#0e131b] border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-sans">
              Add to Playlist
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {songsToAdd.length === 1 ? `"${songsToAdd[0].title}"` : `${songsToAdd.length} tracks selected`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Playlists list */}
        <div className="p-3 max-h-64 overflow-y-auto space-y-1 text-xs">
          {playlists.map((pl) => {
            const isAllPresent = songsToAdd.every(s => pl.songIds.includes(s.id));
            return (
              <button
                key={pl.id}
                onClick={() => handleAdd(pl.id)}
                disabled={isAllPresent}
                className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                  isAllPresent
                    ? 'bg-slate-900/40 text-slate-500 cursor-not-allowed'
                    : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-slate-800 overflow-hidden shrink-0">
                    <img src={pl.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{pl.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{pl.songIds.length} tracks</p>
                  </div>
                </div>

                {isAllPresent ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <Check className="w-3 h-3" /> Added
                  </span>
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Create new playlist option */}
        <div className="p-3 border-t border-slate-800 bg-[#0a0d14]">
          <button
            onClick={handleCreateAndAdd}
            className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Create New Playlist with Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
