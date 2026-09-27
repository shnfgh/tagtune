// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Farghar } from '../types';
import { FargharTagProcessor } from '../utils/tagProcessor';
import { FargharSelect } from './FargharSelect';
import { FargharConfirmModal } from './FargharConfirmModal';

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

const FargharPlusIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FargharTrashIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const FargharArrowUpIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const FargharArrowDownIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const FargharTagEditor: React.FC<FargharTagEditorProps> = ({ file, onUpdate, onRemove }) => {
  const [tags, setTags] = useState<Farghar.AudioTag>({ ...file.tags });
  const [covers, setCovers] = useState<Farghar.CoverArt[]>([...file.covers]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCovers, setShowCovers] = useState(true);
  const [deleteCoverModal, setDeleteCoverModal] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: -1 });
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [newCoverType, setNewCoverType] = useState<Farghar.CoverType>('front');

  useEffect(() => { setTags({ ...file.tags }); }, [file.tags, file.id]);
  useEffect(() => { setCovers([...file.covers]); }, [file.covers, file.id]);

  const handleTagChange = useCallback((field: keyof Farghar.AudioTag, value: string) => {
    setTags(prev => ({ ...prev, [field]: value }));
    const updatedFile = { ...file, tags: { ...file.tags, [field]: value }, modified: true, status: 'editing' as const };
    onUpdate(updatedFile);
  }, [file, onUpdate]);

  const handleAddCover = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const coverFile = e.target.files?.[0];
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const coverTypeInfo = Farghar.COVER_TYPES.find(ct => ct.value === newCoverType) || Farghar.COVER_TYPES[Farghar.COVER_TYPES.length - 1];
      const newCover: Farghar.CoverArt = {
        pictureData: uint8Array,
        mimeType: coverFile.type || 'image/jpeg',
        description: coverTypeInfo.label,
        type: coverTypeInfo.id3Type,
        coverType: newCoverType,
      };
      const newCovers = [...covers, newCover];
      setCovers(newCovers);
      onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
    };
    reader.readAsArrayBuffer(coverFile);
    e.target.value = '';
  }, [file, onUpdate, covers, newCoverType]);

  const handleReplaceCover = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const coverFile = e.target.files?.[0];
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const newCovers = [...covers];
      newCovers[index] = { ...newCovers[index], pictureData: uint8Array, mimeType: coverFile.type || 'image/jpeg' };
      setCovers(newCovers);
      onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
    };
    reader.readAsArrayBuffer(coverFile);
    e.target.value = '';
  }, [file, onUpdate, covers]);

  const handleDeleteCover = useCallback((index: number) => {
    setDeleteCoverModal({ isOpen: true, index });
  }, []);

  const confirmDeleteCover = useCallback(() => {
    const newCovers = covers.filter((_, i) => i !== deleteCoverModal.index);
    setCovers(newCovers);
    onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
    setDeleteCoverModal({ isOpen: false, index: -1 });
  }, [covers, deleteCoverModal.index, file, onUpdate]);

  const handleMoveCover = useCallback((index: number, direction: 'up' | 'down') => {
    const newCovers = [...covers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCovers.length) return;
    [newCovers[index], newCovers[targetIndex]] = [newCovers[targetIndex], newCovers[index]];
    setCovers(newCovers);
    onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
  }, [covers, file, onUpdate]);

  const handleCoverTypeChange = useCallback((index: number, coverType: Farghar.CoverType) => {
    const coverTypeInfo = Farghar.COVER_TYPES.find(ct => ct.value === coverType) || Farghar.COVER_TYPES[Farghar.COVER_TYPES.length - 1];
    const newCovers = [...covers];
    newCovers[index] = { ...newCovers[index], coverType, type: coverTypeInfo.id3Type, description: coverTypeInfo.label };
    setCovers(newCovers);
    onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
  }, [covers, file, onUpdate]);

  return (
    <div className="farghar-card farghar-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center text-gray-500 flex-shrink-0">
            {covers.length > 0 ? (
              <img src={FargharTagProcessor.coverToDataUrl(covers[0])} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <FargharImagePlaceholderIcon />
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">{file.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="farghar-badge bg-blue-500/20 text-blue-300 text-[10px]">{file.format.toUpperCase()}</span>
              <span className="text-xs text-gray-500">{FargharTagProcessor.formatFileSize(file.size)}</span>
              <span className="text-xs text-gray-500">{FargharTagProcessor.formatDuration(file.duration)}</span>
              {covers.length > 0 && (
                <span className="farghar-badge bg-purple-500/20 text-purple-300 text-[10px]">{covers.length} artwork(s)</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => onRemove(file.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors farghar-native-touch" title="Remove file">
          <FargharCloseIcon />
        </button>
      </div>

      {/* Artwork/Covers Section */}
      <button onClick={() => setShowCovers(!showCovers)} className="w-full flex items-center justify-between mb-4 farghar-native-touch">
        <span className="text-sm font-medium text-white flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Artwork / Covers ({covers.length})
        </span>
        <FargharChevronIcon open={showCovers} />
      </button>

      {showCovers && (
        <div className="space-y-3 mb-6 farghar-fade-in">
          {/* Add new cover */}
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
            <FargharSelect
              value={newCoverType}
              onChange={(v) => setNewCoverType(v as Farghar.CoverType)}
              options={Farghar.COVER_TYPES.map(ct => ({ value: ct.value, label: ct.label }))}
              placeholder="Select type..."
            />
            <button onClick={() => coverInputRef.current?.click()} className="farghar-btn-primary text-sm flex items-center gap-2 flex-shrink-0 farghar-native-touch">
              <FargharPlusIcon />
              Add
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleAddCover} className="hidden" />
          </div>

          {/* Cover list */}
          {covers.map((cover, index) => {
            const coverUrl = FargharTagProcessor.coverToDataUrl(cover);
            const coverTypeInfo = Farghar.COVER_TYPES.find(ct => ct.value === cover.coverType);
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                {/* Cover preview */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  {coverUrl ? (
                    <img src={coverUrl} alt={cover.description} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><FargharImagePlaceholderIcon /></div>
                  )}
                </div>

                {/* Cover info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{coverTypeInfo?.label || 'Other'}</p>
                  <p className="text-xs text-gray-400">{cover.mimeType}</p>
                </div>

                {/* Cover type selector */}
                <div className="hidden sm:block w-40">
                  <FargharSelect
                    value={cover.coverType}
                    onChange={(v) => handleCoverTypeChange(index, v as Farghar.CoverType)}
                    options={Farghar.COVER_TYPES.map(ct => ({ value: ct.value, label: ct.label }))}
                    placeholder="Type..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <label className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer farghar-native-touch" title="Replace">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
                    </svg>
                    <input type="file" accept="image/*" onChange={(e) => handleReplaceCover(index, e)} className="hidden" />
                  </label>
                  <button onClick={() => handleMoveCover(index, 'up')} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed farghar-native-touch" title="Move up">
                    <FargharArrowUpIcon />
                  </button>
                  <button onClick={() => handleMoveCover(index, 'down')} disabled={index === covers.length - 1} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed farghar-native-touch" title="Move down">
                    <FargharArrowDownIcon />
                  </button>
                  <button onClick={() => handleDeleteCover(index)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors farghar-native-touch" title="Delete">
                    <FargharTrashIcon />
                  </button>
                </div>
              </div>
            );
          })}

          {covers.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500">
              No artwork added yet. Click "Add" to add artwork.
            </div>
          )}
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
            allowCustom={true}
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
              allowCustom={true}
              searchable={true}
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

      {/* Delete Cover Confirmation Modal */}
      <FargharConfirmModal
        isOpen={deleteCoverModal.isOpen}
        title="Remove Artwork"
        message="Are you sure you want to remove this artwork? This action cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteCover}
        onCancel={() => setDeleteCoverModal({ isOpen: false, index: -1 })}
        variant="danger"
      />
    </div>
  );
};
