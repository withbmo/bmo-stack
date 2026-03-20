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
      <FolderOpen size={14} className="text-brand-primary" />
    ) : (
      <Folder size={14} className="text-brand-primary" />
    );
  }
  if (name.endsWith('.py'))
    return <FileCode size={14} className="text-blue-400" />;
  if (name.endsWith('.json'))
    return <FileJson size={14} className="text-yellow-400" />;
  if (name.endsWith('.md'))
    return <FileText size={14} className="text-text-secondary" />;
  if (name.endsWith('.txt'))
    return <FileText size={14} className="text-text-muted" />;
  return <File size={14} className="text-text-muted" />;
}
