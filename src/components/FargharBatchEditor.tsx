/**
 * TagTune - Online MP3 Tag Editor
 * Designed & Architected by Farghar
 * Namespace: Farghar
 */

import React, { useState } from 'react';
import { Farghar } from '../types';

interface FargharBatchEditorProps {
  files: Farghar.AudioFile[];
  onBatchUpdate: (updates: Partial<Farghar.AudioTag>) => void;
}

const BATCH_FIELDS: { key: keyof Farghar.AudioTag; label: string; icon: string }[] = [
  { key: 'title', label: 'عنوان', icon: '🎵' },
  { key: 'artist', label: 'هنرمند', icon: '🎤' },
  { key: 'album', label: 'آلبوم', icon: '💿' },
  { key: 'albumArtist', label: 'هنرمند آلبوم', icon: '👤' },
  { key: 'year', label: 'سال', icon: '📅' },
  { key: 'genre', label: 'ژانر', icon: '🎸' },
  { key: 'composer', label: 'آهنگساز', icon: '🎼' },
  { key: 'lyricist', label: 'ترانه‌سرا', icon: '✍️' },
  { key: 'arranger', label: 'تنظیم‌کننده', icon: '🎹' },
  { key: 'producer', label: 'تهیه‌کننده', icon: '🎧' },
  { key: 'copyright', label: 'کپی‌رایت', icon: '©' },
  { key: 'publisher', label: 'ناشر', icon: '🏢' },
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
      if (value) {
        updates[key] = value;
      }
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-right"
      >
        <div className="flex items-center gap-2">
          <span>📝</span>
          <span className="text-sm font-medium text-white">ویرایش گروهی</span>
          <span className="farghar-badge bg-purple-500/20 text-purple-300 text-[10px]">
            {files.length} فایل
          </span>
        </div>
        <span className="text-gray-400">{isOpen ? '▼' : '◀'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 farghar-fade-in">
          <p className="text-xs text-gray-400">
            فیلدهایی که می‌خواهید روی همه فایل‌ها اعمال شوند را انتخاب کنید:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BATCH_FIELDS.map(({ key, label, icon }) => (
              <div key={key} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedFields.has(key)}
                  onChange={() => toggleField(key)}
                  className="mt-3 w-4 h-4 rounded accent-purple-500"
                />
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5">{icon} {label}</label>
                  {key === 'genre' ? (
                    <select
                      value={(batchTags as any)[key] || ''}
                      onChange={(e) => setBatchTags(prev => ({ ...prev, [key]: e.target.value }))}
                      disabled={!selectedFields.has(key)}
                      className="farghar-input text-sm disabled:opacity-50"
                    >
                      <option value="">انتخاب...</option>
                      {Farghar.GENRES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={(batchTags as any)[key] || ''}
                      onChange={(e) => setBatchTags(prev => ({ ...prev, [key]: e.target.value }))}
                      disabled={!selectedFields.has(key)}
                      className="farghar-input text-sm disabled:opacity-50"
                      placeholder={`مقدار جدید برای ${label}...`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            disabled={selectedFields.size === 0}
            className="farghar-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            اعمال تغییرات روی {files.length} فایل
          </button>
        </div>
      )}
    </div>
  );
};
