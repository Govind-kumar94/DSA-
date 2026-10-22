import { Playlist } from '../types';

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-transit-focus',
    title: 'Transit Focus',
    description: 'Disciplined harmonic ambient soundscapes and minimal pulses for sustained technical work and concentration.',
    coverImage: '/src/assets/images/cover_transit_focus_1792695542804.jpg',
    accentColor: '#f59e0b', // Signal amber
    songIds: ['track-01', 'track-06', 'track-08', 'track-10', 'track-15', 'track-19'],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'pl-night-express',
    title: 'Night Express Line',
    description: 'Overnight journey rhythms across high-speed rail networks. Synthwave, electronic drives, and hypnotic tempo.',
    coverImage: '/src/assets/images/cover_night_express_1792695555411.jpg',
    accentColor: '#38bdf8', // Signal cyan
    songIds: ['track-07', 'track-09', 'track-11', 'track-13', 'track-18', 'track-20'],
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'pl-classical-mastery',
    title: 'Continental Classical',
    description: 'Timeless compositions by Satie, Debussy, Bach, Chopin, and Vivaldi from European concert halls.',
    coverImage: '/src/assets/images/cover_classical_monolith_1792697016555.jpg',
    accentColor: '#10b981', // Signal emerald
    songIds: ['track-01', 'track-02', 'track-03', 'track-04', 'track-05', 'track-21'],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'pl-twilight-commute',
    title: 'Twilight Commute',
    description: 'Warm acoustic nuances, quiet jazz chords, and subtle rain field recordings for dusk arrivals.',
    coverImage: '/src/assets/images/hero_railway_soundscape_1792695527791.jpg',
    accentColor: '#a855f7', // Quiet violet
    songIds: ['track-10', 'track-12', 'track-14', 'track-17', 'track-19', 'track-22'],
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 3,
  },
];
