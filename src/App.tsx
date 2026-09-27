// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
// Professional Music Tag Editor with Native App Experience
import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Farghar } from './types';
import { FargharTagProcessor } from './utils/tagProcessor';
import { FargharHeader } from './components/FargharHeader';
import { FargharFileUploader } from './components/FargharFileUploader';
import { FargharFileTable } from './components/FargharFileTable';
import { FargharHero } from './components/FargharHero';
import { FargharFooter } from './components/FargharFooter';
import { FargharSkeletonLoader, FargharSkeletonCard } from './components/FargharSkeleton';
import { FargharConfirmModal } from './components/FargharConfirmModal';

// Lazy loaded components for performance
const FargharTagEditor = lazy(() => import('./components/FargharTagEditor').then(m => ({ default: m.FargharTagEditor })));
const FargharBatchEditor = lazy(() => import('./components/FargharBatchEditor').then(m => ({ default: m.FargharBatchEditor })));
const FargharDownloadSection = lazy(() => import('./components/FargharDownloadSection').then(m => ({ default: m.FargharDownloadSection })));

const FargharTrashIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// LocalStorage keys
const FARGHAR_STORAGE_KEY = 'farghar_tag_editor_data';

function FargharApp() {
  const [files, setFiles] = useState<Farghar.AudioFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; fileId: string | null; fileName: string }>({ isOpen: false, fileId: null, fileName: '' });
  const [clearAllModal, setClearAllModal] = useState(false);
  
  // Keep File objects in memory (cannot be stored in localStorage)
  const fileObjectsMap = useRef<Map<string, File>>(new Map());

  // Save data to localStorage
  const saveToStorage = useCallback((filesData: Farghar.AudioFile[]) => {
    try {
      const dataToSave = filesData.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        format: f.format,
        tags: f.tags,
        covers: f.covers.map(c => ({ ...c, pictureData: c.pictureData ? Array.from(c.pictureData) : null })),
        duration: f.duration,
        modified: f.modified,
      }));
      localStorage.setItem(FARGHAR_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  // Load data from localStorage
  const loadFromStorage = useCallback((): any[] => {
    try {
      const data = localStorage.getItem(FARGHAR_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return [];
  }, []);

  // Clear storage
  const clearStorage = useCallback(() => {
    localStorage.removeItem(FARGHAR_STORAGE_KEY);
  }, []);

  // Process uploaded files
  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setIsLoading(true);
    const savedData = loadFromStorage();

    for (const file of newFiles) {
      const id = FargharTagProcessor.generateId();
      const format = FargharTagProcessor.getFormat(file.name);

      // Check if this file was previously edited (match by name and size)
      const savedFile = savedData.find(s => s.name === file.name && s.size === file.size);

      const audioFile: Farghar.AudioFile = {
        id, file, name: file.name, size: file.size, format,
        tags: savedFile ? { ...savedFile.tags } : { ...Farghar.EMPTY_TAG },
        covers: savedFile?.covers ? savedFile.covers.map((c: any) => ({ ...c, pictureData: c.pictureData ? new Uint8Array(c.pictureData) : null })) : [],
        duration: savedFile?.duration || 0,
        status: 'loading',
        modified: !!savedFile?.modified,
      };
      setFiles(prev => [...prev, audioFile]);
      
      // Store File object in memory for later download
      fileObjectsMap.current.set(id, file);

      try {
        const { tags, covers, duration } = await FargharTagProcessor.readTags(file);

        // If file was previously edited, keep the edited tags; otherwise use original tags
        if (savedFile && savedFile.modified) {
          setFiles(prev => prev.map(f => f.id === id ? {
            ...f,
            tags: savedFile.tags,
            covers: savedFile.covers ? savedFile.covers.map((c: any) => ({ ...c, pictureData: c.pictureData ? new Uint8Array(c.pictureData) : null })) : covers,
            duration: duration,
            status: 'ready' as const,
          } : f));
        } else {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, tags, covers, duration, status: 'ready' as const } : f));
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' as const } : f));
      }
    }
    setIsLoading(false);
  }, [loadFromStorage]);

  // Update single file
  const handleFileUpdate = useCallback((updatedFile: Farghar.AudioFile) => {
    setFiles(prev => {
      const newFiles = prev.map(f => f.id === updatedFile.id ? updatedFile : f);
      saveToStorage(newFiles);
      return newFiles;
    });
  }, [saveToStorage]);

  // Request file removal (show confirm modal)
  const handleFileRemoveRequest = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setDeleteModal({ isOpen: true, fileId: id, fileName: file.name });
    }
  }, [files]);

  // Confirm file removal
  const handleFileRemoveConfirm = useCallback(() => {
    if (deleteModal.fileId) {
      setFiles(prev => {
        const newFiles = prev.filter(f => f.id !== deleteModal.fileId);
        saveToStorage(newFiles);
        return newFiles;
      });
      if (selectedFileId === deleteModal.fileId) setSelectedFileId(null);
      // Remove File object from memory
      fileObjectsMap.current.delete(deleteModal.fileId);
    }
    setDeleteModal({ isOpen: false, fileId: null, fileName: '' });
  }, [deleteModal.fileId, selectedFileId, saveToStorage]);

  // Cancel file removal
  const handleFileRemoveCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, fileId: null, fileName: '' });
  }, []);

  // Batch update
  const handleBatchUpdate = useCallback((updates: Partial<Farghar.AudioTag>) => {
    setFiles(prev => prev.map(f => ({ ...f, tags: { ...f.tags, ...updates }, modified: true, status: 'editing' as const })));
  }, []);

  // Request clear all (show confirm modal)
  const handleClearAllRequest = useCallback(() => {
    setClearAllModal(true);
  }, []);

  // Confirm clear all
  const handleClearAllConfirm = useCallback(() => {
    setFiles([]);
    setSelectedFileId(null);
    clearStorage();
    fileObjectsMap.current.clear();
    setClearAllModal(false);
  }, [clearStorage]);

  // Cancel clear all
  const handleClearAllCancel = useCallback(() => {
    setClearAllModal(false);
  }, []);

  // Select first file if none selected
  useEffect(() => {
    if (!selectedFileId && files.length > 0) setSelectedFileId(files[0].id);
  }, [files, selectedFileId]);

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gray-950">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen min-h-[100dvh]">
        <FargharHeader fileCount={files.length} />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <FargharHero hasFiles={files.length > 0} />
          <div className="mb-6">
            <FargharFileUploader onFilesSelected={handleFilesSelected} disabled={isLoading} />
          </div>
          {isLoading && <div className="mb-6"><FargharSkeletonLoader rows={3} /></div>}
          {files.length > 0 && (
            <div className="space-y-6">
              <FargharFileTable files={files} selectedFileId={selectedFileId} onSelectFile={setSelectedFileId} onRemoveFile={handleFileRemoveRequest} />
              <Suspense fallback={<FargharSkeletonCard />}>
                <FargharBatchEditor files={files} onBatchUpdate={handleBatchUpdate} />
              </Suspense>
              {selectedFile && (
                <Suspense fallback={<FargharSkeletonCard />}>
                  <FargharTagEditor file={selectedFile} onUpdate={handleFileUpdate} onRemove={handleFileRemoveRequest} />
                </Suspense>
              )}
              <Suspense fallback={<FargharSkeletonCard />}>
                <FargharDownloadSection files={files} fileObjectsMap={fileObjectsMap} />
              </Suspense>
              <div className="text-center">
                <button onClick={handleClearAllRequest} className="farghar-btn-danger text-sm flex items-center gap-2 mx-auto farghar-native-touch">
                  <FargharTrashIcon />
                  Clear All Files
                </button>
              </div>
            </div>
          )}
        </main>
        <FargharFooter />
      </div>

      {/* Delete Confirmation Modal */}
      <FargharConfirmModal
        isOpen={deleteModal.isOpen}
        title="Remove File"
        message={`Are you sure you want to remove "${deleteModal.fileName}"? This action cannot be undone.`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleFileRemoveConfirm}
        onCancel={handleFileRemoveCancel}
        variant="danger"
      />

      {/* Clear All Confirmation Modal */}
      <FargharConfirmModal
        isOpen={clearAllModal}
        title="Clear All Files"
        message="Are you sure you want to remove all files? This action cannot be undone and all edited data will be lost."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        onConfirm={handleClearAllConfirm}
        onCancel={handleClearAllCancel}
        variant="danger"
      />
    </div>
  );
}

export default FargharApp;
