// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useCallback, useRef, useState } from 'react';
import { Farghar } from '../types';
import { FargharTagProcessor } from '../utils/tagProcessor';

interface FargharFileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const FargharUploadIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FargharMusicIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const FargharFileUploader: React.FC<FargharFileUploaderProps> = ({ onFilesSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(f => FargharTagProcessor.isSupportedFormat(f.name));
    if (validFiles.length > 0) onFilesSelected(validFiles);
  }, [onFilesSelected, disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      e.target.value = '';
    }
  }, [onFilesSelected]);

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative cursor-pointer rounded-xl min-[360px]:rounded-2xl border-2 border-dashed p-4 min-[360px]:p-6 sm:p-12
        transition-all duration-300 text-center farghar-native-touch
        ${isDragging ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={!isDragging ? { borderColor: 'var(--farghar-glass-border)' } : undefined}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".mp3,.mp4,.m4a,.wav,.flac,.ogg,.mkv,.mov,.flv"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-2 min-[360px]:gap-3 sm:gap-4">
        <div
          className={`
            w-11 min-[360px]:w-14 sm:w-20 h-11 min-[360px]:h-14 sm:h-20 rounded-xl min-[360px]:rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${isDragging ? 'farghar-gradient scale-110 text-white' : ''}
          `}
          style={!isDragging ? {
            backgroundColor: 'var(--farghar-btn-bg)',
            color: 'var(--farghar-text)',
          } : undefined}
        >
          {isDragging ? <FargharUploadIcon size={24} /> : <FargharMusicIcon size={24} />}
        </div>
        <div>
          <h3 className="text-xs min-[360px]:text-base sm:text-xl font-semibold mb-1 min-[360px]:mb-1.5 sm:mb-2 px-2" style={{ color: 'var(--farghar-text)' }}>
            {isDragging ? 'Drop files here!' : 'Drag & drop audio/video files'}
          </h3>
          <p className="text-[10px] min-[360px]:text-xs sm:text-sm mb-2 min-[360px]:mb-3 sm:mb-4" style={{ color: 'var(--farghar-text-muted)' }}>Or click to select files</p>
          {/* Format badges - hidden on ultra-small screens */}
          <div className="hidden min-[360px]:flex flex-wrap justify-center gap-1 min-[360px]:gap-1.5 sm:gap-2">
            {Farghar.SUPPORTED_FORMATS.map(format => (
              <span
                key={format}
                className="farghar-badge text-[9px] min-[360px]:text-[10px] sm:text-xs"
                style={{
                  backgroundColor: 'var(--farghar-glass-bg)',
                  color: 'var(--farghar-text-muted)',
                  border: '1px solid var(--farghar-glass-border)',
                }}
              >
                .{format}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-2 min-[360px]:top-3 sm:top-4 left-2 min-[360px]:left-3 sm:left-4 w-1.5 min-[360px]:w-2 h-1.5 min-[360px]:h-2 rounded-full bg-purple-400/50 animate-pulse" />
      <div className="absolute bottom-2 min-[360px]:bottom-3 sm:bottom-4 right-2 min-[360px]:right-3 sm:right-4 w-1.5 min-[360px]:w-2 h-1.5 min-[360px]:h-2 rounded-full bg-blue-400/50 animate-pulse" />
      <div className="absolute top-2 min-[360px]:top-3 sm:top-4 right-2 min-[360px]:right-3 sm:right-4 w-1 min-[360px]:w-1.5 h-1 min-[360px]:h-1.5 rounded-full bg-pink-400/50 animate-pulse" />
    </div>
  );
};
