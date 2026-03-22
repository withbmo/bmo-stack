'use client';

import 'swagger-ui-react/swagger-ui.css';

import {
  Activity,
  Code2,
  Database,
  ExternalLink,
  Globe,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Terminal,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';

import type { FileMetadata, ViewType } from '@/shared/types';
import { Button } from '@/ui/shadcn/ui/button';
import { Card } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Separator } from '@/ui/shadcn/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/ui/shadcn/ui/tabs';
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from '@/components/ai-elements/web-preview';

import { IdePromptInput } from '../components/IdePromptInput';
import { IdeConversation } from '../components/IdeConversation';
import { getFileIcon } from '../utils/get-file-icon';
import {
  CHAT_MAX,
  CHAT_MIN,
  EDITOR_MIN,
  FILES_MAX,
  FILES_MIN,
  useIdeState,
} from '..';

const OPENAPI_SPEC_URL = '/openapi.json';


function useProjectIdParam(): string | undefined {
  const params = useParams();
  const raw = params.projectId;
  return Array.isArray(raw) ? raw[0] : (raw ?? undefined);
}

function ResizeHandle({ onResize }: { onResize: (deltaX: number) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const deltaX = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      onResize(deltaX);
    };

    const handleUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onResize]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onMouseDown={e => {
        e.preventDefault();
        lastXRef.current = e.clientX;
        setIsDragging(true);
      }}
      className={[
        'group relative z-10 my-2 w-3 shrink-0 cursor-col-resize',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-colors',
          isDragging ? 'bg-primary' : 'group-hover:bg-primary',
        ].join(' ')}
      />
    </div>
  );
}

function buildFileTree(files: Record<string, FileMetadata>) {
  const byParent = new Map<string | null, FileMetadata[]>();

  Object.values(files).forEach(node => {
    const key = node.parentId;
    const list = byParent.get(key) ?? [];
    list.push(node);
    byParent.set(key, list);
  });

  for (const [k, list] of byParent) {
    byParent.set(
      k,
      list.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
    );
  }

  return byParent;
}

