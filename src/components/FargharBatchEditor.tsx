// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { Farghar } from '../types';
import { FargharSelect } from './FargharSelect';

interface FargharBatchEditorProps {
  files: Farghar.AudioFile[];
  onBatchUpdate: (updates: Partial<Farghar.AudioTag>) => void;
}

const FargharEditIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const FargharChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const BATCH_FIELDS: { key: keyof Farghar.AudioTag; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'artist', label: 'Artist' },
  { key: 'album', label: 'Album' },
  { key: 'albumArtist', label: 'Album Artist' },
  { key: 'year', label: 'Year' },
  { key: 'genre', label: 'Genre' },
  { key: 'composer', label: 'Composer' },
  { key: 'lyricist', label: 'Lyricist' },
  { key: 'arranger', label: 'Arranger' },
  { key: 'producer', label: 'Producer' },
  { key: 'copyright', label: 'Copyright' },
  { key: 'publisher', label: 'Publisher' },
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

  const handleApply = () => {
    const updates: Partial<Farghar.AudioTag> = {};
    selectedFields.forEach(field => {
      const key = field as keyof Farghar.AudioTag;
      const value = batchTags[key];
      if (value) updates[key] = value;
    });
    if (Object.keys(updates).length > 0) {
      onBatchUpdate(updates);
      setBatchTags({});
      setSelectedFields(new Set());
    }
  };

  if (files.length < 2) return null;

  return (
    <div className="farghar-card">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-right farghar-native-touch">
        <div className="flex items-center gap-2">
          <FargharEditIcon />
          <span className="text-sm font-medium text-white">Batch Edit</span>
          <span className="farghar-badge bg-purple-500/20 text-purple-300 text-[10px]">{files.length} files</span>
        </div>
        <span className="text-gray-400"><FargharChevronIcon open={isOpen} /></span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 farghar-fade-in">
          <p className="text-xs text-gray-400">Select fields to apply to all files:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BATCH_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-start gap-2">
                <input type="checkbox" checked={selectedFields.has(key)} onChange={() => toggleField(key)} className="mt-3 w-4 h-4 rounded accent-purple-500" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                  {key === 'genre' ? (
                    <FargharSelect
                      value={(batchTags as any)[key] || ''}
                      onChange={(value) => setBatchTags(prev => ({ ...prev, [key]: value }))}
                      options={Farghar.GENRES.map(g => ({ value: g, label: g }))}
                      placeholder="Select..."
                      disabled={!selectedFields.has(key)}
                      searchable={true}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(batchTags as any)[key] || ''}
                      onChange={(e) => setBatchTags(prev => ({ ...prev, [key]: e.target.value }))}
                      disabled={!selectedFields.has(key)}
                      className="farghar-input text-sm disabled:opacity-50"
                      placeholder={`New value for ${label}...`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleApply} disabled={selectedFields.size === 0} className="farghar-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm farghar-native-touch">
            Apply changes to {files.length} files
          </button>
        </div>
      )}
    </div>
  );
};
