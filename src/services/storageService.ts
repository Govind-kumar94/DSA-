import { Playlist, Song, RepeatMode } from '../types';
import { DEMO_SONGS } from '../data/demoCatalog';
import { INITIAL_PLAYLISTS } from '../data/initialPlaylists';

const STORAGE_KEYS = {
  PLAYLISTS: 'tuneflow_playlists_v1',
  FAVORITES: 'tuneflow_favorites_v1',
  CUSTOM_TRACKS: 'tuneflow_custom_tracks_v1',
  PLAYER_SETTINGS: 'tuneflow_player_settings_v1',
  THEME: 'tuneflow_theme_v1',
};

export interface PlayerSettings {
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  lastSongId?: string;
}

export const StorageService = {
  getPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading playlists from storage:', e);
    }
    return INITIAL_PLAYLISTS;
  },

  savePlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.error('Failed to save playlists to storage:', e);
    }
  },

  getFavoriteIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading favorites:', e);
    }
    // Default favorites from demo catalog
    return DEMO_SONGS.filter(s => s.isFavorite).map(s => s.id);
  },

  saveFavoriteIds(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  },

  getCustomTracks(): Song[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TRACKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading custom tracks:', e);
    }
    return [];
  },

  saveCustomTracks(tracks: Song[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TRACKS, JSON.stringify(tracks));
    } catch (e) {
      console.error('Failed to save custom tracks:', e);
    }
  },

  getPlayerSettings(): PlayerSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading player settings:', e);
    }
    return {
      volume: 0.8,
      isMuted: false,
      isShuffle: false,
      repeatMode: 'all',
      lastSongId: 'track-01',
    };
  },

  savePlayerSettings(settings: PlayerSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save player settings:', e);
    }
  },

  getTheme(): 'dark' | 'light' {
    try {
      const t = localStorage.getItem(STORAGE_KEYS.THEME);
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {
      // fallback
    }
    return 'dark';
  },

  saveTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      // ignore
    }
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PLAYLISTS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_TRACKS);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_SETTINGS);
  },

  exportAllDataAsJSON(allSongs: Song[], playlists: Playlist[], favorites: string[]): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      customSongs: allSongs.filter(s => s.isCustom),
      playlists,
      favorites,
    };
    return JSON.stringify(backup, null, 2);
  },

  exportSongsAsCSV(songs: Song[]): string {
    const headers = ['ID', 'Title', 'Artist', 'Album', 'Genre', 'Duration(s)', 'BPM', 'Year'];
    const rows = songs.map(s => [
      `"${s.id}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.artist.replace(/"/g, '""')}"`,
      `"${s.album.replace(/"/g, '""')}"`,
      `"${s.genre}"`,
      s.duration,
      s.bpm || '',
      s.year || '',
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },
};
