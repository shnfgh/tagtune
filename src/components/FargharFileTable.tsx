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
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const FargharCloseIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FargharFileIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const FargharStatusBadge: React.FC<{ status: Farghar.AudioFile['status']; modified: boolean }> = ({ status, modified }) => {
  const config = {
    loading: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'Loading' },
    ready: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Ready' },
    editing: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Editing' },
    done: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Done' },
    error: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Error' },
  };
  const c = modified ? { bg: 'bg-orange-500/20', text: 'text-orange-300', label: 'Mod' } : config[status];
  return <span className={`farghar-badge ${c.bg} ${c.text} text-[9px] min-[360px]:text-[10px] whitespace-nowrap`}>{c.label}</span>;
};

export const FargharFileTable: React.FC<FargharFileTableProps> = ({ files, selectedFileId, onSelectFile, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="farghar-card p-3 min-[360px]:p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3 min-[360px]:mb-4 gap-2">
        <h2 className="text-sm min-[360px]:text-base sm:text-lg font-semibold flex items-center gap-1.5 min-[360px]:gap-2" style={{ color: 'var(--farghar-text)' }}>
          <FargharFileIcon />
          File List
        </h2>
        <span className="farghar-badge text-[10px] min-[360px]:text-xs" style={{ backgroundColor: 'var(--farghar-glass-bg)', color: 'var(--farghar-text-secondary)' }}>{files.length} files</span>
      </div>

      {/* Desktop Table (>= 768px) */}
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
                  className={`cursor-pointer transition-all duration-200 farghar-native-touch ${isSelected ? 'bg-purple-500/10' : ''}`}
                  style={{ borderBottom: '1px solid var(--farghar-glass-border)' }}
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
                    <span className="farghar-badge bg-blue-500/20 text-blue-300 text-[10px]">{file.format.toUpperCase()}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm" style={{ color: 'var(--farghar-text-muted)' }}>{FargharTagProcessor.formatDuration(file.duration)}</span>
                  </td>
                  <td className="py-3 px-2"><FargharStatusBadge status={file.status} modified={file.modified} /></td>
                  <td className="py-3 px-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveFile(file.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors farghar-native-touch min-h-[32px] min-w-[32px] flex items-center justify-center"
                      style={{ color: 'var(--farghar-text-muted)' }}
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

      {/* Mobile List (< 768px) - ultra compact */}
      <div className="md:hidden space-y-1.5 min-[360px]:space-y-2">
        {files.map((file, index) => {
          const coverUrl = file.covers.length > 0 ? FargharTagProcessor.coverToDataUrl(file.covers[0]) : '';
          const isSelected = file.id === selectedFileId;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`
                p-2 min-[360px]:p-3 rounded-lg min-[360px]:rounded-xl cursor-pointer transition-all duration-200 farghar-native-touch
                ${isSelected ? 'bg-purple-500/10 border border-purple-500/30' : ''}
              `}
              style={!isSelected ? { backgroundColor: 'var(--farghar-glass-bg)' } : undefined}
            >
              {/* Row 1: Index + Cover + Title/Artist + Status */}
              <div className="flex items-center gap-2 min-[360px]:gap-3">
                <span className="text-[10px] min-[360px]:text-xs w-3 min-[360px]:w-5 flex-shrink-0" style={{ color: 'var(--farghar-text-muted)' }}>{index + 1}</span>
                <div className="w-8 min-[360px]:w-10 h-8 min-[360px]:h-10 rounded-md min-[360px]:rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--farghar-glass-bg)' }}>
                  {coverUrl ? (
                    <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--farghar-text-muted)' }}><FargharMusicSmallIcon /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs min-[360px]:text-sm truncate" style={{ color: 'var(--farghar-text)' }}>{file.tags.title || file.name}</p>
                  <p className="text-[10px] min-[360px]:text-xs truncate" style={{ color: 'var(--farghar-text-muted)' }}>{file.tags.artist || '-'}</p>
                </div>
                <FargharStatusBadge status={file.status} modified={file.modified} />
              </div>

              {/* Row 2: Format + Duration + Remove */}
              <div className="flex items-center justify-between mt-1.5 min-[360px]:mt-2 pt-1.5 min-[360px]:pt-2" style={{ borderTop: '1px solid var(--farghar-glass-border)' }}>
                <div className="flex items-center gap-1 min-[360px]:gap-2 flex-wrap">
                  <span className="farghar-badge bg-blue-500/20 text-blue-300 text-[9px] min-[360px]:text-[10px]">{file.format.toUpperCase()}</span>
                  <span className="text-[10px] min-[360px]:text-xs whitespace-nowrap" style={{ color: 'var(--farghar-text-muted)' }}>{FargharTagProcessor.formatDuration(file.duration)}</span>
                  {file.covers.length > 0 && (
                    <span className="hidden min-[360px]:inline farghar-badge bg-purple-500/20 text-purple-300 text-[10px]">{file.covers.length} cover</span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveFile(file.id); }}
                  className="p-1.5 min-[360px]:p-2 rounded-md min-[360px]:rounded-lg hover:bg-red-500/20 transition-colors farghar-native-touch min-h-[32px] min-w-[32px] flex items-center justify-center flex-shrink-0"
                  style={{ color: 'var(--farghar-text-muted)' }}
                >
                  <FargharCloseIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
