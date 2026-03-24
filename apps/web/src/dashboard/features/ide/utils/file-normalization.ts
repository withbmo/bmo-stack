import type { FileNode } from '@/shared/types';
import type { FileMetadata, NormalizedFileState } from '@/shared/types';

/**
 * Converts recursive FileNode[] (e.g. INITIAL_FILES) into normalized flat state.
 * Single traversal; runtime uses O(1) lookups and updates.
 */
export function normalizeFileTree(initialData: FileNode[]): NormalizedFileState {
  const files: Record<string, FileMetadata> = {};
  const fileContents: Record<string, string> = {};

  function visit(nodes: FileNode[], parentId: string | null): void {
    for (const node of nodes) {
      const childrenIds = (node.children ?? []).map(c => c.id);
      files[node.id] = {
        id: node.id,
        name: node.name,
        type: node.type,
        parentId,
        childrenIds,
        isOpen: node.isOpen ?? true,
        language: node.type === 'file' ? (node.language ?? 'plaintext') : '',
      };
      if (node.type === 'file' && node.content !== undefined) {
        fileContents[node.id] = node.content;
      }
      if (node.children?.length) {
        visit(node.children, node.id);
      }
    }
  }

  visit(initialData, null);
  return { files, fileContents };
}
