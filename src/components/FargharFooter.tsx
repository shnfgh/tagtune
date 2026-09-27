// TagTune - Online MP3 Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';

const FargharMusicNoteIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const FargharFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 farghar-gradient rounded-lg flex items-center justify-center text-white">
                <FargharMusicNoteIcon />
              </div>
              <span className="font-bold farghar-gradient-text">TagTune</span>
            </div>
            <p className="text-sm text-gray-400">
              Online music tag and cover editor.
              <br />
              Tag it. Tune it. Done.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>ID3v1 & ID3v2 tag editing</li>
              <li>Album cover management</li>
              <li>Batch editing for multiple files</li>
              <li>Single or ZIP download</li>
              <li>Completely local processing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Security & Privacy</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>All processing happens in your browser</li>
              <li>No files are sent to any server</li>
              <li>Files are deleted after download</li>
              <li>No registration required</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Designed & Architected by <span className="text-purple-400 font-medium">Farghar</span>
          </p>
          <p className="text-xs text-gray-500">
            TagTune - Online MP3 Tag Editor {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};
