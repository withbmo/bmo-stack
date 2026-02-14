import type { FileNode } from '@/shared/types';
import type { WizardManifest } from '@/shared/types';

function slugify(path: string): string {
  return path.replace(/\//g, '-').replace(/^\./, '');
}

/**
 * Convert a flat list of file paths with content into a hierarchical FileNode tree.
 * Paths like "src/main.py" become folders (src) and files (main.py).
 */
export function buildFileTreeFromManifest(manifest: WizardManifest): FileNode[] {
  const root: Record<string, FileNode> = {};

  for (const file of manifest.files) {
    const parts = file.path.split('/').filter(Boolean);
    if (parts.length === 0) continue;

    let current = root;
    let pathSoFar = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === undefined) continue;
      const isLast = i === parts.length - 1;
      pathSoFar = pathSoFar ? `${pathSoFar}/${part}` : part;
      const id = slugify(pathSoFar);

      if (isLast) {
        const lang = file.language ?? (part.endsWith('.py') ? 'python' : 'plaintext');
        current[id] = {
          id,
          name: part,
          type: 'file',
          content: file.content,
          language: lang,
          isOpen: true,
        };
      } else {
        if (!current[id]) {
          current[id] = {
            id,
            name: part,
            type: 'folder',
            isOpen: true,
            children: [],
          };
        }
        const node = current[id];
        if (
          node.type === 'folder' &&
          !(node as { _children?: Record<string, FileNode> })._children
        ) {
          (node as { _children?: Record<string, FileNode> })._children = {};
        }
        current = (node as { _children?: Record<string, FileNode> })._children ?? {};
      }
    }
  }

  function toArray(map: Record<string, FileNode>): FileNode[] {
    return Object.values(map)
      .map(node => {
        if (node.type === 'folder') {
          const childMap = (node as { _children?: Record<string, FileNode> })._children;
          if (childMap) {
            node.children = toArray(childMap);
            delete (node as { _children?: Record<string, FileNode> })._children;
          }
        }
        return node;
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  return toArray(root);
}
