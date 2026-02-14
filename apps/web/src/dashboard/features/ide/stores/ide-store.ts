import { create } from 'zustand';
import type { FileMetadata } from '@/shared/types';
import { INITIAL_FILES } from '../data/initial-files';
import { normalizeFileTree } from '../utils/file-normalization';

const { files: initialFiles, fileContents: initialContents } = normalizeFileTree(INITIAL_FILES);

interface IdeState {
  files: Record<string, FileMetadata>;
  fileContents: Record<string, string>;
  activeFileId: string | null;
  openFileIds: string[];

  setFiles: (files: Record<string, FileMetadata>) => void;
  setFileContents: (contents: Record<string, string>) => void;
  replaceFileTree: (tree: import('@/shared/types').FileNode[], entryFileId?: string) => void;
  setOpenFileIds: (ids: string[]) => void;
  setActiveFile: (id: string | null) => void;
  openFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  toggleFolder: (folderId: string) => void;
  deleteNode: (nodeId: string) => void;
}

export const useIdeStore = create<IdeState>(set => ({
  files: initialFiles,
  fileContents: initialContents,
  activeFileId: 'main',
  openFileIds: ['main'],

  setFiles: files => set({ files }),
  setFileContents: contents => set({ fileContents: contents }),
  replaceFileTree: (tree, entryFileId) =>
    set(() => {
      const { files, fileContents } = normalizeFileTree(tree);
      const rootIds = Object.values(files)
        .filter(f => f.parentId === null)
        .map(f => f.id);
      const firstFileId =
        entryFileId ?? rootIds[0] ?? Object.values(files).find(f => f.type === 'file')?.id ?? null;
      return {
        files,
        fileContents,
        activeFileId: firstFileId,
        openFileIds: firstFileId ? [firstFileId] : [],
      };
    }),
  setOpenFileIds: ids => set({ openFileIds: ids }),
  setActiveFile: id => set({ activeFileId: id }),

  openFile: fileId =>
    set(state => {
      if (state.openFileIds.includes(fileId)) {
        return { activeFileId: fileId };
      }
      return {
        openFileIds: [...state.openFileIds, fileId],
        activeFileId: fileId,
      };
    }),

  closeFile: fileId =>
    set(state => {
      const newOpenIds = state.openFileIds.filter(id => id !== fileId);
      let newActiveId = state.activeFileId;
      if (state.activeFileId === fileId) {
        newActiveId = newOpenIds.length > 0 ? (newOpenIds[newOpenIds.length - 1] ?? null) : null;
      }
      return { openFileIds: newOpenIds, activeFileId: newActiveId };
    }),

  updateFileContent: (fileId, content) =>
    set(state => ({
      fileContents: { ...state.fileContents, [fileId]: content },
    })),

  toggleFolder: folderId =>
    set(state => {
      const meta = state.files[folderId];
      if (!meta || meta.type !== 'folder') return state;
      return {
        files: {
          ...state.files,
          [folderId]: { ...meta, isOpen: !meta.isOpen },
        },
      };
    }),

  deleteNode: nodeId =>
    set(state => {
      const meta = state.files[nodeId];
      if (!meta) return state;

      const newFiles = { ...state.files };
      delete newFiles[nodeId];

      if (meta.parentId !== null) {
        const parent = newFiles[meta.parentId];
        if (parent) {
          newFiles[meta.parentId] = {
            ...parent,
            childrenIds: parent.childrenIds.filter(id => id !== nodeId),
          };
        }
      }

      const newContents = { ...state.fileContents };
      delete newContents[nodeId];

      const openFileIds = state.openFileIds.filter(id => id !== nodeId);
      let activeFileId = state.activeFileId;
      if (state.activeFileId === nodeId) {
        activeFileId =
          openFileIds.length > 0 ? (openFileIds[openFileIds.length - 1] ?? null) : null;
      }

      return {
        files: newFiles,
        fileContents: newContents,
        openFileIds,
        activeFileId,
      };
    }),
}));
