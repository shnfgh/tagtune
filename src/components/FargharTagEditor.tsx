// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Farghar } from '../types';
import { FargharTagProcessor } from '../utils/tagProcessor';
import { FargharSelect } from './FargharSelect';

interface FargharTagEditorProps {
  file: Farghar.AudioFile;
  onUpdate: (file: Farghar.AudioFile) => void;
  onRemove: (id: string) => void;
}

const FargharImagePlaceholderIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FargharChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const FargharTagEditor: React.FC<FargharTagEditorProps> = ({ file, onUpdate, onRemove }) => {
  const [tags, setTags] = useState<Farghar.AudioTag>({ ...file.tags });
  const [cover, setCover] = useState<Farghar.CoverArt | null>(file.cover);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTags({ ...file.tags }); }, [file.tags, file.id]);
  useEffect(() => { setCover(file.cover); }, [file.cover, file.id]);

  const coverUrl = FargharTagProcessor.coverToDataUrl(cover);

  const handleTagChange = useCallback((field: keyof Farghar.AudioTag, value: string) => {
    setTags(prev => ({ ...prev, [field]: value }));
    const updatedFile = { ...file, tags: { ...file.tags, [field]: value }, modified: true, status: 'editing' as const };
    onUpdate(updatedFile);
  }, [file, onUpdate]);

  const handleCoverUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const coverFile = e.target.files?.[0];
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const newCover: Farghar.CoverArt = { pictureData: uint8Array, mimeType: coverFile.type || 'image/jpeg', description: 'Cover', type: 3 };
      setCover(newCover);
      onUpdate({ ...file, cover: newCover, modified: true, status: 'editing' });
    };
    reader.readAsArrayBuffer(coverFile);
    e.target.value = '';
  }, [file, onUpdate]);

  const handleCoverRemove = useCallback(() => {
    setCover(null);
    onUpdate({ ...file, cover: null, modified: true, status: 'editing' });
  }, [file, onUpdate]);

  return (
    <div className="farghar-card farghar-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div onClick={() => coverInputRef.current?.click()} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 farghar-native-touch">
            {coverUrl ? (
              <>
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs">Change</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-purple-400/50 transition-colors text-gray-500">
                <FargharImagePlaceholderIcon />
              </div>
            )}
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">{file.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="farghar-badge bg-blue-500/20 text-blue-300 text-[10px]">{file.format.toUpperCase()}</span>
              <span className="text-xs text-gray-500">{FargharTagProcessor.formatFileSize(file.size)}</span>
              <span className="text-xs text-gray-500">{FargharTagProcessor.formatDuration(file.duration)}</span>
            </div>
          </div>
        </div>
        <button onClick={() => onRemove(file.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors farghar-native-touch" title="Remove file">
          <FargharCloseIcon />
        </button>
      </div>

      {/* Cover actions */}
      {coverUrl && (
        <div className="flex gap-2 mb-4">
          <button onClick={() => coverInputRef.current?.click()} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors farghar-native-touch">Replace Cover</button>
          <button onClick={handleCoverRemove} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors farghar-native-touch">Remove Cover</button>
        </div>
      )}

      {/* Main Tag Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Title</label>
          <input type="text" value={tags.title} onChange={(e) => handleTagChange('title', e.target.value)} className="farghar-input text-sm" placeholder="Song title..." />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Artist</label>
          <input type="text" value={tags.artist} onChange={(e) => handleTagChange('artist', e.target.value)} className="farghar-input text-sm" placeholder="Artist name..." />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Album</label>
          <input type="text" value={tags.album} onChange={(e) => handleTagChange('album', e.target.value)} className="farghar-input text-sm" placeholder="Album name..." />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Album Artist</label>
          <input type="text" value={tags.albumArtist} onChange={(e) => handleTagChange('albumArtist', e.target.value)} className="farghar-input text-sm" placeholder="Album artist..." />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Track Number</label>
          <input type="text" value={tags.trackNumber} onChange={(e) => handleTagChange('trackNumber', e.target.value)} className="farghar-input text-sm" placeholder="1" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Disc Number</label>
          <input type="text" value={tags.discNumber} onChange={(e) => handleTagChange('discNumber', e.target.value)} className="farghar-input text-sm" placeholder="1" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Genre</label>
          <FargharSelect
            value={tags.genre}
            onChange={(value) => handleTagChange('genre', value)}
            options={Farghar.GENRES.map(g => ({ value: g, label: g }))}
            placeholder="Select genre..."
            searchable={true}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Year / Date</label>
          <input type="text" value={tags.year} onChange={(e) => handleTagChange('year', e.target.value)} className="farghar-input text-sm" placeholder="2024" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Composer</label>
          <input type="text" value={tags.composer} onChange={(e) => handleTagChange('composer', e.target.value)} className="farghar-input text-sm" placeholder="Composer name..." />
        </div>
      </div>

      {/* Advanced Fields Toggle */}
      <button onClick={() => setShowAdvanced(!showAdvanced)} className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 farghar-native-touch">
        <FargharChevronIcon open={showAdvanced} />
        Advanced Fields (Lyricist, Arranger, Producer, Copyright, Publisher, ISRC, BPM, Key)
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 farghar-fade-in">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Lyricist</label>
            <input type="text" value={tags.lyricist} onChange={(e) => handleTagChange('lyricist', e.target.value)} className="farghar-input text-sm" placeholder="Lyricist name..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Arranger</label>
            <input type="text" value={tags.arranger} onChange={(e) => handleTagChange('arranger', e.target.value)} className="farghar-input text-sm" placeholder="Arranger name..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Producer</label>
            <input type="text" value={tags.producer} onChange={(e) => handleTagChange('producer', e.target.value)} className="farghar-input text-sm" placeholder="Producer name..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Copyright</label>
            <input type="text" value={tags.copyright} onChange={(e) => handleTagChange('copyright', e.target.value)} className="farghar-input text-sm" placeholder="Copyright notice..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Publisher</label>
            <input type="text" value={tags.publisher} onChange={(e) => handleTagChange('publisher', e.target.value)} className="farghar-input text-sm" placeholder="Publisher name..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">ISRC</label>
            <input type="text" value={tags.isrc} onChange={(e) => handleTagChange('isrc', e.target.value)} className="farghar-input text-sm" placeholder="US-XXX-XX-XXXXX" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">BPM</label>
            <input type="text" value={tags.bpm} onChange={(e) => handleTagChange('bpm', e.target.value)} className="farghar-input text-sm" placeholder="120" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Key</label>
            <FargharSelect
              value={tags.key}
              onChange={(value) => handleTagChange('key', value)}
              options={Farghar.MUSICAL_KEYS.map(k => ({ value: k, label: k }))}
              placeholder="Select key..."
            />
          </div>
        </div>
      )}

      {/* Lyrics & Comment Toggle */}
      <button onClick={() => setShowLyrics(!showLyrics)} className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 farghar-native-touch">
        <FargharChevronIcon open={showLyrics} />
        Lyrics & Comments
      </button>

      {showLyrics && (
        <div className="grid grid-cols-1 gap-4 mt-4 farghar-fade-in">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Lyrics</label>
            <textarea value={tags.lyrics} onChange={(e) => handleTagChange('lyrics', e.target.value)} className="farghar-input text-sm resize-none h-32" placeholder="Enter lyrics here..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Comment</label>
            <textarea value={tags.comment} onChange={(e) => handleTagChange('comment', e.target.value)} className="farghar-input text-sm resize-none h-20" placeholder="Comments..." />
          </div>
        </div>
      )}

      {/* Status */}
      {file.modified && (
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs text-yellow-400">Unsaved changes - Ready to download</span>
        </div>
      )}
    </div>
  );
};
