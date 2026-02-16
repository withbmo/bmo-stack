import {
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';

export function getFileIcon(
  name: string,
  type: 'file' | 'folder',
  isOpen?: boolean
) {
  if (type === 'folder') {
    return isOpen ? (
      <FolderOpen size={14} className="text-nexus-purple" />
    ) : (
      <Folder size={14} className="text-nexus-purple" />
    );
  }
  if (name.endsWith('.py'))
    return <FileCode size={14} className="text-blue-400" />;
  if (name.endsWith('.json'))
    return <FileJson size={14} className="text-yellow-400" />;
  if (name.endsWith('.md'))
    return <FileText size={14} className="text-nexus-light" />;
  if (name.endsWith('.txt'))
    return <FileText size={14} className="text-nexus-muted" />;
  return <File size={14} className="text-nexus-muted" />;
}
