'use client';

import 'swagger-ui-react/swagger-ui.css';

import {
  Activity,
  AlertTriangle,
  Bot,
  ChevronDown,
  Code2,
  Database,
  Globe,
  MessageSquare,
  Play,
  Plus,
  Save,
  Send,
  Settings,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';

import { Input } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';

import {
  CHAT_MAX,
  CHAT_MIN,
  EDITOR_MIN,
  EditorArea,
  FileTree,
  SystemMonitor,
  TerminalPanel,
  useIdeState,
} from '..';
import { fetchWizardManifest } from '../api/wizard-manifest';
import { buildFileTreeFromManifest } from '../utils/manifest-file-tree';

function pathToId(path: string): string {
  return path.replace(/\//g, '-').replace(/^\./, '');
}

const OPENAPI_SPEC_URL = '/openapi.json';

const LLM_OPTIONS = [
  { id: 'claude', label: 'Claude' },
  { id: 'gpt', label: 'GPT' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'mistral', label: 'Mistral' },
] as const;

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
      className={`shrink-0 w-0.5 flex items-center justify-center group cursor-col-resize transition-colors ${
        isDragging ? 'bg-nexus-purple/40' : 'bg-nexus-gray/80 hover:bg-nexus-purple/30'
      } ${className}`}
    >
      <div className="w-px h-full min-h-[40px] bg-nexus-gray group-hover:bg-nexus-purple shrink-0" />
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
    className={`relative group w-full h-14 flex items-center justify-center transition-all duration-200
      ${
        isActive
          ? 'text-white bg-[#0A0A0A] border-l-2 border-nexus-purple'
          : 'text-nexus-muted hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }
    `}
  >
    <Icon size={20} strokeWidth={1.5} className={isActive ? 'text-nexus-purple' : ''} />
    <div className="absolute left-full ml-1 px-3 py-1.5 bg-[#080808] border border-nexus-gray text-[10px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)]">
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
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();
  const environmentId = searchParams?.get('envId') ?? undefined;

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
    chatFormRef,
    activeView,
    setActiveView,
    chatPanelWidth,
    setChatPanelWidth,
    projectConfig,
    setProjectConfig,
    replaceFileTree,
  } = useIdeState(projectId);

  useEffect(() => {
    const manifestId = searchParams?.get('manifestId');
    if (!manifestId) return;
    if (!hydrated || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const manifest = await fetchWizardManifest(undefined, manifestId);
        if (cancelled) return;
        const tree = buildFileTreeFromManifest(manifest);
        const entryId = manifest.entryFile ? pathToId(manifest.entryFile) : undefined;
        replaceFileTree(tree, entryId);
      } catch {
        // Silent fail: IDE stays on default files.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, replaceFileTree, hydrated, user]);

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden font-sans">
      {/* IDE Header */}
      <div className="h-12 border-b border-nexus-gray flex items-center justify-between px-4 bg-[#080808]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-nexus-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          <span className="font-mono text-sm font-bold">{projectId || 'untitled'}</span>
          <span className="text-[10px] bg-nexus-gray/20 px-2 py-0.5 rounded text-nexus-muted font-mono">
            Running
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-nexus-purple text-white text-xs font-mono font-bold hover:bg-nexus-neon transition-colors"
          >
            <Play size={12} fill="currentColor" /> RUN
          </button>
          <button type="button" className="p-2 text-nexus-muted hover:text-white transition-colors">
            <Save size={16} />
          </button>
          <div className="w-8 h-8 rounded-full bg-nexus-purple/20 border border-nexus-purple flex items-center justify-center text-xs font-bold text-nexus-purple">
            U1
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-14 border-r border-nexus-gray bg-[#050505] flex flex-col items-center py-2 z-10">
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
              {/* AI Chat */}
              <div
                className="shrink-0 flex flex-col bg-[#080808]"
                style={{
                  width: chatPanelWidth,
                  minWidth: CHAT_MIN,
                  maxWidth: CHAT_MAX,
                }}
              >
                <div className="h-10 shrink-0 px-3 border-b border-nexus-gray flex items-center gap-2 text-xs font-mono font-bold text-nexus-accent">
                  <Bot size={14} /> AI ARCHITECT
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 border
                        ${
                          msg.role === 'agent'
                            ? 'bg-nexus-purple/20 border-nexus-purple text-nexus-purple'
                            : 'bg-nexus-gray/20 border-nexus-gray text-nexus-muted'
                        }`}
                      >
                        {msg.role === 'agent' ? <Bot size={14} /> : <MessageSquare size={14} />}
                      </div>
                      <div
                        className={`p-3 text-xs leading-relaxed border max-w-[85%] font-mono
                        ${
                          msg.role === 'agent'
                            ? 'bg-[#0A0A0A] border-nexus-gray text-nexus-light/80'
                            : 'bg-nexus-purple/10 border-nexus-purple/30 text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  ref={chatFormRef}
                  onSubmit={handleChatSubmit}
                  className="border-t border-nexus-gray bg-[#0A0A0A]"
                >
                  <div className="px-3 pt-3 pb-3">
                    <Input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder={
                        chatMode === 'ask'
                          ? `Ask ${LLM_OPTIONS.find(o => o.id === selectedLLM)?.label ?? 'AI'}...`
                          : 'Describe edit or paste code...'
                      }
                      variant="ide"
                      intent="brand"
                      size="sm"
                    />
                    <div className="flex items-center gap-2 pt-2">
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setLlmDropdownOpen(false);
                            setModeDropdownOpen(o => !o);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 bg-[#141414] border border-nexus-gray text-nexus-muted hover:text-white hover:border-nexus-gray/70 transition-colors"
                        >
                          {chatMode === 'ask' ? <MessageSquare size={14} /> : <Code2 size={14} />}
                          <ChevronDown size={12} className="opacity-70" />
                        </button>
                        {modeDropdownOpen && (
                          <div className="absolute left-0 bottom-full mb-1 z-10 min-w-[100%] bg-[#0D0D0D] border border-nexus-gray shadow-lg">
                            {(['ask', 'editor'] as const).map(mode => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => {
                                  setChatMode(mode);
                                  setModeDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-mono transition-colors ${
                                  chatMode === mode
                                    ? 'bg-nexus-purple/20 text-nexus-purple'
                                    : 'text-nexus-muted hover:bg-nexus-gray/20 hover:text-white'
                                }`}
                              >
                                {mode === 'ask' ? <MessageSquare size={12} /> : <Code2 size={12} />}
                                {mode === 'ask' ? 'Ask' : 'Editor'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setModeDropdownOpen(false);
                            setLlmDropdownOpen(o => !o);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 text-nexus-muted hover:text-white transition-colors text-xs font-mono"
                        >
                          {LLM_OPTIONS.find(o => o.id === selectedLLM)?.label ?? 'LLM'}
                          <ChevronDown size={12} className="opacity-70" />
                        </button>
                        {llmDropdownOpen && (
                          <div className="absolute left-0 bottom-full mb-1 z-10 min-w-[100%] bg-[#0D0D0D] border border-nexus-gray shadow-lg">
                            {LLM_OPTIONS.map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setSelectedLLM(opt.id);
                                  setLlmDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-mono transition-colors ${
                                  selectedLLM === opt.id
                                    ? 'bg-nexus-purple/20 text-nexus-purple'
                                    : 'text-nexus-muted hover:bg-nexus-gray/20 hover:text-white'
                                }`}
                              >
                                <Bot size={12} />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0" />
                      <button
                        type="submit"
                        className="shrink-0 p-1.5 text-nexus-muted hover:text-nexus-purple transition-colors"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

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
                className="flex-1 flex flex-col min-w-0 bg-[#0C0C0C]"
                style={{ minWidth: EDITOR_MIN }}
              >
                <EditorArea />
                <TerminalPanel environmentId={environmentId} />
              </div>
            </div>
          )}

          {/* API Playground View */}
          {activeView === 'api' && (
            <div className="flex-1 min-w-0 w-full flex flex-col overflow-hidden api-playground-swagger">
              <div className="h-full overflow-auto bg-[#080808] border border-nexus-gray">
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
            <div className="flex-1 flex items-center justify-center flex-col text-nexus-muted bg-[#0A0A0A]">
              <div className="w-24 h-24 border border-nexus-gray flex items-center justify-center mb-6 bg-[#080808] animate-in zoom-in duration-300">
                <Database size={48} className="text-blue-400" />
              </div>
              <h3 className="font-sans font-bold text-2xl text-white mb-2 tracking-widest">
                MODULE_NOT_LOADED
              </h3>
              <p className="font-mono text-xs text-nexus-light/50 max-w-xs text-center leading-relaxed">
                This capability is currently in development.
              </p>
            </div>
          )}

          {/* Config View: Env Vars + Danger Zone */}
          {activeView === 'config' && (
            <div className="flex-1 min-w-0 w-full flex flex-col overflow-auto bg-[#0A0A0A] p-8">
              <div className="max-w-2xl space-y-10">
                <div>
                  <h2 className="font-sans font-bold text-xl text-white mb-2 flex items-center gap-2">
                    <Zap size={18} className="text-nexus-purple" /> ENVIRONMENT_VARS
                  </h2>
                  <p className="font-mono text-xs text-nexus-muted mb-4">
                    Key-value pairs injected at runtime. Keep secrets out of code.
                  </p>
                  <div className="space-y-3">
                    {projectConfig.envVars.map(ev => (
                      <div
                        key={ev.id}
                        className="flex gap-2 items-center border border-nexus-gray bg-[#080808] p-3"
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
                          className="p-2 border border-nexus-gray text-nexus-muted hover:text-red-500 hover:border-red-500 transition-colors"
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
                      className="w-full py-3 border-2 border-dashed border-nexus-gray text-nexus-muted font-mono text-xs font-bold hover:border-nexus-purple hover:text-nexus-purple transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> ADD_VAR
                    </button>
                  </div>
                </div>

                <div className="border border-red-500/30 bg-red-500/5 p-6">
                  <h2 className="font-sans font-bold text-xl text-red-500 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> DANGER_ZONE
                  </h2>
                  <p className="font-mono text-xs text-nexus-muted mb-6">
                    Irreversible actions. Proceed with caution.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border border-nexus-gray bg-[#080808] p-4">
                      <div>
                        <div className="font-sans font-bold text-white mb-1">DELETE_PROJECT</div>
                        <div className="font-mono text-xs text-nexus-muted">
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
                    <div className="flex items-center justify-between border border-nexus-gray bg-[#080808] p-4">
                      <div>
                        <div className="font-sans font-bold text-white mb-1">
                          TRANSFER_OWNERSHIP
                        </div>
                        <div className="font-mono text-xs text-nexus-muted">
                          Transfer this project to another user or team.
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-nexus-gray text-nexus-muted font-mono text-xs font-bold hover:text-white hover:border-white transition-colors"
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
