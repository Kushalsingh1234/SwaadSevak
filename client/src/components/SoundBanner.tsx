import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface SoundBannerProps {
  pendingCount: number;
}

export const SoundBanner: React.FC<SoundBannerProps> = ({ pendingCount }) => {
  const [audioEnabled, setAudioEnabled] = useState(soundManager.isEnabled());

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {pendingCount} Pending {pendingCount === 1 ? 'Order' : 'Orders'}
        </span>
      )}

      <button
        onClick={handleToggleAudio}
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          audioEnabled
            ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
        }`}
        title={audioEnabled ? 'Order sound alert is on (Click to mute)' : 'Order sound alert is muted (Click to enable)'}
      >
        {audioEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-orange-600" />
            <span>Sound Alert On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-gray-400" />
            <span>Muted</span>
          </>
        )}
      </button>
    </div>
  );
};
