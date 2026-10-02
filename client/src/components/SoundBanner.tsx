import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, BellRing } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface SoundBannerProps {
  pendingCount: number;
}

export const SoundBanner: React.FC<SoundBannerProps> = ({ pendingCount }) => {
  const [audioEnabled, setAudioEnabled] = useState(soundManager.isEnabled());

  useEffect(() => {
    if (pendingCount > 0 && audioEnabled) {
      soundManager.startPendingLoop();
    } else {
      soundManager.stopPendingLoop();
    }
  }, [pendingCount, audioEnabled]);

  const handleToggleAudio = () => {
    if (!audioEnabled) {
      const ok = soundManager.enableAudio();
      setAudioEnabled(ok);
    } else {
      soundManager.stopPendingLoop();
      setAudioEnabled(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-semibold animate-pulse">
          <BellRing className="w-3.5 h-3.5 animate-bounce" />
          <span>{pendingCount} Pending Order{pendingCount > 1 ? 's' : ''}</span>
        </div>
      )}

      <button
        onClick={handleToggleAudio}
        type="button"
        title={audioEnabled ? 'Sound alert enabled (Click to mute)' : 'Click to enable order sound alerts'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          audioEnabled
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 animate-pulse'
        }`}
      >
        {audioEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sound ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-orange-600" />
            <span>Enable Ting Alert</span>
          </>
        )}
      </button>
    </div>
  );
};
