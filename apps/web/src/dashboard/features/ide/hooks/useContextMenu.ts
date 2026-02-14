import { useState } from 'react';
import type { FileNode, ContextMenuState } from '@/shared/types';

interface FileManagerApi {
  files: FileNode[];
  setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>;
  openFileIds: string[];
  setOpenFileIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeFileId: string | null;
  setActiveFileId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useContextMenu(fileManager: FileManagerApi) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
    nodeType: null,
  });

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      nodeId: node.id,
      nodeType: node.type,
    });
  };

  const closeContextMenu = () => {
    if (contextMenu.visible) {
      setContextMenu(prev => ({ ...prev, visible: false }));
    }
  };

  const handleContextMenuAction = (action: string) => {
    const nodeId = contextMenu.nodeId;
    if (!nodeId) return;

    const { files, setFiles, openFileIds, setOpenFileIds, activeFileId, setActiveFileId } =
      fileManager;

    if (action === 'delete') {
      const deleteNode = (nodes: FileNode[]): FileNode[] => {
        return nodes
          .filter(n => n.id !== nodeId)
          .map(n => ({
            ...n,
            children: n.children ? deleteNode(n.children) : undefined,
          }));
      };
      setFiles(deleteNode(files));
      const remainingIds = openFileIds.filter(id => id !== nodeId);
      setOpenFileIds(remainingIds);
      if (activeFileId === nodeId) {
        setActiveFileId(
          remainingIds.length > 0 ? (remainingIds[remainingIds.length - 1] ?? null) : null
        );
      }
    } else if (action === 'rename') {
      const newName = prompt('Enter new name:');
      if (newName) {
        const renameNode = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(n => {
            if (n.id === nodeId) return { ...n, name: newName };
            if (n.children) return { ...n, children: renameNode(n.children) };
            return n;
          });
        };
        setFiles(renameNode(files));
      }
    } else if (action === 'new_file' || action === 'new_folder') {
      const name = prompt(`Enter ${action === 'new_file' ? 'file' : 'folder'} name:`);
      if (name) {
        const newNode: FileNode = {
          id: Date.now().toString(),
          name,
          type: action === 'new_file' ? 'file' : 'folder',
          isOpen: true,
          content: action === 'new_file' ? '' : undefined,
          children: action === 'new_file' ? undefined : [],
        };
        const addNode = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(n => {
            if (n.id === nodeId && n.type === 'folder') {
              return {
                ...n,
                children: [...(n.children || []), newNode],
                isOpen: true,
              };
            }
            if (n.children) return { ...n, children: addNode(n.children) };
            return n;
          });
        };
        setFiles(addNode(files));
        if (action === 'new_file') {
          setOpenFileIds(ids => [...ids, newNode.id]);
          setActiveFileId(newNode.id);
        }
      }
    }
    closeContextMenu();
  };

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    handleContextMenuAction,
  };
}
