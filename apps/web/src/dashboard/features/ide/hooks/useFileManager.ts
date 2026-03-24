import type { FileNode } from '@/shared/types';
import type { FileMetadata } from '@/shared/types';

import { useIdeStore } from '../stores/ide-store';

/**
 * Build a FileNode-like object from normalized state (for consumers that expect legacy shape, e.g. useChatState).
 */
function getFileFromNormalized(
  files: Record<string, FileMetadata>,
  fileContents: Record<string, string>,
  id: string
): FileNode | undefined {
  const meta = files[id];
  if (!meta) return undefined;
  return {
    id: meta.id,
    name: meta.name,
    type: meta.type,
    language: meta.language || undefined,
    content: meta.type === 'file' ? (fileContents[id] ?? '') : undefined,
    isOpen: meta.isOpen,
  };
}

export function useFileManager() {
  const files = useIdeStore(s => s.files);
  const fileContents = useIdeStore(s => s.fileContents);
  const openFileIds = useIdeStore(s => s.openFileIds);
  const setOpenFileIds = useIdeStore(s => s.setOpenFileIds);
  const activeFileId = useIdeStore(s => s.activeFileId);
  const setActiveFileId = useIdeStore(s => s.setActiveFile);
  const openFile = useIdeStore(s => s.openFile);
  const closeFile = useIdeStore(s => s.closeFile);
  const updateFileContent = useIdeStore(s => s.updateFileContent);
  const toggleFolder = useIdeStore(s => s.toggleFolder);
  const replaceFileTree = useIdeStore(s => s.replaceFileTree);

  const activeFile: FileNode | null =
    activeFileId != null
      ? (getFileFromNormalized(files, fileContents, activeFileId) ?? null)
      : null;

  const handleFileSelect = (fileId: string) => {
    const meta = files[fileId];
    if (meta?.type === 'file') openFile(fileId);
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    closeFile(fileId);
  };

  const handleFileToggle = (folderId: string) => {
    toggleFolder(folderId);
  };

  const handleCodeChange = (newContent: string) => {
    if (!activeFileId) return;
    updateFileContent(activeFileId, newContent);
  };

  return {
    files,
    fileContents,
    replaceFileTree,
    openFileIds,
    setOpenFileIds,
    activeFileId,
    setActiveFileId,
    activeFile,
    getFileFromNormalized,
    handleFileSelect,
    handleCloseTab,
    handleFileToggle,
    handleCodeChange,
  };
}
