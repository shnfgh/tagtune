// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';

interface FargharHeaderProps {
  fileCount: number;
}

const FargharLogoIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const FargharFolderIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FargharLockIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const FargharHeader: React.FC<FargharHeaderProps> = ({ fileCount }) => {
  return (
    <header className="sticky top-0 z-50 farghar-glass border-b border-white/5 farghar-native-touch">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 farghar-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <FargharLogoIcon />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold farghar-gradient-text">Farghar Tag Editor</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Professional Music Tag Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {fileCount > 0 && (
              <div className="farghar-badge bg-purple-500/20 text-purple-300">
                <span className="mr-1 flex items-center"><FargharFolderIcon /></span>
                {fileCount} files
              </div>
            )}
            <div className="farghar-badge bg-green-500/20 text-green-300">
              <span className="mr-1 flex items-center"><FargharLockIcon /></span>
              <span className="hidden sm:inline">Secure & Local</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
