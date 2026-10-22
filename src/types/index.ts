export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  artwork: string;
  audioUrl: string;
  bpm?: number;
  year?: number;
  isFavorite?: boolean;
  isCustom?: boolean; // imported by user
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  accentColor?: string;
  songIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  playbackRate: number;
}

export interface QueueItem {
  id: string; // unique queue item instance id
  song: Song;
  addedAt: number;
}

export interface HistoryItem {
  song: Song;
  playedAt: number;
}

export type ActivePage = 
  | 'home' 
  | 'songs' 
  | 'playlists' 
  | 'playlist-detail' 
  | 'favorites' 
  | 'search' 
  | 'settings';

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ComplexityInfo {
  name: string;
  structure: string;
  purpose: string;
  timeAccess: string;
  timeSearch: string;
  timeInsert: string;
  timeDelete: string;
  spaceComplexity: string;
  tuneFlowApplication: string;
}
