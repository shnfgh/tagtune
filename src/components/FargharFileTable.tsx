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
    loading: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'Loading' },
    ready: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Ready' },
    editing: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Editing' },
    done: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Done' },
    error: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Error' },
  };
  const c = modified ? { bg: 'bg-orange-500/20', text: 'text-orange-300', label: 'Modified' } : config[status];
  return <span className={`farghar-badge ${c.bg} ${c.text} text-[10px]`}>{c.label}</span>;
};

export const FargharFileTable: React.FC<FargharFileTableProps> = ({ files, selectedFileId, onSelectFile, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="farghar-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          File List
        </h2>
        <span className="farghar-badge bg-white/10 text-gray-300">{files.length} files</span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-white/10">
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
                  className={`border-b border-white/5 cursor-pointer transition-all duration-200 farghar-native-touch ${isSelected ? 'bg-purple-500/10' : 'hover:bg-white/5'}`}
                >
                  <td className="py-3 px-2 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                      {coverUrl ? (
                        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500"><FargharMusicSmallIcon /></div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-white truncate block max-w-[200px]">{file.tags.title || file.name}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-300 truncate block max-w-[150px]">{file.tags.artist || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-300 truncate block max-w-[150px]">{file.tags.album || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-300 truncate block max-w-[150px]">{file.tags.albumArtist || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-300 truncate block max-w-[100px]">{file.tags.trackNumber || '-'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="farghar-badge bg-blue-500/20 text-blue-300 text-[10px]">{file.format.toUpperCase()}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-400">{FargharTagProcessor.formatDuration(file.duration)}</span>
                  </td>
                  <td className="py-3 px-2"><FargharStatusBadge status={file.status} modified={file.modified} /></td>
                  <td className="py-3 px-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveFile(file.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors farghar-native-touch"
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
              className={`
                flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 farghar-native-touch
                ${isSelected ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-white/5 hover:bg-white/10'}
              `}
            >
              <span className="text-xs text-gray-500 w-5">{index + 1}</span>
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                {coverUrl ? (
                  <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500"><FargharMusicSmallIcon /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.tags.title || file.name}</p>
                <p className="text-xs text-gray-400 truncate">{file.tags.artist || '-'}</p>
              </div>
              <FargharStatusBadge status={file.status} modified={file.modified} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
