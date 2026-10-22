import React from 'react';
import { Search, Upload, Cpu, Menu } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  onOpenImportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenImportModal }) => {
  const { 
    activePage, 
    setActivePage, 
    selectedPlaylistId, 
    playlists, 
    setIsCommandPaletteOpen 
  } = useAudioPlayer();

  // Determine current breadcrumb
  let breadcrumbTitle = 'Discover & Featured';
  if (activePage === 'songs') breadcrumbTitle = 'All Songs Catalog';
  else if (activePage === 'playlists') breadcrumbTitle = 'Curated Playlists';
  else if (activePage === 'playlist-detail') {
    const pl = playlists.find(p => p.id === selectedPlaylistId);
    breadcrumbTitle = pl ? `Playlist: ${pl.title}` : 'Playlist Details';
  } else if (activePage === 'favorites') breadcrumbTitle = 'Your Favorites';
  else if (activePage === 'search') breadcrumbTitle = 'Search Library';
  else if (activePage === 'settings') breadcrumbTitle = 'System Preferences';

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0e131b]/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none sticky top-0 z-10">
      {/* Zone 1: Mobile hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 truncate">
          <span>TuneFlow</span>
          <span>/</span>
          <span className="text-slate-200 font-sans font-medium text-sm truncate">
            {breadcrumbTitle}
          </span>
        </div>
      </div>

      {/* Zone 2: Search Launcher Bar */}
      <div className="hidden sm:flex items-center max-w-md flex-1 mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-300 border border-slate-800 rounded text-xs transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search tracks, artists, or playlists...</span>
          </span>
          <kbd className="hidden md:inline-block text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-white text-slate-900 rounded text-xs font-medium transition-colors shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Audio</span>
        </button>
      </div>
    </header>
  );
};
