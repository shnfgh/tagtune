// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useRef, useCallback } from 'react';
import { Farghar } from '../types';
import { FargharTagProcessor } from '../utils/tagProcessor';
import { FargharSelect } from './FargharSelect';
import { FargharConfirmModal } from './FargharConfirmModal';
import { useFargharSettings } from '../context/FargharSettingsContext';

interface FargharTagEditorProps {
  file: Farghar.AudioFile;
  onUpdate: (file: Farghar.AudioFile) => void;
  onRemove: (id: string) => void;
}

const FargharImagePlaceholderIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FargharChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FargharPlusIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FargharTrashIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const FargharArrowUpIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const FargharArrowDownIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FargharReplaceIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
  </svg>
);

const FargharImageIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const FargharTagEditor: React.FC<FargharTagEditorProps> = ({ file, onUpdate, onRemove }) => {
  const { settings } = useFargharSettings();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showCovers, setShowCovers] = useState(true);
  const [deleteCoverModal, setDeleteCoverModal] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: -1 });
  // Initialize new cover type from user settings default
  const [newCoverType, setNewCoverType] = useState<Farghar.CoverType>(settings.defaultCoverType);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const tags = file.tags;
  const covers = file.covers;

  // Update a single tag field directly on parent
  const handleTagChange = useCallback((field: keyof Farghar.AudioTag, value: string) => {
    onUpdate({
      ...file,
      tags: { ...file.tags, [field]: value },
      modified: true,
      status: 'editing',
    });
  }, [file, onUpdate]);

  // Add a new cover to the file
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
      onUpdate({ ...file, covers: [...file.covers, newCover], modified: true, status: 'editing' });
    };
    reader.readAsArrayBuffer(coverFile);
    e.target.value = '';
  }, [file, onUpdate, newCoverType]);

  // Replace an existing cover
  const handleReplaceCover = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const coverFile = e.target.files?.[0];
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const newCovers = [...file.covers];
      newCovers[index] = { ...newCovers[index], pictureData: uint8Array, mimeType: coverFile.type || 'image/jpeg' };
      onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
    };
    reader.readAsArrayBuffer(coverFile);
    e.target.value = '';
  }, [file, onUpdate]);

  // Confirm cover deletion
  const confirmDeleteCover = useCallback(() => {
    const newCovers = file.covers.filter((_, i) => i !== deleteCoverModal.index);
    onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
    setDeleteCoverModal({ isOpen: false, index: -1 });
  }, [file, deleteCoverModal.index, onUpdate]);

  // Move cover up or down
  const handleMoveCover = useCallback((index: number, direction: 'up' | 'down') => {
    const newCovers = [...file.covers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCovers.length) return;
    [newCovers[index], newCovers[targetIndex]] = [newCovers[targetIndex], newCovers[index]];
    onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
  }, [file, onUpdate]);

  // Change cover type
  const handleCoverTypeChange = useCallback((index: number, coverType: Farghar.CoverType) => {
    const coverTypeInfo = Farghar.COVER_TYPES.find(ct => ct.value === coverType) || Farghar.COVER_TYPES[Farghar.COVER_TYPES.length - 1];
    const newCovers = [...file.covers];
    newCovers[index] = { ...newCovers[index], coverType, type: coverTypeInfo.id3Type, description: coverTypeInfo.label };
    onUpdate({ ...file, covers: newCovers, modified: true, status: 'editing' });
  }, [file, onUpdate]);

  return (
    <div className="farghar-card farghar-slide-up p-2 min-[360px]:p-3 sm:p-6">
      {/* Header: compact on smartwatch, full on larger screens */}
      <div className="flex items-start gap-2 min-[360px]:gap-3 sm:gap-4 mb-3 min-[360px]:mb-5 sm:mb-6">
        {/* Cover preview - ultra-small on smartwatch */}
        <div
          className="w-8 min-[360px]:w-11 sm:w-20 h-8 min-[360px]:h-11 sm:h-20 rounded-md min-[360px]:rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--farghar-glass-bg)', color: 'var(--farghar-text-muted)' }}
        >
          {covers.length > 0 ? (
            <img src={FargharTagProcessor.coverToDataUrl(covers[0])} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <FargharImagePlaceholderIcon />
          )}
        </div>

        {/* File info block */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[11px] min-[360px]:text-sm sm:text-base font-semibold truncate max-w-full sm:max-w-[300px]"
            style={{ color: 'var(--farghar-text)' }}
          >
            {file.name}
          </h3>
          <div className="flex flex-wrap items-center gap-1 min-[360px]:gap-1.5 sm:gap-2 mt-0.5 min-[360px]:mt-1">
            <span className="farghar-badge bg-blue-500/20 text-blue-300 text-[8px] min-[360px]:text-[10px]">{file.format.toUpperCase()}</span>
            {/* File size — respects showFileSizes setting */}
            {settings.showFileSizes && (
              <span className="hidden min-[360px]:inline text-xs whitespace-nowrap" style={{ color: 'var(--farghar-text-muted)' }}>{FargharTagProcessor.formatFileSize(file.size)}</span>
            )}
            <span className="text-[9px] min-[360px]:text-xs whitespace-nowrap" style={{ color: 'var(--farghar-text-muted)' }}>{FargharTagProcessor.formatDuration(file.duration)}</span>
            {/* Cover count badge hidden on smartwatch */}
            {covers.length > 0 && (
              <span className="hidden min-[360px]:inline farghar-badge bg-purple-500/20 text-purple-300 text-[10px]">{covers.length} art</span>
            )}
          </div>
        </div>

        {/* Close button - compact on smartwatch */}
        <button
          onClick={() => onRemove(file.id)}
          className="p-1 min-[360px]:p-1.5 sm:p-2 farghar-icon-btn farghar-native-touch flex-shrink-0 min-h-[28px] min-[360px]:min-h-[36px] min-w-[28px] min-[360px]:min-w-[36px] flex items-center justify-center"
          title="Remove file"
        >
          <FargharCloseIcon />
        </button>
      </div>

      {/* Artwork/Covers Section */}
      <button onClick={() => setShowCovers(!showCovers)} className="w-full flex items-center justify-between mb-2 min-[360px]:mb-4 farghar-native-touch">
        <span className="text-[11px] min-[360px]:text-sm font-medium flex items-center gap-1 min-[360px]:gap-2" style={{ color: 'var(--farghar-text)' }}>
          <FargharImageIcon />
          Artwork ({covers.length})
        </span>
        <span style={{ color: 'var(--farghar-text-muted)' }}><FargharChevronIcon open={showCovers} /></span>
      </button>

      {showCovers && (
        <div className="space-y-2 min-[360px]:space-y-3 mb-3 min-[360px]:mb-6 farghar-fade-in">
          {/* Add new cover - stacked on smartwatch */}
          <div
            className="flex flex-col items-stretch gap-1.5 min-[360px]:gap-2 p-2 min-[360px]:p-3 rounded-xl"
            style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}
          >
            <FargharSelect
              value={newCoverType}
              onChange={(v) => setNewCoverType(v as Farghar.CoverType)}
              options={Farghar.COVER_TYPES.map(ct => ({ value: ct.value, label: ct.label }))}
              placeholder="Select type..."
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              className="farghar-btn-primary text-[11px] min-[360px]:text-sm flex items-center justify-center gap-1.5 min-[360px]:gap-2 flex-shrink-0 farghar-native-touch w-full"
            >
              <FargharPlusIcon />
              Add
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleAddCover} className="hidden" />
          </div>

          {/* Cover list - responsive card layout */}
          {covers.map((cover, index) => {
            const coverUrl = FargharTagProcessor.coverToDataUrl(cover);
            const coverTypeInfo = Farghar.COVER_TYPES.find(ct => ct.value === cover.coverType);
            return (
              <div
                key={index}
                className="p-2 min-[360px]:p-3 rounded-xl space-y-1.5 min-[360px]:space-y-2.5"
                style={{ backgroundColor: 'var(--farghar-glass-bg)', border: '1px solid var(--farghar-glass-border)' }}
              >
                {/* Row 1: Preview + Info */}
                <div className="flex items-center gap-2 min-[360px]:gap-3">
                  <div className="w-8 min-[360px]:w-12 sm:w-14 h-8 min-[360px]:h-12 sm:h-14 rounded-md min-[360px]:rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
                    {coverUrl ? (
                      <img src={coverUrl} alt={cover.description} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--farghar-text-muted)' }}><FargharImagePlaceholderIcon /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] min-[360px]:text-sm truncate" style={{ color: 'var(--farghar-text)' }}>{coverTypeInfo?.label || 'Other'}</p>
                    {/* MIME type hidden on smartwatch */}
                    <p className="hidden min-[360px]:block text-xs truncate" style={{ color: 'var(--farghar-text-muted)' }}>{cover.mimeType}</p>
                  </div>
                </div>

                {/* Row 2: Type selector - full width */}
                <div className="w-full">
                  <FargharSelect
                    value={cover.coverType}
                    onChange={(v) => handleCoverTypeChange(index, v as Farghar.CoverType)}
                    options={Farghar.COVER_TYPES.map(ct => ({ value: ct.value, label: ct.label }))}
                    placeholder="Type..."
                  />
                </div>

                {/* Row 3: Actions - 2x2 grid on smartwatch, horizontal row on larger screens */}
                <div className="grid grid-cols-2 min-[360px]:flex min-[360px]:items-center min-[360px]:justify-end gap-1 min-[360px]:gap-1.5">
                  <label
                    className="p-1 min-[360px]:p-2 farghar-icon-btn farghar-native-touch cursor-pointer min-h-[32px] min-[360px]:min-h-[36px] w-full min-[360px]:w-auto min-[360px]:min-w-[36px] flex items-center justify-center"
                    title="Replace"
                  >
                    <FargharReplaceIcon />
                    <input type="file" accept="image/*" onChange={(e) => handleReplaceCover(index, e)} className="hidden" />
                  </label>
                  <button
                    onClick={() => handleMoveCover(index, 'up')}
                    disabled={index === 0}
                    className="p-1 min-[360px]:p-2 farghar-icon-btn farghar-native-touch disabled:opacity-30 disabled:cursor-not-allowed min-h-[32px] min-[360px]:min-h-[36px] w-full min-[360px]:w-auto min-[360px]:min-w-[36px] flex items-center justify-center"
                    title="Move up"
                  >
                    <FargharArrowUpIcon />
                  </button>
                  <button
                    onClick={() => handleMoveCover(index, 'down')}
                    disabled={index === covers.length - 1}
                    className="p-1 min-[360px]:p-2 farghar-icon-btn farghar-native-touch disabled:opacity-30 disabled:cursor-not-allowed min-h-[32px] min-[360px]:min-h-[36px] w-full min-[360px]:w-auto min-[360px]:min-w-[36px] flex items-center justify-center"
                    title="Move down"
                  >
                    <FargharArrowDownIcon />
                  </button>
                  <button
                    onClick={() => setDeleteCoverModal({ isOpen: true, index })}
                    className="p-1 min-[360px]:p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors farghar-native-touch min-h-[32px] min-[360px]:min-h-[36px] w-full min-[360px]:w-auto min-[360px]:min-w-[36px] flex items-center justify-center"
                    title="Delete"
                  >
                    <FargharTrashIcon />
                  </button>
                </div>
              </div>
            );
          })}

          {covers.length === 0 && (
            <div className="text-center py-3 min-[360px]:py-6 text-[11px] min-[360px]:text-sm" style={{ color: 'var(--farghar-text-muted)' }}>
              No artwork added yet.
            </div>
          )}
        </div>
      )}

      {/* Main Tag Fields */}
      <div className="grid grid-cols-1 gap-2 min-[360px]:gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Title</label>
          <input type="text" value={tags.title} onChange={(e) => handleTagChange('title', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Song title..." />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Artist</label>
          <input type="text" value={tags.artist} onChange={(e) => handleTagChange('artist', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Artist name..." />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Album</label>
          <input type="text" value={tags.album} onChange={(e) => handleTagChange('album', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Album name..." />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Album Artist</label>
          <input type="text" value={tags.albumArtist} onChange={(e) => handleTagChange('albumArtist', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Album artist..." />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Track Number</label>
          <input type="text" value={tags.trackNumber} onChange={(e) => handleTagChange('trackNumber', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="1" />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Disc Number</label>
          <input type="text" value={tags.discNumber} onChange={(e) => handleTagChange('discNumber', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="1" />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Genre</label>
          <FargharSelect value={tags.genre} onChange={(value) => handleTagChange('genre', value)} options={Farghar.GENRES.map(g => ({ value: g, label: g }))} placeholder="Select genre..." searchable={true} allowCustom={true} />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Year / Date</label>
          <input type="text" value={tags.year} onChange={(e) => handleTagChange('year', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="2024" />
        </div>
        <div>
          <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Composer</label>
          <input type="text" value={tags.composer} onChange={(e) => handleTagChange('composer', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Composer name..." />
        </div>
      </div>

      {/* Advanced Fields Toggle */}
      <button onClick={() => setShowAdvanced(!showAdvanced)} className="mt-2 min-[360px]:mt-4 text-[10px] min-[360px]:text-sm transition-colors flex items-center gap-1 farghar-native-touch text-right" style={{ color: 'var(--farghar-text-muted)' }}>
        <FargharChevronIcon open={showAdvanced} />
        Advanced Fields
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 gap-2 min-[360px]:gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 mt-2 min-[360px]:mt-4 farghar-fade-in">
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Lyricist</label>
            <input type="text" value={tags.lyricist} onChange={(e) => handleTagChange('lyricist', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Lyricist name..." />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Arranger</label>
            <input type="text" value={tags.arranger} onChange={(e) => handleTagChange('arranger', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Arranger name..." />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Producer</label>
            <input type="text" value={tags.producer} onChange={(e) => handleTagChange('producer', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Producer name..." />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Copyright</label>
            <input type="text" value={tags.copyright} onChange={(e) => handleTagChange('copyright', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Copyright notice..." />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Publisher</label>
            <input type="text" value={tags.publisher} onChange={(e) => handleTagChange('publisher', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="Publisher name..." />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>ISRC</label>
            <input type="text" value={tags.isrc} onChange={(e) => handleTagChange('isrc', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="US-XXX-XX-XXXXX" />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>BPM</label>
            <input type="text" value={tags.bpm} onChange={(e) => handleTagChange('bpm', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm" placeholder="120" />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Key</label>
            <FargharSelect value={tags.key} onChange={(value) => handleTagChange('key', value)} options={Farghar.MUSICAL_KEYS.map(k => ({ value: k, label: k }))} placeholder="Select key..." allowCustom={true} searchable={true} />
          </div>
        </div>
      )}

      {/* Lyrics & Comment Toggle */}
      <button onClick={() => setShowLyrics(!showLyrics)} className="mt-2 min-[360px]:mt-4 text-[10px] min-[360px]:text-sm transition-colors flex items-center gap-1 farghar-native-touch text-right" style={{ color: 'var(--farghar-text-muted)' }}>
        <FargharChevronIcon open={showLyrics} />
        Lyrics & Comments
      </button>

      {showLyrics && (
        <div className="grid grid-cols-1 gap-2 min-[360px]:gap-3 sm:gap-4 mt-2 min-[360px]:mt-4 farghar-fade-in">
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Lyrics</label>
            <textarea value={tags.lyrics} onChange={(e) => handleTagChange('lyrics', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm resize-none h-20 min-[360px]:h-32" placeholder="Enter lyrics here..." />
          </div>
          <div>
            <label className="block text-[10px] min-[360px]:text-xs mb-1 min-[360px]:mb-1.5" style={{ color: 'var(--farghar-text-muted)' }}>Comment</label>
            <textarea value={tags.comment} onChange={(e) => handleTagChange('comment', e.target.value)} className="farghar-input text-xs min-[360px]:text-sm resize-none h-14 min-[360px]:h-20" placeholder="Comments..." />
          </div>
        </div>
      )}

      {/* Status */}
      {file.modified && (
        <div className="mt-2 min-[360px]:mt-4 flex items-center gap-1.5 min-[360px]:gap-2">
          <div className="w-1.5 min-[360px]:w-2 h-1.5 min-[360px]:h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-[10px] min-[360px]:text-xs text-yellow-400">Unsaved - Ready to download</span>
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
