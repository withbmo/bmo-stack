import type { ReactNode } from 'react';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  isOpen?: boolean;
  children?: FileNode[];
  language?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  childrenIds: string[];
  isOpen: boolean;
  language: string;
}

export interface NormalizedFileState {
  files: Record<string, FileMetadata>;
  fileContents: Record<string, string>;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'agent';
  text: string;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  nodeId: string | null;
  nodeType: 'file' | 'folder' | null;
}

export type ViewType = 'ide' | 'api' | 'status' | 'database' | 'config';

export interface TechStackOption {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
}