export const IDERoute = () => {
  const projectId = useProjectIdParam();
  const router = useRouter();

  const {
    files,
    fileContents,
    openFileIds,
    activeFileId,
    activeFile,
    handleFileSelect,
    handleCloseTab,
    handleFileToggle,
    handleCodeChange,
    chatMessages,
    submitMessage,
    selectedLLM,
    setSelectedLLM,
    isThinking,
    clearChat,
    activeView,
    setActiveView,
    chatPanelWidth,
    setChatPanelWidth,
    filesPanelWidth,
    setFilesPanelWidth,
    projectConfig,
    setProjectConfig,
  } = useIdeState(projectId);

  const filesByParent = useMemo(() => buildFileTree(files), [files]);
  const [previewUrl, setPreviewUrl] = useState('http://localhost:3000');
  const [previewReloadKey, setPreviewReloadKey] = useState(0);
  const [previewLogs, setPreviewLogs] = useState<Array<{ level: 'log' | 'warn' | 'error'; message: string; timestamp: Date }>>([
    {
      level: 'log',
      message: 'Web preview initialized.',
      timestamp: new Date(),
    },
  ]);

  const views: Array<{ id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'ide', label: 'IDE', icon: Code2 },
    { id: 'web', label: 'Web', icon: Globe },
    { id: 'api', label: 'API', icon: Globe },
    { id: 'status', label: 'Status', icon: Activity },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'config', label: 'Config', icon: Settings },
  ];

  const renderTreeNode = (node: FileMetadata, depth = 0): React.ReactNode => {
    const isFolder = node.type === 'folder';
    const isActive = activeFileId === node.id;

    return (
      <div key={node.id}>
        <button
          type="button"
          onClick={() => (isFolder ? handleFileToggle(node.id) : handleFileSelect(node.id))}
          className={[
            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
            isActive
              ? 'bg-primary/10 text-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          ].join(' ')}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          {getFileIcon(node.name, node.type, node.isOpen)}
          <span className="truncate">{node.name}</span>
        </button>

        {isFolder && node.isOpen
          ? (filesByParent.get(node.id) ?? []).map(child => renderTreeNode(child, depth + 1))
          : null}
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background p-2 text-foreground">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
              <X className="size-4" /> Back
            </Button>
            <span className="text-sm font-medium text-foreground">{projectId ? `Editor • ${projectId}` : 'Editor'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="size-4" /> Save
            </Button>
            <Button size="sm">
              <Play className="size-4" /> Run
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-border bg-card px-2 py-2">
            <Tabs value={activeView} onValueChange={value => setActiveView(value as ViewType)}>
              <TabsList className="h-9 rounded-md bg-muted p-1">
                {views.map(view => {
                  const Icon = view.icon;
                  return (
                    <TabsTrigger
                      key={view.id}
                      value={view.id}
                      className="h-7 px-3 text-xs text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <Icon className="size-3.5" />
                      {view.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {activeView === 'ide' ? (
            <div className="flex min-h-0 flex-1 overflow-hidden bg-background py-1">
              <section
                className="flex shrink-0 bg-background p-2"
                style={{ width: chatPanelWidth }}
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex h-11 items-center justify-between border-b border-border px-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Assistant
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearChat}>
                      Clear
                    </Button>
                  </div>

                  <div className="min-h-0 flex-1">
                    <IdeConversation isThinking={isThinking} messages={chatMessages} />
                  </div>

                  <IdePromptInput
                    isThinking={isThinking}
                    selectedLLM={selectedLLM}
                    setSelectedLLM={setSelectedLLM}
                    onSubmitText={submitMessage}
                  />
                </div>
              </section>

              <ResizeHandle
                onResize={deltaX => {
                  setChatPanelWidth(width => Math.min(CHAT_MAX, Math.max(CHAT_MIN, width + deltaX)));
                }}
              />

              <section
                className="flex shrink-0 bg-background p-2"
                style={{ width: filesPanelWidth }}
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex h-11 items-center justify-between border-b border-border px-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Files
                    </span>
                    <Button variant="ghost" size="icon" aria-label="Add file">
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-2">
                    {(filesByParent.get(null) ?? []).map(node => renderTreeNode(node))}
                  </div>
                </div>
              </section>

              <ResizeHandle
                onResize={deltaX => {
                  setFilesPanelWidth(width => Math.min(FILES_MAX, Math.max(FILES_MIN, width + deltaX)));
                }}
              />

              <section className="flex min-w-0 flex-1 bg-background p-2" style={{ minWidth: EDITOR_MIN }}>
                <div className="flex min-h-0 h-full w-full flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex h-11 items-end overflow-x-auto border-b border-border bg-muted/30 px-1 pt-1">
                    {openFileIds.map(fileId => {
                      const file = files[fileId];
                      if (!file || file.type !== 'file') return null;
                      const isActive = activeFileId === fileId;

                      return (
                        <button
                          key={fileId}
                          type="button"
                          onClick={() => handleFileSelect(fileId)}
                          className={[
                            'group -mb-px mr-1 flex h-9 items-center gap-2 rounded-t-md border px-3 text-xs transition-colors',
                            isActive
                              ? 'border-border bg-background text-foreground'
                              : 'border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground',
                          ].join(' ')}
                        >
                          <span className="truncate max-w-[160px]">{file.name}</span>
                          <span
                            onClick={e => handleCloseTab(e, fileId)}
                            className="rounded p-0.5 opacity-60 hover:bg-accent hover:opacity-100"
                          >
                            <X className="size-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden">
                    {activeFile ? (
                      <textarea
                        value={activeFile.content ?? fileContents[activeFile.id] ?? ''}
                        onChange={e => handleCodeChange(e.target.value)}
                        className="h-full w-full resize-none bg-background p-4 font-mono text-sm leading-6 text-foreground outline-none"
                        spellCheck={false}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Open a file to start editing.
                      </div>
                    )}
                  </div>

                  <div className="h-40 border-t border-border bg-card p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Terminal className="size-4" /> Terminal
                    </div>
                    <div className="h-[calc(100%-1.5rem)] overflow-y-auto rounded-md border border-border bg-background p-2 font-mono text-xs text-muted-foreground">
                      <div>$ pnpm dev</div>
                      <div>Ready in 1.4s</div>
                      <div className="text-foreground">localhost:3000</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {activeView === 'api' ? (
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <Card className="h-full overflow-auto border-border bg-background p-0">
                <SwaggerUI url={OPENAPI_SPEC_URL} />
              </Card>
            </div>
          ) : null}

          {activeView === 'web' ? (
            <div className="flex min-h-0 flex-1 overflow-hidden bg-background py-1">
              <section
                className="flex shrink-0 bg-background p-2"
                style={{ width: chatPanelWidth }}
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex h-11 items-center justify-between border-b border-border px-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Assistant
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearChat}>
                      Clear
                    </Button>
                  </div>

                  <div className="min-h-0 flex-1">
                    <IdeConversation isThinking={isThinking} messages={chatMessages} />
                  </div>

                  <IdePromptInput
                    isThinking={isThinking}
                    selectedLLM={selectedLLM}
                    setSelectedLLM={setSelectedLLM}
                    onSubmitText={submitMessage}
                  />
                </div>
              </section>

              <ResizeHandle
                onResize={deltaX => {
                  setChatPanelWidth(width => Math.min(CHAT_MAX, Math.max(CHAT_MIN, width + deltaX)));
                }}
              />

              <section className="flex min-w-0 flex-1 bg-background p-2" style={{ minWidth: EDITOR_MIN }}>
                <WebPreview
                  className="h-full w-full"
                  defaultUrl={previewUrl}
                  onUrlChange={url => {
                    setPreviewUrl(url);
                    setPreviewLogs(prev => [
                      ...prev.slice(-24),
                      { level: 'log', message: `Navigated to ${url}`, timestamp: new Date() },
                    ]);
                  }}
                >
                  <WebPreviewNavigation>
                    <WebPreviewNavigationButton
                      onClick={() => {
                        setPreviewReloadKey(key => key + 1);
                        setPreviewLogs(prev => [
                          ...prev.slice(-24),
                          { level: 'log', message: 'Preview refreshed.', timestamp: new Date() },
                        ]);
                      }}
                      tooltip="Refresh"
                    >
                      <RefreshCw className="size-4" />
                    </WebPreviewNavigationButton>
                    <WebPreviewUrl onChange={event => setPreviewUrl(event.target.value)} value={previewUrl} />
                    <WebPreviewNavigationButton
                      onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
                      tooltip="Open in new tab"
                    >
                      <ExternalLink className="size-4" />
                    </WebPreviewNavigationButton>
                  </WebPreviewNavigation>
                  <WebPreviewBody key={previewReloadKey} src={previewUrl} />
                  <WebPreviewConsole logs={previewLogs} />
                </WebPreview>
              </section>
            </div>
          ) : null}

          {activeView === 'status' ? (
            <div className="min-h-0 flex-1 overflow-auto p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">CPU</p>
                  <p className="mt-2 text-2xl font-semibold">32%</p>
                </Card>
                <Card className="border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Memory</p>
                  <p className="mt-2 text-2xl font-semibold">1.8 GB</p>
                </Card>
                <Card className="border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Disk</p>
                  <p className="mt-2 text-2xl font-semibold">68%</p>
                </Card>
                <Card className="border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Health</p>
                  <p className="mt-2 text-2xl font-semibold text-primary">Healthy</p>
                </Card>
              </div>
            </div>
          ) : null}

          {activeView === 'database' ? (
            <div className="flex min-h-0 flex-1 items-center justify-center p-4">
              <Card className="w-full max-w-xl border-border bg-card p-8 text-center">
                <Database className="mx-auto size-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">Database Viewer</h3>
                <p className="mt-2 text-sm text-muted-foreground">Coming soon.</p>
              </Card>
            </div>
          ) : null}

          {activeView === 'config' ? (
            <div className="min-h-0 flex-1 overflow-auto p-4">
              <Card className="max-w-3xl border-border bg-card p-6">
                <h2 className="text-xl font-semibold">Project Configuration</h2>
                <p className="mt-1 text-sm text-muted-foreground">Environment and deployment settings.</p>

                <Separator className="my-6" />

                <div className="space-y-3">
                  {projectConfig.envVars.map(ev => (
                    <div key={ev.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                      <Input
                        value={ev.key}
                        onChange={e => {
                          setProjectConfig(config => ({
                            ...config,
                            envVars: config.envVars.map(item =>
                              item.id === ev.id ? { ...item, key: e.target.value } : item
                            ),
                          }));
                        }}
                        placeholder="KEY"
                      />
                      <Input
                        value={ev.value}
                        onChange={e => {
                          setProjectConfig(config => ({
                            ...config,
                            envVars: config.envVars.map(item =>
                              item.id === ev.id ? { ...item, value: e.target.value } : item
                            ),
                          }));
                        }}
                        placeholder="VALUE"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setProjectConfig(config => ({
                            ...config,
                            envVars: config.envVars.filter(item => item.id !== ev.id),
                          }));
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setProjectConfig(config => ({
                      ...config,
                      envVars: [...config.envVars, { id: crypto.randomUUID(), key: '', value: '' }],
                    }));
                  }}
                >
                  <Plus className="size-4" /> Add Variable
                </Button>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
