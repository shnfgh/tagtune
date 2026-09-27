// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';

interface FargharHeroProps {
  hasFiles: boolean;
}

const FargharMusicNoteIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const FargharCheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FargharTagIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const FargharImageIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const FargharLayersIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const FargharShieldIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const features = [
  { icon: FargharTagIcon, label: 'ID3 Tag Editing' },
  { icon: FargharImageIcon, label: 'Cover Management' },
  { icon: FargharLayersIcon, label: 'Batch Editing' },
  { icon: FargharShieldIcon, label: 'Local Processing' },
];

export const FargharHero: React.FC<FargharHeroProps> = ({ hasFiles }) => {
  if (hasFiles) return null;

  return (
    <div className="text-center py-6 sm:py-12 farghar-fade-in">
      <div className="relative inline-block mb-5 sm:mb-6">
        <div className="w-16 h-16 sm:w-24 sm:h-24 farghar-gradient rounded-3xl flex items-center justify-center text-white farghar-pulse-glow">
          <FargharMusicNoteIcon size={40} />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white animate-bounce">
          <FargharCheckIcon />
        </div>
      </div>
      <h2 className="text-xl sm:text-4xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--farghar-text)' }}>Farghar Tag Editor</h2>
      <p className="text-sm sm:text-lg mb-5 sm:mb-6 max-w-xl mx-auto px-4" style={{ color: 'var(--farghar-text-secondary)' }}>
        Free, secure, and no installation required.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto mb-6 sm:mb-8">
        {features.map((feature, i) => (
          <div key={i} className="farghar-glass farghar-glass-hover rounded-xl p-2.5 sm:p-3 text-center farghar-native-touch">
            <span className="flex justify-center mb-1" style={{ color: 'var(--farghar-text-secondary)' }}><feature.icon /></span>
            <span className="text-[11px] sm:text-sm" style={{ color: 'var(--farghar-text-secondary)' }}>{feature.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-4">
        <span className="text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Supported:</span>
        {['MP3', 'MP4', 'M4A', 'WAV', 'FLAC', 'OGG', 'MKV', 'MOV', 'FLV'].map(format => (
          <span key={format} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--farghar-glass-bg)', color: 'var(--farghar-text-muted)', border: '1px solid var(--farghar-glass-border)' }}>{format}</span>
        ))}
      </div>
    </div>
  );
};
