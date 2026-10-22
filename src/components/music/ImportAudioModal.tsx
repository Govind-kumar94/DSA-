import React, { useState, useRef } from 'react';
import { X, Upload, Music, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface ImportAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportAudioModal: React.FC<ImportAudioModalProps> = ({ isOpen, onClose }) => {
  const { importLocalAudioFiles } = useAudioPlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileCount, setSelectedFileCount] = useState(0);

  if (!isOpen) return null;

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSelectedFileCount(files.length);
    setIsProcessing(true);
    try {
      await importLocalAudioFiles(files);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 600);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
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
            <Upload className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-sans">
              Import Local Audio Tracks
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4 text-xs">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-lg p-8 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*,.mp3,.wav,.ogg,.m4a"
              onChange={handleFilesSelected}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-colors">
              <Music className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div>
              <p className="font-semibold text-slate-200 text-sm">
                Click to browse audio files
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports MP3, WAV, OGG, M4A, FLAC
              </p>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded p-3 text-left space-y-1 text-[11px] text-slate-400 font-mono">
            <p className="text-slate-300 font-semibold font-sans">Privacy & Storage Notice:</p>
            <p>• Audio is parsed client-side via Web Audio / Blob URLs.</p>
            <p>• No audio is uploaded to any remote server or external cloud.</p>
            <p>• Track metadata is indexed directly into the TuneFlow SongHashMap.</p>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Processing {selectedFileCount} audio tracks...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
