import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.tsx';

interface AudioReadoutButtonProps {
  textToRead: string;
  label?: string;
}

/**
 * Accessible text-to-speech button using browser SpeechSynthesis for workers with limited literacy.
 *
 * @param {AudioReadoutButtonProps} props - Component props
 * @returns {React.ReactElement} Rendered audio readout button
 */
export function AudioReadoutButton({
  textToRead,
  label,
}: AudioReadoutButtonProps): React.ReactElement {
  const { t, speakText, isSpeaking, stopSpeaking } = useI18n();

  const handleToggle = (): void => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(textToRead);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label || t.listenToSummary}
      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-teal-700 animate-pulse" aria-hidden="true" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
          <span>{label || t.readAloud}</span>
        </>
      )}
    </button>
  );
}
