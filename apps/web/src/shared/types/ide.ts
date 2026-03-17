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

export type ToolStep =
  | { type: 'read'; file: string }
  | { type: 'edit'; file: string; diff?: string }
  | { type: 'run'; command: string }
  | { type: 'search'; query: string };

export interface ChatMessage {
  id: number;
  role: 'user' | 'agent';
  text: string;
  codeBlocks?: Array<{ language: string; code: string; filename?: string }>;
  toolSteps?: ToolStep[];
  status?: 'thinking' | 'done' | 'error';
  contextFiles?: string[];
  isStreaming?: boolean;
  timestamp?: number;
}

export type AgentMode = 'ask' | 'edit' | 'agent';

export interface AgentContext {
  files: string[];
  selection?: { file: string; from: number; to: number };
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
