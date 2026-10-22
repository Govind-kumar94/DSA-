import React, { useState } from 'react';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomPlayer } from './components/player/BottomPlayer';
import { QuickCommandModal } from './components/layout/QuickCommandModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { CreatePlaylistModal } from './components/playlists/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/playlists/AddToPlaylistModal';
import { AddTracksToPlaylistModal } from './components/playlists/AddTracksToPlaylistModal';
import { ImportAudioModal } from './components/music/ImportAudioModal';

import { HomePage } from './pages/HomePage';
import { AllSongsPage } from './pages/AllSongsPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { Song, Playlist } from './types';
import { AlertCircle, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activePage, 
    createPlaylist, 
    updatePlaylist, 
    deletePlaylist, 
    allSongs 
  } = useAudioPlayer();

  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [songsForAddToPlaylist, setSongsForAddToPlaylist] = useState<Song[]>([]);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [targetPlaylistIdForAddTracks, setTargetPlaylistIdForAddTracks] = useState<string | null>(null);
  const [isAddTracksToPlaylistOpen, setIsAddTracksToPlaylistOpen] = useState(false);

  // Deletion confirmation modal
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

  // Handlers
  const handleOpenCreatePlaylist = () => {
    setEditingPlaylist(null);
    setIsCreatePlaylistOpen(true);
  };

  const handleEditPlaylist = (pl: Playlist) => {
    setEditingPlaylist(pl);
    setIsCreatePlaylistOpen(true);
  };

  const handleSavePlaylist = (title: string, description: string, coverImage: string, accentColor: string) => {
    if (editingPlaylist) {
      updatePlaylist(editingPlaylist.id, { title, description, coverImage, accentColor });
    } else {
      createPlaylist(title, description, coverImage, accentColor);
    }
    setEditingPlaylist(null);
  };

  const handleRequestDeletePlaylist = (pl: Playlist) => {
    setPlaylistToDelete(pl);
  };

  const handleConfirmDelete = () => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete.id);
      setPlaylistToDelete(null);
    }
  };

  const handleOpenAddToPlaylist = (songs: Song[]) => {
    setSongsForAddToPlaylist(songs);
    setIsAddToPlaylistOpen(true);
  };

  const handleOpenAddSongsForPlaylist = (playlistId: string) => {
    setTargetPlaylistIdForAddTracks(playlistId);
    setIsAddTracksToPlaylistOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f15] text-[#f1f5f9] select-none font-sans">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-[#0e131b]">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header 
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {activePage === 'home' && (
            <HomePage 
              onOpenAddToPlaylist={(song) => handleOpenAddToPlaylist([song])}
              onEditPlaylist={handleEditPlaylist}
              onDeletePlaylist={handleRequestDeletePlaylist}
            />
          )}

          {activePage === 'songs' && (
            <AllSongsPage
              onOpenAddToPlaylist={handleOpenAddToPlaylist}
              onOpenImportModal={() => setIsImportModalOpen(true)}
            />
          )}

          {activePage === 'playlists' && (
            <PlaylistsPage 
              onOpenCreateModal={handleOpenCreatePlaylist}
              onEditPlaylist={handleEditPlaylist}
              onDeletePlaylist={handleRequestDeletePlaylist}
            />
          )}

          {activePage === 'playlist-detail' && (
            <PlaylistDetailPage 
              onOpenAddSongsModal={handleOpenAddSongsForPlaylist}
              onEditPlaylist={handleEditPlaylist}
            />
          )}

          {activePage === 'favorites' && (
            <FavoritesPage 
              onOpenAddToPlaylist={handleOpenAddToPlaylist}
            />
          )}

          {activePage === 'search' && (
            <SearchPage 
              onOpenAddToPlaylist={handleOpenAddToPlaylist}
              onEditPlaylist={handleEditPlaylist}
              onDeletePlaylist={handleRequestDeletePlaylist}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage />
          )}
        </main>

        {/* Persistent Bottom Audio Player */}
        <BottomPlayer />
      </div>

      {/* Global Interactive Modals */}
      <QuickCommandModal />
      <ToastContainer />

      <CreatePlaylistModal 
        isOpen={isCreatePlaylistOpen}
        onClose={() => {
          setIsCreatePlaylistOpen(false);
          setEditingPlaylist(null);
        }}
        onSubmit={handleSavePlaylist}
        initialData={editingPlaylist}
      />

      <AddToPlaylistModal 
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        songsToAdd={songsForAddToPlaylist}
      />

      <AddTracksToPlaylistModal
        isOpen={isAddTracksToPlaylistOpen}
        onClose={() => {
          setIsAddTracksToPlaylistOpen(false);
          setTargetPlaylistIdForAddTracks(null);
        }}
        playlistId={targetPlaylistIdForAddTracks}
      />

      <ImportAudioModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Destructive Action Confirmation Modal */}
      {playlistToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e131b] border border-slate-700 rounded-lg p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-semibold text-sm text-slate-100 font-sans">Delete Playlist?</h3>
            </div>
            <p className="text-slate-300">
              Are you sure you want to delete <strong className="text-white">"{playlistToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setPlaylistToDelete(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded"
              >
                Delete Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AudioPlayerProvider>
      <MainLayout />
    </AudioPlayerProvider>
  );
}
