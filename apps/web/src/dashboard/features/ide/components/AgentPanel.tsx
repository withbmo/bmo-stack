'use client';

import { Claude, Gemini, Mistral, OpenAI } from '@lobehub/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui';
import {
  AtSign,
  Check,
  ChevronDown,
  Clipboard,
  FileCode2,
  Globe,
  Loader2,
  PenLine,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Terminal,
  User,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions-ts';

import type { AgentMode, ChatMessage, FileMetadata } from '@/shared/types';

import { LLM_OPTIONS } from '../hooks/useChatState';
import { useIdeStore } from '../stores/ide-store';

// ─── LLM icon map ─────────────────────────────────────────────────────────────

function LLMIcon({ id, size = 14 }: { id: string; size?: number }) {
  if (id === 'claude') return <Claude.Color size={size} className="shrink-0" />;
  if (id === 'gpt') return <OpenAI size={size} className="shrink-0 text-white" />;
  if (id === 'gemini') return <Gemini.Color size={size} className="shrink-0" />;
  if (id === 'mistral') return <Mistral.Color size={size} className="shrink-0" />;
  return <Sparkles size={size} className="shrink-0" />;
}

// ─── Mode config ──────────────────────────────────────────────────────────────

const ModeConfig: Record<AgentMode, { label: string; icon: React.ElementType; description: string }> = {
  ask: { label: 'Ask', icon: Search, description: 'Ask questions about your code' },
  edit: { label: 'Edit', icon: PenLine, description: 'Apply AI edits to files directly' },
  agent: { label: 'Agent', icon: Wrench, description: 'Autonomous multi-file tasks' },
};

// ─── Tool call step ───────────────────────────────────────────────────────────

type ToolStep =
  | { type: 'read'; file: string }
  | { type: 'edit'; file: string; diff?: string }
  | { type: 'run'; command: string }
  | { type: 'search'; query: string };

function ToolCallStep({ step }: { step: ToolStep }) {
  const [expanded, setExpanded] = useState(false);
  const label =
    step.type === 'read' ? `Read ${step.file}` :
    step.type === 'edit' ? `Edit ${step.file}` :
    step.type === 'run'  ? `Run \`${step.command}\`` :
                           `Search "${step.query}"`;
  const icon =
    step.type === 'read' ? <FileCode2 size={10} className="text-brand-accent" /> :
    step.type === 'edit' ? <PenLine size={10} className="text-brand-neon" /> :
    step.type === 'run'  ? <Terminal size={10} className="text-yellow-400" /> :
                           <Globe size={10} className="text-blue-400" />;
  const hasDiff = step.type === 'edit' && (step as { diff?: string }).diff;

  return (
    <div className="border border-border-default/30 bg-bg-app/40 font-mono text-[10px]">
      <button
        type="button"
        onClick={() => hasDiff && setExpanded(v => !v)}
        className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-text-muted ${hasDiff ? 'cursor-pointer hover:text-text-secondary' : 'cursor-default'}`}
      >
        {icon}
        <span className="flex-1 text-left truncate">{label}</span>
        <Check size={9} className="shrink-0 text-brand-neon" />
        {hasDiff && <ChevronDown size={9} className={`opacity-50 transition-transform ${expanded ? 'rotate-180' : ''}`} />}
      </button>
      {expanded && hasDiff && (
        <pre className="overflow-x-auto whitespace-pre-wrap border-t border-border-default/20 px-3 pb-2.5 pt-1.5 text-[10px] leading-4 text-text-secondary/70">
          {(step as { diff?: string }).diff}
        </pre>
      )}
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 text-text-muted transition-colors hover:text-white"
      title="Copy"
    >
      {copied ? <Check size={10} /> : <Clipboard size={10} />}
    </button>
  );
}

// ─── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({ code, language, filename }: { code: string; language: string; filename?: string }) {
  return (
    <div className="mt-2 overflow-hidden border border-border-default/50 bg-bg-app font-mono text-[11px]">
      <div className="flex items-center justify-between border-b border-border-default/30 bg-border-default/10 px-2.5 py-1">
        <div className="flex items-center gap-1.5 text-text-muted"><FileCode2 size={10} /><span>{filename ?? language}</span></div>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto break-words whitespace-pre-wrap p-3 leading-5 text-text-secondary/90">{code}</pre>
    </div>
  );
}

// ─── Thinking indicator ───────────────────────────────────────────────────────

function ThinkingIndicator({ llmId }: { llmId: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
        <LLMIcon id={llmId} size={16} />
      </div>
      <div className="flex items-center gap-2 border border-border-default/40 bg-bg-app/30 px-3 py-2 font-mono text-[11px] text-text-muted">
        <span className="flex gap-1">
          <span className="h-1 w-1 rounded-full bg-brand-primary animate-bounce [animation-delay:0ms]" />
          <span className="h-1 w-1 rounded-full bg-brand-primary animate-bounce [animation-delay:150ms]" />
          <span className="h-1 w-1 rounded-full bg-brand-primary animate-bounce [animation-delay:300ms]" />
        </span>
        <span>thinking</span>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, llmId }: { msg: ChatMessage; llmId: string }) {
  const isUser = msg.role === 'user';
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part.split('\n').map((line, j, arr) => (
        <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
      ));
    });
  };

  return (
    <div className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="flex h-6 w-6 items-center justify-center border border-border-default/50 bg-border-default/10 text-text-muted">
            <User size={11} />
          </div>
        ) : (
          <div className="w-6 h-6 flex items-center justify-center">
            <LLMIcon id={llmId} size={16} />
          </div>
        )}
      </div>
      <div className={`flex flex-col gap-1.5 min-w-0 flex-1 ${isUser ? 'items-end' : ''}`}>
        {msg.contextFiles && msg.contextFiles.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {msg.contextFiles.map(f => (
              <span key={f} className="inline-flex items-center gap-1 border border-brand-primary/20 bg-brand-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-brand-primary/70">
                <FileCode2 size={9} />{f}
              </span>
            ))}
          </div>
        )}
        <div className={`px-3 py-2.5 text-[11px] leading-relaxed border font-mono max-w-full
          ${isUser
            ? 'bg-brand-primary/10 border-brand-primary/25 text-white'
            : 'bg-bg-app/30 border-border-default/40 text-text-secondary/85'
          }`}>
          {renderText(msg.text)}
        </div>
        {msg.toolSteps && msg.toolSteps.length > 0 && (
          <div className="w-full space-y-1">
            {msg.toolSteps.map((step, i) => (
              <ToolCallStep key={i} step={step as ToolStep} />
            ))}
          </div>
        )}
        {msg.codeBlocks?.map((block, i) => (
          <CodeBlock key={i} {...block} />
        ))}
        {msg.timestamp && (
          <span className="px-0.5 font-mono text-[9px] text-text-muted/35">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED: Record<AgentMode, string[]> = {
  ask: ['Explain this file', 'Find potential bugs', 'How do I improve performance?'],
  edit: ['Add error handling', 'Refactor to async/await', 'Add TypeScript types'],
  agent: ['Write unit tests for all functions', 'Add logging throughout', 'Migrate to latest API'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPath(id: string, filesMap: Record<string, FileMetadata>): string {
  const parts: string[] = [];
  let current: FileMetadata | undefined = filesMap[id];
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? filesMap[current.parentId] : undefined;
  }
  return parts.join('/');
}

// ─── Main AgentPanel ──────────────────────────────────────────────────────────

export interface AgentPanelProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  handleChatSubmit: (e: React.FormEvent) => void;
  chatMode: AgentMode;
  setChatMode: (m: AgentMode) => void;
  selectedLLM: string;
  setSelectedLLM: (id: string) => void;
  modeDropdownOpen: boolean;
  setModeDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  llmDropdownOpen: boolean;
  setLlmDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isThinking: boolean;
  agentContext: { files: string[] };
  chatFormRef: React.RefObject<HTMLFormElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  clearChat: () => void;
  width: number;
}

export const AgentPanel = ({
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
  width,
}: AgentPanelProps) => {
  const filesMap = useIdeStore(s => s.files);
  const allFiles = Object.values(filesMap).filter(f => f.type === 'file');

  // react-mentions-ts stores markup like [filename](filename)
  // we keep both: markup value (for the MentionsInput) + plain text (for sending)
  const [mentionMarkup, setMentionMarkup] = useState('');

  const currentLLM = LLM_OPTIONS.find(o => o.id === selectedLLM);
  const currentMode = ModeConfig[chatMode];
  const ModeIcon = currentMode.icon;

  // Sync plain text back up to parent so existing submit logic works
  const handleMentionsChange = ({ value, plainTextValue }: { value: string; plainTextValue: string }) => {
    setMentionMarkup(value);
    setChatInput(plainTextValue);
  };

  const mentionData = allFiles.map(f => ({ id: f.id, display: f.name }));

  const doSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isThinking) return;
    agentContext.files = [
      ...new Set([
        ...agentContext.files,
        // extract mentioned display names from markup
        ...[...mentionMarkup.matchAll(/\[([^\]]+)\]/g)].map(m => m[1] ?? '').filter(Boolean),
      ]),
    ];
    handleChatSubmit(e);
    setMentionMarkup('');
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSubmit(e as unknown as React.FormEvent);
    }
  };

  const insertAtTrigger = () => {
    setMentionMarkup(prev => prev + '');
    setChatInput(`${chatInput}`);
  };

  const placeholder =
    chatMode === 'ask' ? `Ask ${currentLLM?.label ?? 'AI'}… ( to mention files)` :
    chatMode === 'edit' ? 'Describe the change… ( to mention a file)' :
    'Describe a task… ( to mention files)';

  return (
    <div className="shrink-0 flex flex-col overflow-hidden border-r border-border-default/50 bg-bg-panel" style={{ width }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-default px-3">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-brand-primary" />
          <span className="font-mono text-[11px] font-bold tracking-widest text-brand-accent">AI ARCHITECT</span>
        </div>
        <button type="button" onClick={clearChat} className="p-1.5 text-text-muted transition-colors hover:text-white" title="Clear chat">
          <RotateCcw size={11} />
        </button>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {chatMessages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} llmId={selectedLLM} />
        ))}
        {isThinking && <ThinkingIndicator llmId={selectedLLM} />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggested prompts ──────────────────────────────────────────────── */}
      {chatMessages.length === 1 && !isThinking && (
        <div className="space-y-1.5 px-3 pb-3">
          {SUGGESTED[chatMode].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { setMentionMarkup(p); setChatInput(p); }}
              className="w-full truncate border border-border-default/25 px-2.5 py-1.5 text-left font-mono text-[10px] text-text-muted/60 transition-all hover:border-brand-primary/35 hover:bg-brand-primary/5 hover:text-text-secondary"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Input box ──────────────────────────────────────────────────────── */}
      <form ref={chatFormRef} onSubmit={doSubmit} className="shrink-0 border-t border-border-default">

        <div className="relative mx-3 mb-0 mt-2.5 border border-border-default/50 bg-bg-app focus-within:border-brand-primary/50 transition-colors">

          {/* react-mentions-ts MentionsInput */}
          <MentionsInput
            value={mentionMarkup}
            onMentionsChange={handleMentionsChange}
            onKeyDown={handleKeyDown}
            placeholder={mentionMarkup ? '' : placeholder}
            autoResize
            suggestionsPlacement="above"
            spellCheck={false}
            classNames={{
              // outer wrapper — override library's bg-card/border-border
              control: 'relative w-full bg-transparent border-0',
              // the actual textarea
              input: 'w-full resize-none bg-transparent px-2.5 py-2.5 pr-9 font-mono text-[11px] leading-5 text-white placeholder:text-text-muted/40 focus:outline-none',
              // highlighter mirror — same padding as textarea so chips align perfectly
              highlighter: 'px-2.5 py-2.5 pr-9 text-[11px] font-mono leading-5',
              // suggestions dropdown
              suggestions: 'absolute left-0 right-0 z-50 overflow-hidden border border-brand-primary/40 bg-bg-panel shadow-2xl',
              suggestionsList: 'py-0',
              suggestionItem: 'cursor-pointer px-3 py-2 text-text-muted transition-colors',
              suggestionItemFocused: 'bg-brand-primary/15 text-brand-primary',
            }}
          >
            <Mention
              trigger=""
              data={mentionData}
              appendSpaceOnAdd
              className="!rounded-sm border border-brand-primary/40 !bg-brand-primary/25 px-0.5"
              renderSuggestion={(entry, _query, _highlighted, _index, focused) => {
                const file = filesMap[String(entry.id)];
                const path = file ? buildPath(String(entry.id), filesMap) : String(entry.display);
                return (
                  <div className={`flex items-center gap-2.5 ${focused ? 'text-brand-primary' : ''}`}>
                    <FileCode2 size={12} className={`shrink-0 ${focused ? 'text-brand-primary' : 'text-brand-accent/50'}`} />
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-medium truncate">{String(entry.display)}</div>
                      <div className="mt-0.5 truncate font-mono text-[9px] text-text-muted/50">{path}</div>
                    </div>
                  </div>
                );
              }}
            />
          </MentionsInput>

          {/* Send button */}
          <button
            type="submit"
            disabled={!chatInput.trim() || isThinking}
            className="absolute bottom-2 right-2 z-10 text-text-muted transition-colors hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-25"
          >
            <Send size={13} />
          </button>
        </div>

        {/* Toolbar row */}
        <div className="flex items-center gap-1 px-3 py-2">

          {/* Mode dropdown */}
          <div className="relative">
            <DropdownMenu open={modeDropdownOpen} onOpenChange={(open: boolean) => {
              setModeDropdownOpen(open);
              if (open) setLlmDropdownOpen(false);
            }}>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono border transition-colors
                  ${modeDropdownOpen ? 'border-brand-primary/50 text-white bg-brand-primary/10' : 'border-border-default/40 text-text-muted hover:text-white hover:border-border-default/70'}`}
              >
                <ModeIcon size={10} />
                <span>{currentMode.label}</span>
                <ChevronDown size={9} className="opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 border-border-default/70 bg-bg-panel">
                {(Object.entries(ModeConfig) as [AgentMode, typeof ModeConfig[AgentMode]][]).map(([mode, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <DropdownMenuItem
                      key={mode}
                      onClick={() => setChatMode(mode)}
                      className={`${chatMode === mode ? 'bg-brand-primary/15 text-brand-primary' : 'text-text-muted hover:bg-border-default/15 hover:text-white'}`}
                    >
                      <Icon size={12} className="mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono font-bold">{cfg.label}</div>
                        <div className="mt-0.5 font-mono text-[10px] text-text-muted/60">{cfg.description}</div>
                      </div>
                      {chatMode === mode && <Check size={10} className="ml-auto mt-1 shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* LLM dropdown */}
          <div className="relative">
            <DropdownMenu open={llmDropdownOpen} onOpenChange={(open: boolean) => {
              setLlmDropdownOpen(open);
              if (open) setModeDropdownOpen(false);
            }}>
              <DropdownMenuTrigger
                className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono border transition-colors
                  ${llmDropdownOpen ? 'border-brand-primary/50 text-white bg-brand-primary/10' : 'border-border-default/40 text-text-muted hover:text-white hover:border-border-default/70'}`}
              >
                <LLMIcon id={selectedLLM} size={13} />
                <span>{currentLLM?.label ?? 'LLM'}</span>
                <ChevronDown size={9} className="opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[160px] border-border-default/70 bg-bg-panel">
                {LLM_OPTIONS.map(opt => (
                  <DropdownMenuItem
                    key={opt.id}
                    onClick={() => setSelectedLLM(opt.id)}
                    className={`${selectedLLM === opt.id ? 'bg-brand-primary/15 text-brand-primary' : 'text-text-muted hover:bg-border-default/15 hover:text-white'}`}
                  >
                    <LLMIcon id={opt.id} size={14} />
                    <span className="flex-1">{opt.label}</span>
                    {selectedLLM === opt.id && <Check size={10} className="text-brand-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/*  button */}
          <button
            type="button"
            onClick={insertAtTrigger}
            title="Mention a file ()"
            className="flex items-center gap-1 border border-border-default/40 px-2 py-1 font-mono text-[10px] text-text-muted transition-colors hover:border-brand-primary/40 hover:text-brand-primary"
          >
            <AtSign size={10} />
          </button>

          <div className="flex-1" />

          <span className="font-mono text-[9px] text-text-muted/30">
            {isThinking ? (
              <span className="flex items-center gap-1 text-brand-primary/50">
                <Loader2 size={9} className="animate-spin" />processing
              </span>
            ) : '↵ send'}
          </span>
        </div>
      </form>
    </div>
  );
};
