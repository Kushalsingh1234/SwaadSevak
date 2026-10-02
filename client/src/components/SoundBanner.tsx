import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, BellRing } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface SoundBannerProps {
  pendingCount: number;
}

export const SoundBanner: React.FC<SoundBannerProps> = ({ pendingCount }) => {
  const [audioEnabled, setAudioEnabled] = useState(soundManager.isEnabled());

  // Keep state in sync with sound manager
  useEffect(() => {
    setAudioEnabled(soundManager.isEnabled());
  }, []);

  const handleToggleAudio = () => {
    if (!audioEnabled) {
      soundManager.enableAudio();
      setAudioEnabled(true);
    } else {
      soundManager.disableAudio();
      setAudioEnabled(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-bold animate-pulse">
          <BellRing className="w-3.5 h-3.5 animate-bounce text-amber-600" />
          <span>{pendingCount} Pending Order{pendingCount > 1 ? 's' : ''}</span>
        </div>
      )}

      <button
        onClick={handleToggleAudio}
        type="button"
        title={audioEnabled ? 'Ting audio alert is ON (Click to mute)' : 'Click to un-mute order alerts'}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
          audioEnabled
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 shadow-xs'
            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
        }`}
      >
        {audioEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Ting Alert ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            <span>Muted</span>
          </>
        )}
      </button>
    </div>
  );
};
