import React, { useState } from 'react';
import { X, Library, Image as ImageIcon } from 'lucide-react';
import { Playlist } from '../../types';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, coverImage: string, accentColor: string) => void;
  initialData?: Playlist | null;
}

const PRESET_COVERS = [
  { url: '/src/assets/images/cover_transit_focus_1792695542804.jpg', label: 'Transit Focus' },
  { url: '/src/assets/images/cover_night_express_1792695555411.jpg', label: 'Night Express' },
  { url: '/src/assets/images/cover_ambient_pulse_1792695555687.jpg', label: 'Ambient Pulse' },
  { url: '/src/assets/images/hero_railway_soundscape_1792695527791.jpg', label: 'Railway Interior' },
];

const PRESET_ACCENTS = ['#f59e0b', '#38bdf8', '#10b981', '#a855f7', '#f43f5e'];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || PRESET_COVERS[0].url);
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || PRESET_ACCENTS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim(), coverImage, accentColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-[#0e131b] border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-sans">
              {initialData ? 'Edit Playlist' : 'Create New Playlist'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Playlist Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Alpine Night Express"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief notes on mood, genres, or focus intention..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Cover Art selection */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-2">
              Select Curated Cover Artwork
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COVERS.map((preset) => (
                <div
                  key={preset.url}
                  onClick={() => setCoverImage(preset.url)}
                  className={`aspect-square rounded border cursor-pointer overflow-hidden relative ${
                    coverImage === preset.url
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-2">
              Transit Signal Color
            </label>
            <div className="flex items-center gap-2">
              {PRESET_ACCENTS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    accentColor === color ? 'scale-110 border-white' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
