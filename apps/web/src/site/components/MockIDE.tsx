'use client';

import {
  Activity,
  Bot,
  Code2,
  Database,
  FileCode,
  Folder,
  MessageSquare,
  MoreVertical,
  Play,
} from 'lucide-react';

import type { HeroPhase } from '@/shared/hooks/useHeroAnimation';

interface MockIDEProps {
  phase: HeroPhase;
  userMessage: string;
  agentText: string;
  codeLines: string[];
  deployLines: string[];
  deployLineIndex: number;
  isDeployDone: boolean;
}

/**
 * Animated mock IDE component for the hero section
 * Displays a realistic IDE interface with chat, file tree, editor, and terminal
 */
export const MockIDE = ({
  phase,
  userMessage,
  agentText,
  codeLines,
  deployLines,
  deployLineIndex,
  isDeployDone,
}: MockIDEProps) => {
  return (
    <div className="relative overflow-hidden border border-border-default bg-bg-overlay offset-shadow">
      {/* IDE Header */}
      <IDEHeader />

      <div className="flex min-h-[320px]">
        {/* Nav Sidebar */}
        <NavSidebar />

        {/* AI Chat Panel */}
        <ChatPanel phase={phase} userMessage={userMessage} agentText={agentText} />

        {/* File Tree */}
        <FileTree />

        {/* Editor + Terminal */}
        <EditorPanel
          phase={phase}
          codeLines={codeLines}
          deployLines={deployLines}
          deployLineIndex={deployLineIndex}
          isDeployDone={isDeployDone}
        />
      </div>

      {/* Corner Accents */}
      <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-brand-primary" />
      <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-brand-primary" />
    </div>
  );
};

// Sub-components

const IDEHeader = () => (
  <div className="flex h-10 items-center justify-between border-b border-border-default bg-bg-panel px-3">
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold">demo-project</span>
      <span className="bg-border-default/20 px-1.5 py-0.5 font-mono text-[9px] text-text-muted">
        Running
      </span>
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 bg-brand-primary px-2 py-1 font-mono text-[10px] font-bold text-white">
        <Play size={10} fill="currentColor" /> RUN
      </button>
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-primary bg-brand-primary/20 text-[9px] font-bold text-brand-primary">
        U1
      </div>
    </div>
  </div>
);

const NavSidebar = () => (
  <div className="flex w-12 flex-col items-center border-r border-border-default bg-bg-overlay py-2">
    <div className="flex h-10 w-full items-center justify-center border-l-2 border-brand-primary bg-bg-app text-brand-primary">
      <Code2 size={18} strokeWidth={1.5} />
    </div>
    <div className="flex h-10 w-full items-center justify-center border-l-2 border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary">
      <Activity size={18} strokeWidth={1.5} />
    </div>
    <div className="flex h-10 w-full items-center justify-center border-l-2 border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary">
      <Database size={18} strokeWidth={1.5} />
    </div>
  </div>
);

interface ChatPanelProps {
  phase: HeroPhase;
  userMessage: string;
  agentText: string;
}

