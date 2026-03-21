'use client';

import 'swagger-ui-react/swagger-ui.css';

import {
  Activity,
  AlertTriangle,
  Code2,
  Database,
  Globe,
  Play,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';

import { Input } from '@/dashboard/components';

import {
  AgentPanel,
  CHAT_MAX,
  CHAT_MIN,
  EDITOR_MIN,
  EditorArea,
  FileTree,
  SystemMonitor,
  TerminalPanel,
  useIdeState,
} from '..';

const OPENAPI_SPEC_URL = '/openapi.json';

const ResizeHandle = ({
  onResize,
  className = '',
}: {
  onResize: (deltaX: number) => void;
  className?: string;
}) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    lastXRef.current = e.clientX;
    setIsDragging(true);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onMouseDown={handleMouseDown}
      className={`group flex w-0.5 shrink-0 cursor-col-resize items-center justify-center transition-colors ${
        isDragging ? 'bg-brand-primary/40' : 'bg-border-default/80 hover:bg-brand-primary/30'
      } ${className}`}
    >
      <div className="h-full min-h-[40px] w-px shrink-0 bg-border-default group-hover:bg-brand-primary" />
    </div>
  );
};

const SidebarIcon = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex h-14 w-full items-center justify-center transition-all duration-200
      ${
        isActive
          ? 'border-l-2 border-brand-primary bg-bg-panel text-text-primary'
          : 'border-l-2 border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary'
      }
    `}
  >
    <Icon size={20} strokeWidth={1.5} className={isActive ? 'text-brand-primary' : ''} />
    <div className="pointer-events-none absolute left-full z-50 ml-1 whitespace-nowrap border border-border-default bg-bg-panel px-3 py-1.5 font-mono text-[10px] font-bold text-text-primary opacity-0 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] transition-opacity group-hover:opacity-100">
      {label}
    </div>
  </button>
);

function useProjectIdParam(): string | undefined {
  const params = useParams();
  const raw = params.projectId;
  return Array.isArray(raw) ? raw[0] : (raw ?? undefined);
}

export const IDERoute = () => {
  const projectId = useProjectIdParam();
  const router = useRouter();

  const {
    chatMessages,
    chatInput,
    setChatInput,
    handleChatSubmit,
    chatMode,
    setChatMode,
    selectedLLM,
    setSelectedLLM,
    modeDropdownOpen,
    setModeDropdownOpen,
    llmDropdownOpen,
    setLlmDropdownOpen,
    isThinking,
    agentContext,
    chatFormRef,
    messagesEndRef,
    clearChat,
    activeView,
    setActiveView,
    chatPanelWidth,
    setChatPanelWidth,
    projectConfig,
    setProjectConfig,
  } = useIdeState(projectId);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-bg-app font-sans text-text-primary">
      {/* IDE Header */}
      <div className="flex h-12 items-center justify-between border-b border-border-default bg-bg-panel px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-text-muted transition-colors hover:text-text-primary"
          >
            <X size={16} />
          </button>
          <span className="font-mono text-sm font-bold">{projectId || 'untitled'}</span>
          <span className="rounded bg-border-default/20 px-2 py-0.5 font-mono text-[10px] text-text-muted">
            Running
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 bg-brand-primary px-3 py-1.5 font-mono text-xs font-bold text-white transition-colors hover:bg-brand-neon"
          >
            <Play size={12} fill="currentColor" /> RUN
          </button>
          <button type="button" className="p-2 text-text-muted transition-colors hover:text-text-primary">
            <Save size={16} />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-primary bg-brand-primary/20 text-xs font-bold text-brand-primary">
            U1
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="z-10 flex w-14 flex-col items-center border-r border-border-default bg-bg-app py-2">
          <SidebarIcon
            icon={Code2}
            label="Code Editor"
            isActive={activeView === 'ide'}
            onClick={() => setActiveView('ide')}
          />
          <SidebarIcon
            icon={Globe}
            label="API Playground"
            isActive={activeView === 'api'}
            onClick={() => setActiveView('api')}
          />
          <SidebarIcon
            icon={Activity}
            label="System Status"
            isActive={activeView === 'status'}
            onClick={() => setActiveView('status')}
          />
          <SidebarIcon
            icon={Database}
            label="Database Viewer"
            isActive={activeView === 'database'}
            onClick={() => setActiveView('database')}
          />
          <SidebarIcon
            icon={Settings}
            label="Config"
            isActive={activeView === 'config'}
            onClick={() => setActiveView('config')}
          />
        </div>

        {/* View Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* IDE VIEW */}
          {activeView === 'ide' && (
            <div className="flex-1 flex overflow-hidden min-w-0">
              {/* AI Agent Panel */}
              <AgentPanel
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleChatSubmit={handleChatSubmit}
                chatMode={chatMode}
                setChatMode={setChatMode}
                selectedLLM={selectedLLM}
                setSelectedLLM={setSelectedLLM}
                modeDropdownOpen={modeDropdownOpen}
                setModeDropdownOpen={setModeDropdownOpen}
                llmDropdownOpen={llmDropdownOpen}
                setLlmDropdownOpen={setLlmDropdownOpen}
                isThinking={isThinking}
                agentContext={agentContext}
                chatFormRef={chatFormRef}
                messagesEndRef={messagesEndRef}
                clearChat={clearChat}
                width={chatPanelWidth}
              />

              <ResizeHandle
                onResize={deltaX => {
                  setChatPanelWidth(w => Math.min(CHAT_MAX, Math.max(CHAT_MIN, w + deltaX)));
                }}
              />

              <FileTree />

              <ResizeHandle
                onResize={() => {
                  /* files panel fixed width for now */
                }}
              />

              <div
                className="flex min-w-0 flex-1 flex-col bg-bg-app"
                style={{ minWidth: EDITOR_MIN }}
              >
                <EditorArea />
                <TerminalPanel />
              </div>
            </div>
          )}

          {/* API Playground View */}
          {activeView === 'api' && (
            <div className="flex-1 min-w-0 w-full flex flex-col overflow-hidden api-playground-swagger">
              <div className="h-full overflow-auto border border-border-default bg-bg-panel">
                <SwaggerUI url={OPENAPI_SPEC_URL} />
              </div>
            </div>
          )}

          {/* System Status View */}
          {activeView === 'status' && (
            <div className="flex-1 min-w-0 w-full flex flex-col overflow-hidden">
              <SystemMonitor />
            </div>
          )}

          {/* Database View Placeholder */}
          {activeView === 'database' && (
            <div className="flex flex-1 flex-col items-center justify-center bg-bg-panel text-text-muted">
              <div className="mb-6 flex h-24 w-24 items-center justify-center border border-border-default bg-bg-app animate-in zoom-in duration-300">
                <Database size={48} className="text-blue-400" />
              </div>
              <h3 className="mb-2 font-sans text-2xl font-bold tracking-widest text-text-primary">
                MODULE_NOT_LOADED
              </h3>
              <p className="max-w-xs text-center font-mono text-xs leading-relaxed text-text-secondary/50">
                This capability is currently in development.
              </p>
            </div>
          )}

          {/* Config View: Env Vars + Danger Zone */}
          {activeView === 'config' && (
            <div className="flex min-w-0 w-full flex-1 flex-col overflow-auto bg-bg-panel p-8">
              <div className="max-w-2xl space-y-10">
                <div>
                  <h2 className="mb-2 flex items-center gap-2 font-sans text-xl font-bold text-text-primary">
                    <Zap size={18} className="text-brand-primary" /> ENVIRONMENT_VARS
                  </h2>
                  <p className="mb-4 font-mono text-xs text-text-muted">
                    Key-value pairs injected at runtime. Keep secrets out of code.
                  </p>
                  <div className="space-y-3">
                    {projectConfig.envVars.map(ev => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-2 border border-border-default bg-bg-app p-3"
                      >
                        <Input
                          value={ev.key}
                          onChange={e => {
                            setProjectConfig(c => ({
                              ...c,
                              envVars: c.envVars.map(v =>
                                v.id === ev.id ? { ...v, key: e.target.value } : v
                              ),
                            }));
                          }}
                          placeholder="KEY"
                          className="flex-1"
                          variant="ide"
                          intent="brand"
                          size="sm"
                        />
                        <Input
                          value={ev.value}
                          onChange={e => {
                            setProjectConfig(c => ({
                              ...c,
                              envVars: c.envVars.map(v =>
                                v.id === ev.id ? { ...v, value: e.target.value } : v
                              ),
                            }));
                          }}
                          placeholder="VALUE"
                          className="flex-1"
                          variant="ide"
                          intent="brand"
                          size="sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProjectConfig(c => ({
                              ...c,
                              envVars: c.envVars.filter(v => v.id !== ev.id),
                            }));
                          }}
                          className="border border-border-default p-2 text-text-muted transition-colors hover:border-red-500 hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProjectConfig(c => ({
                          ...c,
                          envVars: [
                            ...c.envVars,
                            {
                              id: String(Date.now()),
                              key: '',
                              value: '',
                            },
                          ],
                        }));
                      }}
                      className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-border-default py-3 font-mono text-xs font-bold text-text-muted transition-colors hover:border-brand-primary hover:text-brand-primary"
                    >
                      <Plus size={14} /> ADD_VAR
                    </button>
                  </div>
                </div>

                <div className="border border-red-500/30 bg-red-500/5 p-6">
                  <h2 className="font-sans font-bold text-xl text-red-500 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> DANGER_ZONE
                  </h2>
                  <p className="mb-6 font-mono text-xs text-text-muted">
                    Irreversible actions. Proceed with caution.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border border-border-default bg-bg-app p-4">
                      <div>
                        <div className="mb-1 font-sans font-bold text-text-primary">DELETE_PROJECT</div>
                        <div className="font-mono text-xs text-text-muted">
                          Remove this project and all deployments. Cannot be undone.
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-red-500 text-red-500 font-mono text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                      >
                        DELETE
                      </button>
                    </div>
                    <div className="flex items-center justify-between border border-border-default bg-bg-app p-4">
                      <div>
                        <div className="mb-1 font-sans font-bold text-text-primary">
                          TRANSFER_OWNERSHIP
                        </div>
                        <div className="font-mono text-xs text-text-muted">
                          Transfer this project to another user or team.
                        </div>
                      </div>
                      <button
                        type="button"
                        className="border border-border-default px-4 py-2 font-mono text-xs font-bold text-text-muted transition-colors hover:border-text-primary hover:text-text-primary"
                      >
                        TRANSFER
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
