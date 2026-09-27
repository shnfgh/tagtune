// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState } from 'react';
import { Farghar } from '../types';
import { FargharTagProcessor } from '../utils/tagProcessor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface FargharDownloadSectionProps {
  files: Farghar.AudioFile[];
}

const FargharDownloadIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FargharSaveIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const FargharPackageIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const FargharGearIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const FargharDownloadSection: React.FC<FargharDownloadSectionProps> = ({ files }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const modifiedFiles = files.filter(f => f.modified);

  const handleDownloadSingle = async (file: Farghar.AudioFile) => {
    try {
      const blob = await FargharTagProcessor.writeTags(file.file, file.tags, file.covers);
      const fileName = file.name.endsWith('.mp3') ? file.name : file.name.replace(/\.[^.]+$/, '.mp3');
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDownloadAll = async () => {
    if (modifiedFiles.length === 0) return;
    setIsDownloading(true);
    setProgress(0);
    try {
      const zip = new JSZip();
      for (let i = 0; i < modifiedFiles.length; i++) {
        const file = modifiedFiles[i];
        const blob = await FargharTagProcessor.writeTags(file.file, file.tags, file.covers);
        const fileName = file.name.endsWith('.mp3') ? file.name : file.name.replace(/\.[^.]+$/, '.mp3');
        zip.file(fileName, blob);
        setProgress(Math.round(((i + 1) / modifiedFiles.length) * 100));
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'FargharTagEditor-Export.zip');
    } catch (error) {
      console.error('ZIP download error:', error);
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="farghar-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FargharSaveIcon />
            Download Output
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {modifiedFiles.length > 0 ? `${modifiedFiles.length} modified file(s) ready for download` : 'No files have been modified'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {modifiedFiles.length > 1 && (
            <button onClick={handleDownloadAll} disabled={isDownloading || modifiedFiles.length === 0} className="farghar-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 farghar-native-touch">
              {isDownloading ? <><FargharGearIcon /> {progress}%</> : <><FargharPackageIcon /> Download ZIP</>}
            </button>
          )}
          {modifiedFiles.map(file => (
            <button key={file.id} onClick={() => handleDownloadSingle(file)} className="farghar-btn-secondary text-sm flex items-center gap-2 farghar-native-touch">
              <FargharDownloadIcon />
              <span className="truncate max-w-[100px]">{file.tags.title || file.name}</span>
            </button>
          ))}
        </div>
      </div>
      {isDownloading && (
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full farghar-gradient rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Processing {progress}% ...</p>
        </div>
      )}
    </div>
  );
};
