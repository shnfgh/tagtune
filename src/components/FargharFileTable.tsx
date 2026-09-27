// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';
import { Farghar } from '../types';
import { FargharTagProcessor } from '../utils/tagProcessor';

interface FargharFileTableProps {
  files: Farghar.AudioFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onRemoveFile: (id: string) => void;
}

const FargharMusicSmallIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FargharStatusBadge: React.FC<{ status: Farghar.AudioFile['status']; modified: boolean }> = ({ status, modified }) => {
  const config = {
    loading: { bg: 'rgba(234, 179, 8, 0.2)', text: '#fde047', label: 'Loading' },
    ready: { bg: 'rgba(34, 197, 94, 0.2)', text: '#86efac', label: 'Ready' },
    editing: { bg: 'rgba(59, 130, 246, 0.2)', text: '#93c5fd', label: 'Editing' },
    done: { bg: 'rgba(16, 185, 129, 0.2)', text: '#6ee7b7', label: 'Done' },
    error: { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', label: 'Error' },
  };
  const c = modified ? { bg: 'rgba(249, 115, 22, 0.2)', text: '#fdba74', label: 'Modified' } : config[status];
  return <span className="farghar-badge text-[10px]" style={{ backgroundColor: c.bg, color: c.text }}>{c.label}</span>;
};

export const FargharFileTable: React.FC<FargharFileTableProps> = ({ files, selectedFileId, onSelectFile, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="farghar-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--farghar-text)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          File List
        </h2>
        <span className="farghar-badge" style={{ backgroundColor: 'var(--farghar-glass-bg)', color: 'var(--farghar-text-secondary)' }}>{files.length} files</span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs" style={{ color: 'var(--farghar-text-muted)', borderBottom: '1px solid var(--farghar-glass-border)' }}>
              <th className="text-right py-3 px-2 w-10">#</th>
              <th className="text-right py-3 px-2">Cover</th>
              <th className="text-right py-3 px-2">Title</th>
              <th className="text-right py-3 px-2">Artist</th>
              <th className="text-right py-3 px-2">Album</th>
              <th className="text-right py-3 px-2">Album Artist</th>
              <th className="text-right py-3 px-2">Track</th>
              <th className="text-right py-3 px-2">Format</th>
              <th className="text-right py-3 px-2">Duration</th>
              <th className="text-right py-3 px-2">Status</th>
              <th className="text-right py-3 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => {
              const coverUrl = file.covers.length > 0 ? FargharTagProcessor.coverToDataUrl(file.covers[0]) : '';
              const isSelected = file.id === selectedFileId;
              return (
                <tr
                  key={file.id}
                  onClick={() => onSelectFile(file.id)}
                  className="cursor-pointer transition-all duration-200 farghar-native-touch"
                  style={{ borderBottom: '1px solid var(--farghar-glass-border)', backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.1)' : undefined }}
                >
                  <td className="py-3 px-2 text-sm" style={{ color: 'var(--farghar-text-muted)' }}>{index + 1}</td>
                  <td className="py-3 px-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
                      {coverUrl ? (
                        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--farghar-text-muted)' }}><FargharMusicSmallIcon /></div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm truncate block max-w-[200px]" style={{ color: 'var(--farghar-text)' }}>{file.tags.title || file.name}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm truncate block max-w-[150px]" style={{ color: 'var(--farghar-text-secondary)' }}>{file.tags.artist || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm truncate block max-w-[150px]" style={{ color: 'var(--farghar-text-secondary)' }}>{file.tags.album || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm truncate block max-w-[150px]" style={{ color: 'var(--farghar-text-secondary)' }}>{file.tags.albumArtist || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm truncate block max-w-[100px]" style={{ color: 'var(--farghar-text-secondary)' }}>{file.tags.trackNumber || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="farghar-badge text-[10px]" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>{file.format.toUpperCase()}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm" style={{ color: 'var(--farghar-text-muted)' }}>{FargharTagProcessor.formatDuration(file.duration)}</span>
                  </td>
                  <td className="py-3 px-2"><FargharStatusBadge status={file.status} modified={file.modified} /></td>
                  <td className="py-3 px-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveFile(file.id); }}
                      className="p-1.5 rounded-lg transition-colors farghar-native-touch"
                      style={{ color: 'var(--farghar-text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FargharCloseIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-2">
        {files.map((file, index) => {
          const coverUrl = file.covers.length > 0 ? FargharTagProcessor.coverToDataUrl(file.covers[0]) : '';
          const isSelected = file.id === selectedFileId;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 farghar-native-touch"
              style={{
                backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.1)' : 'var(--farghar-glass-bg)',
                border: isSelected ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent'
              }}
            >
              <span className="text-xs w-5" style={{ color: 'var(--farghar-text-muted)' }}>{index + 1}</span>
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
                {coverUrl ? (
                  <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--farghar-text-muted)' }}><FargharMusicSmallIcon /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: 'var(--farghar-text)' }}>{file.tags.title || file.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--farghar-text-muted)' }}>{file.tags.artist || '-'}</p>
              </div>
              <FargharStatusBadge status={file.status} modified={file.modified} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
