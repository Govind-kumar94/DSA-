import React from 'react';
import { 
  Compass, 
  Music2, 
  Library, 
  Heart, 
  Search, 
  Cpu, 
  Settings, 
  Plus, 
  Sparkles,
  Command
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { ActivePage } from '../../types';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    playlists, 
    setSelectedPlaylistId, 
    favoriteIds,
    setIsCommandPaletteOpen,
    setIsNowPlayingOpen,
    createPlaylist
  } = useAudioPlayer();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'songs', label: 'All Songs', icon: Music2 },
    { id: 'playlists', label: 'Playlists', icon: Library, badge: `${playlists.length}` },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteIds.size > 0 ? `${favoriteIds.size}` : undefined },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    if (page !== 'playlist-detail') {
      setSelectedPlaylistId(null);
    }
  };

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setActivePage('playlist-detail');
  };

  return (
    <aside className="w-64 bg-[#0e131b] border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header - Railway Authority style clarity */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 font-mono font-bold text-sm tracking-wider shadow-sm group-hover:border-amber-500/50 transition-colors">
            TF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-100 text-sm tracking-tight font-sans">TuneFlow</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-slate-800 text-amber-400 rounded border border-slate-700">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Precision Audio System</p>
          </div>
        </div>
      </div>

      {/* Quick Search Launcher Button */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md text-xs transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search or command...</span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-4 space-y-1">
        <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
          System Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800/90 text-amber-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-amber-400/10 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Playlists Section */}
      <div className="flex-1 flex flex-col min-h-0 px-3 pt-2 pb-4 border-t border-slate-800/60">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Playlists
          </span>
          <button
            onClick={() => createPlaylist('New Curated List')}
            title="Create Playlist"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handlePlaylistClick(pl.id)}
              className="w-full text-left px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 truncate flex items-center justify-between group transition-colors"
            >
              <span className="truncate">{pl.title}</span>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-400 shrink-0">
                {pl.songIds.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Dispatch / Audio Status Tag */}
      <div className="p-3 bg-[#0a0d14] border-t border-slate-800/80">
        <div 
          onClick={() => setIsNowPlayingOpen(true)}
          className="flex items-center justify-between p-2.5 rounded bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-slate-300">Now Playing</p>
              <p className="text-[10px] text-slate-400 font-mono">Expand Audio Console</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-400 font-semibold">View →</span>
        </div>
      </div>
    </aside>
  );
};
