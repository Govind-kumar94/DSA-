import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Song, Playlist, PlaybackState, QueueItem, HistoryItem, ActivePage, RepeatMode, ToastNotification } from '../types';
import { DEMO_SONGS } from '../data/demoCatalog';
import { DoublyLinkedList } from '../structures/DoublyLinkedList';
import { SongHashMap } from '../structures/SongHashMap';
import { PlaybackQueue } from '../structures/PlaybackQueue';
import { PlaybackHistoryStack } from '../structures/PlaybackHistoryStack';
import { SongGraph } from '../structures/songGraph';
import { AudioEngine } from '../services/audioEngine';
import { StorageService } from '../services/storageService';

interface AudioPlayerContextType {
  // Navigation & View
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNowPlayingOpen: boolean;
  setIsNowPlayingOpen: (open: boolean) => void;

  // Catalog & Structures
  allSongs: Song[];
  songHashMap: SongHashMap<Song>;
  songGraph: SongGraph;
  playlists: Playlist[];
  favoriteIds: Set<string>;
  currentPlaylistDLL: DoublyLinkedList<Song>;
  playbackQueue: PlaybackQueue<QueueItem>;
  playbackHistory: PlaybackHistoryStack<HistoryItem>;
  queueItems: QueueItem[];
  historyItems: HistoryItem[];

  // Playback State
  playbackState: PlaybackState;
  activePlaylistId: string | null;

  // Playback Actions
  playSong: (song: Song, fromPlaylistId?: string) => void;
  playPlaylist: (playlistId: string, shuffle?: boolean) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;

  // Queue Actions
  enqueueSong: (song: Song, toFront?: boolean) => void;
  removeFromQueue: (queueItemId: string) => void;
  clearQueue: () => void;
  reorderQueue: (fromIdx: number, toIdx: number) => void;

  // Playlist Actions
  createPlaylist: (title: string, description?: string, coverImage?: string, accentColor?: string) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  duplicatePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  reorderPlaylistTracks: (playlistId: string, fromIndex: number, toIndex: number) => void;