const ChatPanel = ({ phase, userMessage, agentText }: ChatPanelProps) => (
  <div className="flex w-[22%] min-w-[100px] flex-col border-r border-border-default bg-bg-panel">
    <div className="flex items-center gap-1.5 border-b border-border-default p-2 font-mono text-[10px] font-bold text-brand-accent">
      <Bot size={12} /> AI ARCHITECT
    </div>
    <div className="flex-1 space-y-2 overflow-hidden p-2">
      {/* User Message */}
      <div className="flex gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-none border border-border-default bg-border-default/20 text-text-muted">
          <MessageSquare size={10} />
        </div>
        <div className="max-w-[90%] border border-brand-primary/30 bg-brand-primary/10 p-2 font-mono text-[10px] leading-relaxed text-text-secondary">
          {userMessage}
          {phase === 'chat' && (
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-brand-primary align-middle" />
          )}
        </div>
      </div>

      {/* Agent Reply */}
      {agentText && (
        <div className="flex gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-none border border-brand-primary bg-brand-primary/20 text-brand-primary">
            <Bot size={10} />
          </div>
          <div className="max-w-[90%] border border-border-default bg-bg-app p-2 font-mono text-[10px] leading-relaxed text-text-secondary/80">
            {agentText}
            {phase === 'agent' && (
              <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-brand-primary align-middle" />
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

const FileTree = () => (
  <div className="flex w-[18%] min-w-[72px] flex-col border-r border-border-default bg-bg-overlay">
    <div className="flex items-center justify-between border-b border-border-default p-2 font-mono text-[10px] font-bold text-text-muted">
      <span>FILES</span>
      <MoreVertical size={10} className="text-text-muted" />
    </div>
    <div className="flex flex-col gap-0.5 py-1.5">
      <div className="flex items-center gap-1.5 px-2 py-1 text-text-muted">
        <Folder size={12} className="text-brand-primary" />
        <span className="font-mono text-[10px] truncate">src</span>
      </div>
      <div className="flex items-center gap-1.5 border-l-2 border-brand-primary bg-brand-primary/10 px-2 py-1 text-text-primary">
        <FileCode size={12} className="text-brand-primary" />
        <span className="font-mono text-[10px] truncate">main.py</span>
      </div>
    </div>
  </div>
);

interface EditorPanelProps {
  phase: HeroPhase;
  codeLines: string[];
  deployLines: string[];
  deployLineIndex: number;
  isDeployDone: boolean;
}

const EditorPanel = ({
  phase,
  codeLines,
  deployLines,
  deployLineIndex,
  isDeployDone,
}: EditorPanelProps) => (
  <div className="flex min-w-0 flex-1 flex-col bg-bg-app">
    {/* Editor Tabs */}
    <div className="flex border-b border-border-default bg-bg-panel">
      <div className="flex items-center gap-1.5 border-r border-border-default/30 border-t-2 border-t-brand-primary bg-bg-app px-3 py-1.5 font-mono text-[10px] text-text-primary">
        <FileCode size={12} className="text-brand-primary" />
        main.py
      </div>
    </div>

    {/* Code Editor */}
    <div className="flex min-h-0 flex-1 overflow-hidden bg-bg-app font-mono text-xs">
      {/* Line Numbers */}
      <div className="w-8 shrink-0 select-none border-r border-border-default/20 bg-bg-overlay py-2 pr-1.5 text-right text-[10px] leading-5 text-text-muted/40">
        {codeLines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
        {phase === 'code' && <div className="leading-5">·</div>}
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden px-2 py-2 leading-5 text-gray-400">
        {codeLines.map((line, i) => (
          <div key={i} className={getCodeLineColor(line)}>
            {line}
          </div>
        ))}
        {phase === 'code' && (
          <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-brand-primary align-middle" />
        )}
      </div>
    </div>

    {/* Terminal */}
    <Terminal
      phase={phase}
      deployLines={deployLines}
      deployLineIndex={deployLineIndex}
      isDeployDone={isDeployDone}
    />
  </div>
);

interface TerminalProps {
  phase: HeroPhase;
  deployLines: string[];
  deployLineIndex: number;
  isDeployDone: boolean;
}

const Terminal = ({ phase, deployLines, deployLineIndex, isDeployDone }: TerminalProps) => (
  <div className="flex flex-shrink-0 flex-col border-t border-border-default bg-black">
    <div className="flex items-center justify-between border-b border-border-default/30 bg-bg-panel px-3 py-1.5">
      <div className="flex items-center gap-3">
        <span className="border-b border-brand-primary pb-0.5 font-mono text-[10px] font-bold text-text-primary">
          TERMINAL
        </span>
        <span className="font-mono text-[10px] text-text-muted">OUTPUT</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
    </div>
    <div className="flex min-h-[48px] flex-col justify-center gap-0.5 px-3 py-2 font-mono text-[10px] text-text-secondary/80">
      {phase === 'deploy' || isDeployDone ? (
        <>
          <div className="flex items-center gap-2 text-brand-accent">
            <span className="select-none">$</span>
            <span>pytholit deploy</span>
          </div>
          {deployLines.slice(0, deployLineIndex).map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 select-none text-text-muted" />
              <span>{line}</span>
            </div>
          ))}
          {isDeployDone && (
            <div className="flex items-center gap-2 font-bold text-brand-accent">
              <span className="w-3 select-none text-text-muted" />
              <span>✓ Deployed</span>
            </div>
          )}
          {phase === 'deploy' && deployLineIndex < deployLines.length && (
            <div className="flex items-center gap-2">
              <span className="w-3 select-none text-text-muted" />
              <span className="h-3 w-2 animate-pulse bg-brand-accent" />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 text-text-muted">
          <span className="select-none">$</span>
          <span>Ready</span>
        </div>
      )}
    </div>
  </div>
);

// Helper function for syntax highlighting
function getCodeLineColor(line: string): string {
  if (line?.includes('class') || line?.includes('def')) {
    return 'text-brand-primary';
  }
  if (line?.includes('self') || line?.includes('await')) {
    return 'text-brand-accent';
  }
  if (line?.includes('"')) {
    return 'text-green-400';
  }
  return 'text-gray-300';
}
