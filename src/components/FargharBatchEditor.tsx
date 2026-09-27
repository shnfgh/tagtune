// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { Farghar } from '../types';
import { FargharSelect } from './FargharSelect';

interface FargharBatchEditorProps {
  files: Farghar.AudioFile[];
  onBatchUpdate: (updates: Partial<Farghar.AudioTag>) => void;
}

const FargharEditIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const FargharChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type BatchField = { key: keyof Farghar.AudioTag; label: string; type?: 'text' | 'select' | 'textarea' };

const BATCH_FIELDS: BatchField[] = [
  { key: 'title', label: 'Title' },
  { key: 'artist', label: 'Artist' },
  { key: 'album', label: 'Album' },
  { key: 'albumArtist', label: 'Album Artist' },
  { key: 'trackNumber', label: 'Track Number' },
  { key: 'discNumber', label: 'Disc Number' },
  { key: 'genre', label: 'Genre', type: 'select' },
  { key: 'year', label: 'Year' },
  { key: 'composer', label: 'Composer' },
  { key: 'lyricist', label: 'Lyricist' },
  { key: 'arranger', label: 'Arranger' },
  { key: 'producer', label: 'Producer' },
  { key: 'copyright', label: 'Copyright' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'isrc', label: 'ISRC' },
  { key: 'bpm', label: 'BPM' },
  { key: 'key', label: 'Key', type: 'select' },
  { key: 'comment', label: 'Comment', type: 'textarea' },
  { key: 'lyrics', label: 'Lyrics', type: 'textarea' },
];

export const FargharBatchEditor: React.FC<FargharBatchEditorProps> = ({ files, onBatchUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [batchTags, setBatchTags] = useState<Partial<Farghar.AudioTag>>({});
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  const toggleField = (field: string) => {
    setSelectedFields(prev => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  // Apply changes only for selected fields (allows clearing values)
  const handleApply = () => {
    if (selectedFields.size === 0) return;
    const updates: Partial<Farghar.AudioTag> = {};
    selectedFields.forEach(field => {
      const key = field as keyof Farghar.AudioTag;
      updates[key] = batchTags[key] || '';
    });
    onBatchUpdate(updates);
    setBatchTags({});
    setSelectedFields(new Set());
  };

  if (files.length < 2) return null;

  return (
    <div className="farghar-card p-3 min-[360px]:p-4 sm:p-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-right farghar-native-touch gap-2">
        <div className="flex items-center gap-1.5 min-[360px]:gap-2 flex-wrap">
          <FargharEditIcon />
          <span className="text-xs min-[360px]:text-sm font-medium" style={{ color: 'var(--farghar-text)' }}>Batch Edit</span>
          <span className="farghar-badge bg-purple-500/20 text-purple-300 text-[9px] min-[360px]:text-[10px]">{files.length} files</span>
        </div>
        <span style={{ color: 'var(--farghar-text-muted)' }}><FargharChevronIcon open={isOpen} /></span>
      </button>

      {isOpen && (
        <div className="mt-3 min-[360px]:mt-4 space-y-3 min-[360px]:space-y-4 farghar-fade-in">
          <p className="text-[10px] min-[360px]:text-xs" style={{ color: 'var(--farghar-text-muted)' }}>Select fields to apply to all files:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-[360px]:gap-3 sm:gap-4">
            {BATCH_FIELDS.map(({ key, label, type }) => {
              const isSelected = selectedFields.has(key);
              return (
                <div key={key} className="flex items-start gap-1.5 min-[360px]:gap-2 p-1.5 min-[360px]:p-2 sm:p-0 rounded-lg" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleField(key)}
                    className="mt-3 w-3.5 min-[360px]:w-4 h-3.5 min-[360px]:h-4 rounded accent-purple-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>{label}</label>
                    {type === 'select' && key === 'genre' && (
                      <FargharSelect
                        value={(batchTags as any)[key] || ''}
                        onChange={(value) => setBatchTags(prev => ({ ...prev, [key]: value }))}
                        options={Farghar.GENRES.map(g => ({ value: g, label: g }))}
                        placeholder="Select..."
                        disabled={!isSelected}
                        searchable={true}
                        allowCustom={true}
                      />
                    )}
                    {type === 'select' && key === 'key' && (
                      <FargharSelect
                        value={(batchTags as any)[key] || ''}
                        onChange={(value) => setBatchTags(prev => ({ ...prev, [key]: value }))}
                        options={Farghar.MUSICAL_KEYS.map(k => ({ value: k, label: k }))}
                        placeholder="Select..."
                        disabled={!isSelected}
                        searchable={true}
                        allowCustom={true}
                      />
                    )}
                    {type === 'textarea' && (
                      <textarea
                        value={(batchTags as any)[key] || ''}
                        onChange={(e) => setBatchTags(prev => ({ ...prev, [key]: e.target.value }))}
                        disabled={!isSelected}
                        className="farghar-input text-xs min-[360px]:text-sm resize-none h-16 min-[360px]:h-20 disabled:opacity-50"
                        placeholder={`New value for ${label}...`}
                      />
                    )}
                    {(!type || type === 'text') && (
                      <input
                        type="text"
                        value={(batchTags as any)[key] || ''}
                        onChange={(e) => setBatchTags(prev => ({ ...prev, [key]: e.target.value }))}
                        disabled={!isSelected}
                        className="farghar-input text-xs min-[360px]:text-sm disabled:opacity-50"
                        placeholder={`New value for ${label}...`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleApply}
            disabled={selectedFields.size === 0}
            className="farghar-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs min-[360px]:text-sm farghar-native-touch w-full sm:w-auto"
          >
            Apply changes to {files.length} files
          </button>
        </div>
      )}
    </div>
  );
};