  // Favorites & Imports
  toggleFavorite: (songId: string) => void;
  importLocalAudioFiles: (files: FileList) => Promise<number>;
  resetDemoData: () => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (title: string, message?: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const addToast = useCallback((title: string, message?: string, type: ToastNotification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Storage initializations
  const savedSettings = useMemo(() => StorageService.getPlayerSettings(), []);
  const [customTracks, setCustomTracks] = useState<Song[]>(() => StorageService.getCustomTracks());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => StorageService.getPlaylists());
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set(StorageService.getFavoriteIds()));

  // Merged song catalog
  const allSongs = useMemo(() => {
    return [...DEMO_SONGS, ...customTracks];
  }, [customTracks]);

  // Hash Map of songs
  const songHashMap = useMemo(() => {
    const map = new SongHashMap<Song>(16);
    allSongs.forEach(song => {
      map.put(song.id, song);
    });
    return map;
  }, [allSongs]);

  // Graph of song similarity
  const songGraph = useMemo(() => {
    return SongGraph.buildFromCatalog(allSongs);
  }, [allSongs]);

  // Persistent structures
  const currentPlaylistDLL = useRef<DoublyLinkedList<Song>>(new DoublyLinkedList<Song>()).current;
  const playbackQueue = useRef<PlaybackQueue<QueueItem>>(new PlaybackQueue<QueueItem>()).current;
  const playbackHistory = useRef<PlaybackHistoryStack<HistoryItem>>(new PlaybackHistoryStack<HistoryItem>(50)).current;

  // React state copies for rendering reactive queues/histories
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const syncQueueState = useCallback(() => {
    setQueueItems(playbackQueue.toArray());
  }, [playbackQueue]);

  const syncHistoryState = useCallback(() => {
    setHistoryItems(playbackHistory.toArray());
  }, [playbackHistory]);

  // Audio Engine
  const audioEngine = useRef<AudioEngine | null>(null);

  // Playback state
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: savedSettings.volume,
    isMuted: savedSettings.isMuted,
    isShuffle: savedSettings.isShuffle,
    repeatMode: savedSettings.repeatMode,
    playbackRate: 1,
  });

  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  // Synchronize favorites with songs
  const songsWithFavs = useMemo(() => {
    return allSongs.map(s => ({ ...s, isFavorite: favoriteIds.has(s.id) }));
  }, [allSongs, favoriteIds]);

  // Save changes to storage
  useEffect(() => {
    StorageService.savePlaylists(playlists);
  }, [playlists]);

  useEffect(() => {
    StorageService.saveFavoriteIds(Array.from(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    StorageService.savePlayerSettings({
      volume: playbackState.volume,
      isMuted: playbackState.isMuted,
      isShuffle: playbackState.isShuffle,
      repeatMode: playbackState.repeatMode,
      lastSongId: playbackState.currentSong?.id,
    });
  }, [playbackState.volume, playbackState.isMuted, playbackState.isShuffle, playbackState.repeatMode, playbackState.currentSong]);

  // Initialize AudioEngine callbacks once
  useEffect(() => {
    const engine = new AudioEngine();
    audioEngine.current = engine;

    engine.setVolume(savedSettings.volume);
    engine.setMuted(savedSettings.isMuted);

    engine.onTimeUpdate = (currentTime, duration) => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime,
        duration: duration || prev.duration,
      }));
    };

    engine.onPlayStateChange = (isPlaying) => {
      setPlaybackState(prev => ({ ...prev, isPlaying }));
    };

    engine.onEnded = () => {
      handleTrackEnd();
    };

    // Load initial track (paused)
    const initialTrack = allSongs.find(s => s.id === (savedSettings.lastSongId || 'track-01')) || allSongs[0];
    if (initialTrack) {
      setPlaybackState(prev => ({
        ...prev,
        currentSong: initialTrack,
        duration: initialTrack.duration,
      }));
    }

    return () => {
      engine.destroy();
    };
  }, []);

  // Keyboard shortcut listener: Cmd/Ctrl+K, Space to play/pause, [ and ] for prev/next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Ignore standard player keys when user is typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        nextTrack();
      } else if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        prevTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackState.isPlaying, playbackState.isMuted]);

  // Play specific song
  const playSong = useCallback((song: Song, fromPlaylistId?: string) => {
    if (fromPlaylistId) {
      setActivePlaylistId(fromPlaylistId);
      const playlist = playlists.find(p => p.id === fromPlaylistId);
      if (playlist) {
        // Rebuild Doubly Linked List for this playlist sequence
        currentPlaylistDLL.clear();
        playlist.songIds.forEach(id => {
          const s = songHashMap.get(id).value;
          if (s) currentPlaylistDLL.append(s, s.id);
        });
        currentPlaylistDLL.setCurrent(s => s.id === song.id);
      }
    } else {
      // Standalone or all-songs traversal DLL
      if (activePlaylistId !== null) {
        setActivePlaylistId(null);
      }
      currentPlaylistDLL.setCurrent(s => s.id === song.id);
    }

    // Push previous song to History Stack if it was playing
    if (playbackState.currentSong && playbackState.currentSong.id !== song.id) {
      playbackHistory.push({
        song: playbackState.currentSong,
        playedAt: Date.now(),
      });
      syncHistoryState();
    }

    setPlaybackState(prev => ({
      ...prev,
      currentSong: song,
      duration: song.duration,
      currentTime: 0,
      isPlaying: true,
    }));

    audioEngine.current?.loadAndPlay(song, 0);
  }, [playlists, songHashMap, currentPlaylistDLL, playbackHistory, playbackState.currentSong, activePlaylistId, syncHistoryState]);

  // Play entire playlist
  const playPlaylist = useCallback((playlistId: string, shuffle: boolean = false) => {
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl || pl.songIds.length === 0) {
      addToast('Playlist is empty', 'Add some tracks before playing.', 'warning');
      return;
    }

    setActivePlaylistId(playlistId);
    currentPlaylistDLL.clear();

    let songList: Song[] = [];
    pl.songIds.forEach(id => {
      const s = songHashMap.get(id).value;
      if (s) songList.push(s);
    });

    if (songList.length === 0) return;

    if (shuffle) {
      songList = [...songList].sort(() => Math.random() - 0.5);
    }

    songList.forEach(s => currentPlaylistDLL.append(s, s.id));
    const firstSong = currentPlaylistDLL.resetToHead();

    if (firstSong) {
      playSong(firstSong, playlistId);
      addToast(`Playing "${pl.title}"`, `${songList.length} tracks in queue`, 'info');
    }
  }, [playlists, songHashMap, currentPlaylistDLL, playSong, addToast]);

  // Next Track handler (checks Queue FIFO first, then DLL Next, then Repeat)
  const nextTrack = useCallback(() => {
    // 1. Check upcoming Queue (FIFO)
    if (!playbackQueue.isEmpty()) {
      const nextQueueItem = playbackQueue.dequeue();
      syncQueueState();
      if (nextQueueItem) {
        playSong(nextQueueItem.song, activePlaylistId || undefined);
        return;
      }
    }

    // 2. Check Doubly Linked List next
    if (currentPlaylistDLL.size > 0) {
      const nextFromDLL = currentPlaylistDLL.next();
      if (nextFromDLL) {
        playSong(nextFromDLL, activePlaylistId || undefined);
        return;
      } else if (playbackState.repeatMode === 'all') {
        const loopHead = currentPlaylistDLL.resetToHead();
        if (loopHead) {
          playSong(loopHead, activePlaylistId || undefined);
          return;
        }
      }
    }

    // 3. Fallback: cycle through all songs catalog
    if (playbackState.currentSong) {
      const currentIndex = allSongs.findIndex(s => s.id === playbackState.currentSong?.id);
      if (currentIndex !== -1) {
        if (playbackState.isShuffle) {
          const randomIndex = Math.floor(Math.random() * allSongs.length);
          playSong(allSongs[randomIndex]);
        } else if (currentIndex < allSongs.length - 1) {
          playSong(allSongs[currentIndex + 1]);
        } else if (playbackState.repeatMode === 'all') {
          playSong(allSongs[0]);
        } else {
          setPlaybackState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
          audioEngine.current?.pause();
        }
      }
    }
  }, [playbackQueue, currentPlaylistDLL, playbackState.repeatMode, playbackState.currentSong, playbackState.isShuffle, allSongs, playSong, activePlaylistId, syncQueueState]);

  // Previous Track handler (checks History Stack LIFO first or rewinds)
  const prevTrack = useCallback(() => {
    // If more than 3 seconds elapsed, simply rewind to start of current track
    if (playbackState.currentTime > 3) {
      seek(0);
      return;
    }

    // Check Playback History Stack (LIFO)
    if (!playbackHistory.isEmpty()) {
      const previousHistory = playbackHistory.pop();
      syncHistoryState();
      if (previousHistory) {
        playSong(previousHistory.song, activePlaylistId || undefined);
        return;
      }
    }

    // Check Doubly Linked List previous
    if (currentPlaylistDLL.size > 0) {
      const prevFromDLL = currentPlaylistDLL.prev();
      if (prevFromDLL) {
        playSong(prevFromDLL, activePlaylistId || undefined);
        return;
      }
    }

    // Fallback: previous in all songs catalog
    if (playbackState.currentSong) {
      const currentIndex = allSongs.findIndex(s => s.id === playbackState.currentSong?.id);
      if (currentIndex > 0) {
        playSong(allSongs[currentIndex - 1]);
      } else {
        seek(0);
      }
    }
  }, [playbackState.currentTime, playbackHistory, currentPlaylistDLL, allSongs, playSong, activePlaylistId, syncHistoryState]);

  // End of track logic
  const handleTrackEnd = useCallback(() => {
    if (playbackState.repeatMode === 'one' && playbackState.currentSong) {
      seek(0);
      audioEngine.current?.loadAndPlay(playbackState.currentSong, 0);
    } else {
      nextTrack();
    }
  }, [playbackState.repeatMode, playbackState.currentSong, nextTrack]);

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    if (!playbackState.currentSong && allSongs.length > 0) {
      playSong(allSongs[0]);
      return;
    }

    if (playbackState.isPlaying) {
      audioEngine.current?.pause();
      setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    } else {
      audioEngine.current?.play();
      setPlaybackState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [playbackState.currentSong, playbackState.isPlaying, allSongs, playSong]);

  const seek = useCallback((seconds: number) => {
    audioEngine.current?.seek(seconds);
    setPlaybackState(prev => ({ ...prev, currentTime: seconds }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    audioEngine.current?.setVolume(vol);
    setPlaybackState(prev => ({ ...prev, volume: vol, isMuted: false }));
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = !playbackState.isMuted;
    audioEngine.current?.setMuted(nextMuted);
    setPlaybackState(prev => ({ ...prev, isMuted: nextMuted }));
  }, [playbackState.isMuted]);

  const toggleShuffle = useCallback(() => {
    setPlaybackState(prev => {
      const newShuffle = !prev.isShuffle;
      addToast(newShuffle ? 'Shuffle Enabled' : 'Shuffle Disabled', undefined, 'info');
      return { ...prev, isShuffle: newShuffle };
    });
  }, [addToast]);

  const cycleRepeatMode = useCallback(() => {
    setPlaybackState(prev => {
      let nextMode: RepeatMode = 'off';
      if (prev.repeatMode === 'off') nextMode = 'all';
      else if (prev.repeatMode === 'all') nextMode = 'one';
      else nextMode = 'off';

      const label = nextMode === 'all' ? 'Repeat All' : nextMode === 'one' ? 'Repeat One' : 'Repeat Off';
      addToast(label, undefined, 'info');
      return { ...prev, repeatMode: nextMode };
    });
  }, [addToast]);

  // Queue actions
  const enqueueSong = useCallback((song: Song, toFront: boolean = false) => {
    const queueItem: QueueItem = {
      id: Math.random().toString(36).substring(2, 9),
      song,
      addedAt: Date.now(),
    };
    if (toFront) {
      playbackQueue.enqueueFront(queueItem);
      addToast(`Playing next: "${song.title}"`, undefined, 'success');
    } else {
      playbackQueue.enqueue(queueItem);
      addToast(`Added to queue: "${song.title}"`, undefined, 'success');
    }
    syncQueueState();
  }, [playbackQueue, syncQueueState, addToast]);

  const removeFromQueue = useCallback((queueItemId: string) => {
    playbackQueue.remove(item => item.id === queueItemId);
    syncQueueState();
  }, [playbackQueue, syncQueueState]);

  const clearQueue = useCallback(() => {
    playbackQueue.clear();
    syncQueueState();
    addToast('Playback queue cleared', undefined, 'info');
  }, [playbackQueue, syncQueueState, addToast]);

  const reorderQueue = useCallback((fromIdx: number, toIdx: number) => {
    playbackQueue.move(fromIdx, toIdx);
    syncQueueState();
  }, [playbackQueue, syncQueueState]);

  // Playlist management
  const createPlaylist = useCallback((title: string, description: string = '', coverImage?: string, accentColor?: string): Playlist => {
    const newPl: Playlist = {
      id: 'pl-' + Date.now().toString(36),
      title: title.trim() || 'Untitled Playlist',
      description,
      coverImage: coverImage || '/src/assets/images/cover_transit_focus_1792695542804.jpg',
      accentColor: accentColor || '#f59e0b',
      songIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPlaylists(prev => [newPl, ...prev]);
    addToast('Playlist created', `"${newPl.title}" is ready`, 'success');
    return newPl;
  }, [addToast]);

  const updatePlaylist = useCallback((id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates, updatedAt: Date.now() };
      }
      return p;
    }));
    addToast('Playlist updated', undefined, 'success');
  }, [addToast]);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
      setActivePage('playlists');
    }
    addToast('Playlist deleted', undefined, 'info');
  }, [selectedPlaylistId, addToast]);

  const duplicatePlaylist = useCallback((id: string) => {
    const orig = playlists.find(p => p.id === id);
    if (!orig) return;
    const duplicated: Playlist = {
      ...orig,
      id: 'pl-' + Date.now().toString(36),
      title: `${orig.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPlaylists(prev => [duplicated, ...prev]);
    addToast('Playlist duplicated', `Created "${duplicated.title}"`, 'success');
  }, [playlists, addToast]);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.songIds.includes(songId)) {
          addToast('Track already in playlist', undefined, 'warning');
          return p;
        }
        addToast('Added to playlist', undefined, 'success');
        return { ...p, songIds: [...p.songIds, songId], updatedAt: Date.now() };
      }
      return p;
    }));
  }, [addToast]);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== songId), updatedAt: Date.now() };
      }
      return p;
    }));
    addToast('Track removed from playlist', undefined, 'info');
  }, [addToast]);

  const reorderPlaylistTracks = useCallback((playlistId: string, fromIndex: number, toIndex: number) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const arr = [...p.songIds];
        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);
        return { ...p, songIds: arr, updatedAt: Date.now() };
      }
      return p;
    }));
  }, []);

  // Favorites
  const toggleFavorite = useCallback((songId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
        addToast('Removed from favorites', undefined, 'info');
      } else {
        next.add(songId);
        addToast('Added to favorites', undefined, 'success');
      }
      return next;
    });
  }, [addToast]);

  // Import local audio files
  const importLocalAudioFiles = useCallback(async (files: FileList): Promise<number> => {
    const newTracks: Song[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) continue;

      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const parts = cleanName.split(' - ');
      const artist = parts.length > 1 ? parts[0].trim() : 'Local Artist';
      const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : cleanName;

      // Estimate duration with temporary audio element
      const duration = await new Promise<number>((resolve) => {
        const tempAudio = new Audio(objectUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
          resolve(Math.round(tempAudio.duration) || 180);
        });
        tempAudio.addEventListener('error', () => {
          resolve(180);
        });
      });

      const song: Song = {
        id: 'local-' + Date.now().toString(36) + '-' + i,
        title,
        artist,
        album: 'Local Imports',
        genre: 'Imported',
        duration,
        bpm: 100,
        year: new Date().getFullYear(),
        artwork: '/src/assets/images/cover_transit_focus_1792695542804.jpg',
        audioUrl: objectUrl,
        isCustom: true,
      };

      newTracks.push(song);
    }

    if (newTracks.length > 0) {
      setCustomTracks(prev => {
        const updated = [...newTracks, ...prev];
        StorageService.saveCustomTracks(updated);
        return updated;
      });
      addToast(`Imported ${newTracks.length} local audio track(s)`, undefined, 'success');
    }

    return newTracks.length;
  }, [addToast]);

  const resetDemoData = useCallback(() => {
    StorageService.resetAllData();
    setCustomTracks([]);
    setPlaylists(StorageService.getPlaylists());
    setFavoriteIds(new Set(StorageService.getFavoriteIds()));
    playbackQueue.clear();
    playbackHistory.clear();
    syncQueueState();
    syncHistoryState();
    addToast('Catalog reset to factory default', undefined, 'info');
  }, [playbackQueue, playbackHistory, syncQueueState, syncHistoryState, addToast]);

  return (
    <AudioPlayerContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedPlaylistId,
        setSelectedPlaylistId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        allSongs: songsWithFavs,
        songHashMap,
        songGraph,
        playlists,
        favoriteIds,
        currentPlaylistDLL,
        playbackQueue,
        playbackHistory,
        queueItems,
        historyItems,
        playbackState,
        activePlaylistId,
        playSong,
        playPlaylist,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        enqueueSong,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        duplicatePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        reorderPlaylistTracks,
        toggleFavorite,
        importLocalAudioFiles,
        resetDemoData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
