import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAudioPlayer();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-slate-700';
        let iconColor = 'text-sky-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning' || toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/40';
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#0f141d]/95 backdrop-blur border ${borderClass} rounded-lg shadow-xl p-3 flex items-start gap-3 transition-all transform translate-y-0`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100 font-sans">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-slate-400 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
