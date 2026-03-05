import {
  ChevronDown,
  ChevronRight,
  Edit2,
  FilePlus,
  FolderPlus,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import type { ContextMenuState } from '@/shared/types';

import { useIdeStore } from '../stores/ide-store';
import { getRootIds } from '../utils/file-normalization';
import { getFileIcon } from '../utils/get-file-icon';

interface FileTreeItemProps {
  id: string;
  level: number;
  onContextMenu: (e: React.MouseEvent, nodeId: string, nodeType: 'file' | 'folder') => void;
}

const FileTreeItem = ({ id, level, onContextMenu }: FileTreeItemProps) => {
  const node = useIdeStore(s => s.files[id]);
  const activeFileId = useIdeStore(s => s.activeFileId);
  const openFile = useIdeStore(s => s.openFile);
  const toggleFolder = useIdeStore(s => s.toggleFolder);

  if (!node) return null;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, node.id, node.type);
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 px-2 cursor-pointer transition-all border-l-2 select-none group
                    ${
                      activeFileId === node.id
                        ? 'bg-nexus-purple/10 border-nexus-purple text-white'
                        : 'border-transparent text-nexus-muted hover:text-white hover:bg-white/5'
                    }
                `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={e => {
          e.stopPropagation();
          if (node.type === 'folder') toggleFolder(node.id);
          else if (node.type === 'file') openFile(node.id);
        }}
        onDoubleClick={e => {
          e.stopPropagation();
          if (node.type === 'file') openFile(node.id);
        }}
        onContextMenu={handleContextMenu}
      >
        <span className="opacity-70 group-hover:opacity-100 transition-opacity">
          {node.type === 'folder' ? (
            node.isOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )
          ) : (
            <div className="w-3" />
          )}
        </span>
        <span className="shrink-0">{getFileIcon(node.name, node.type, node.isOpen)}</span>
        <span className="font-mono text-xs truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && node.isOpen && node.childrenIds.length > 0 && (
        <div>
          {node.childrenIds.map(childId => (
            <FileTreeItem
              key={childId}
              id={childId}
              level={level + 1}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu = ({ state, onClose, onAction }: ContextMenuProps) => {
  if (!state.visible) return null;

  return (
    <div
      className="fixed z-50 bg-nexus-dark border border-nexus-gray shadow-[0_0_20px_rgba(0,0,0,0.8)] w-48 py-1 animate-in fade-in duration-100 flex flex-col"
      style={{ top: state.y, left: state.x }}
      onClick={e => e.stopPropagation()}
    >
      {state.nodeType === 'folder' && (
        <>
          <button
            type="button"
            onClick={() => {
              onClose();
              onAction('new_file');
            }}
            className="text-left px-4 py-2 hover:bg-nexus-purple/20 hover:text-white text-nexus-muted font-mono text-xs flex items-center gap-2"
          >
            <FilePlus size={14} /> New File
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onAction('new_folder');
            }}
            className="text-left px-4 py-2 hover:bg-nexus-purple/20 hover:text-white text-nexus-muted font-mono text-xs flex items-center gap-2"
          >
            <FolderPlus size={14} /> New Folder
          </button>
          <div className="h-[1px] bg-nexus-gray/30 my-1 mx-2" />
        </>
      )}
      <button
        type="button"
        onClick={() => {
          onClose();
          onAction('rename');
        }}
        className="text-left px-4 py-2 hover:bg-nexus-purple/20 hover:text-white text-nexus-muted font-mono text-xs flex items-center gap-2"
      >
        <Edit2 size={14} /> Rename
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onAction('delete');
        }}
        className="text-left px-4 py-2 hover:bg-red-500/20 hover:text-red-400 text-nexus-muted font-mono text-xs flex items-center gap-2"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );
};

export const FileTree = () => {
  const files = useIdeStore(s => s.files);
  const rootIds = useMemo(() => getRootIds(files), [files]);
  const deleteNode = useIdeStore(s => s.deleteNode);

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
    nodeType: null,
  });

  const handleContextMenu = (e: React.MouseEvent, nodeId: string, nodeType: 'file' | 'folder') => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      nodeId,
      nodeType,
    });
  };

  const handleCloseContextMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));

  const handleContextMenuAction = (action: string) => {
    const nodeId = contextMenu.nodeId;
    if (action === 'delete' && nodeId) {
      deleteNode(nodeId);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
    // TODO: wire rename/new file/new folder to store
  };

  return (
    <div className="shrink-0 flex flex-col bg-nexus-black relative w-[280px] min-w-[220px] max-w-[360px]">
      <div className="h-10 shrink-0 px-3 border-b border-nexus-gray flex items-center justify-between text-xs font-mono font-bold text-nexus-muted">
        <span>FILES</span>
        <MoreVertical size={12} className="cursor-pointer hover:text-white" />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {rootIds.map(id => (
          <FileTreeItem key={id} id={id} level={0} onContextMenu={handleContextMenu} />
        ))}
      </div>
      <ContextMenu
        state={contextMenu}
        onClose={handleCloseContextMenu}
        onAction={handleContextMenuAction}
      />
    </div>
  );
};
