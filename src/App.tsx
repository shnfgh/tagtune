/**
 * TagTune - Online MP3 Tag Editor
 * Designed & Architected by Farghar
 * Namespace: Farghar
 *
 * Tag it. Tune it. Done.
 * تگ بزن، تنظیم کن، تمام.
 */

import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Farghar } from './types';
import { FargharTagProcessor } from './utils/tagProcessor';
import { FargharHeader } from './components/FargharHeader';
import { FargharFileUploader } from './components/FargharFileUploader';
import { FargharFileTable } from './components/FargharFileTable';
import { FargharHero } from './components/FargharHero';
import { FargharFooter } from './components/FargharFooter';
import { FargharSkeletonLoader, FargharSkeletonCard } from './components/FargharSkeleton';

// Lazy loaded components for performance
const FargharTagEditor = lazy(() => import('./components/FargharTagEditor').then(m => ({ default: m.FargharTagEditor })));
const FargharBatchEditor = lazy(() => import('./components/FargharBatchEditor').then(m => ({ default: m.FargharBatchEditor })));
const FargharDownloadSection = lazy(() => import('./components/FargharDownloadSection').then(m => ({ default: m.FargharDownloadSection })));

function FargharApp() {
  const [files, setFiles] = useState<Farghar.AudioFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Process uploaded files
  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setIsLoading(true);

    for (const file of newFiles) {
      const id = FargharTagProcessor.generateId();
      const format = FargharTagProcessor.getFormat(file.name);

      // Add file with loading state
      const audioFile: Farghar.AudioFile = {
        id,
        file,
        name: file.name,
        size: file.size,
        format,
        tags: { ...Farghar.EMPTY_TAG },
        cover: null,
        duration: 0,
        status: 'loading',
        modified: false,
      };

      setFiles(prev => [...prev, audioFile]);

      // Read tags asynchronously
      try {
        const { tags, cover, duration } = await FargharTagProcessor.readTags(file);
        setFiles(prev => prev.map(f =>
          f.id === id
            ? { ...f, tags, cover, duration, status: 'ready' as const }
            : f
        ));
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        setFiles(prev => prev.map(f =>
          f.id === id ? { ...f, status: 'error' as const } : f
        ));
      }
    }

    setIsLoading(false);
  }, []);

  // Update single file
  const handleFileUpdate = useCallback((updatedFile: Farghar.AudioFile) => {
    setFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
  }, []);

  // Remove file
  const handleFileRemove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  }, [selectedFileId]);

  // Batch update
  const handleBatchUpdate = useCallback((updates: Partial<Farghar.AudioTag>) => {
    setFiles(prev => prev.map(f => ({
      ...f,
      tags: { ...f.tags, ...updates },
      modified: true,
      status: 'editing' as const,
    })));
  }, []);

  // Clear all files
  const handleClearAll = useCallback(() => {
    setFiles([]);
    setSelectedFileId(null);
  }, []);

  // Select first file if none selected
  useEffect(() => {
    if (!selectedFileId && files.length > 0) {
      setSelectedFileId(files[0].id);
    }
  }, [files, selectedFileId]);

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <FargharHeader fileCount={files.length} />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Hero section - shown when no files */}
          <FargharHero hasFiles={files.length > 0} />

          {/* File uploader */}
          <div className="mb-6">
            <FargharFileUploader
              onFilesSelected={handleFilesSelected}
              disabled={isLoading}
            />
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="mb-6">
              <FargharSkeletonLoader rows={3} />
            </div>
          )}

          {/* File table */}
          {files.length > 0 && (
            <div className="space-y-6">
              <FargharFileTable
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={setSelectedFileId}
                onRemoveFile={handleFileRemove}
              />

              {/* Batch editor */}
              <Suspense fallback={<FargharSkeletonCard />}>
                <FargharBatchEditor
                  files={files}
                  onBatchUpdate={handleBatchUpdate}
                />
              </Suspense>

              {/* Tag editor for selected file */}
              {selectedFile && (
                <Suspense fallback={<FargharSkeletonCard />}>
                  <FargharTagEditor
                    file={selectedFile}
                    onUpdate={handleFileUpdate}
                    onRemove={handleFileRemove}
                  />
                </Suspense>
              )}

              {/* Download section */}
              <Suspense fallback={<FargharSkeletonCard />}>
                <FargharDownloadSection files={files} />
              </Suspense>

              {/* Clear all button */}
              <div className="text-center">
                <button
                  onClick={handleClearAll}
                  className="farghar-btn-danger text-sm"
                >
                  🗑️ پاک کردن همه فایل‌ها
                </button>
              </div>
            </div>
          )}
        </main>

        <FargharFooter />
      </div>
    </div>
  );
}

export default FargharApp;
