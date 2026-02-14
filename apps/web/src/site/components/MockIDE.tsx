'use client';

import {
  Code2,
  Database,
  Play,
  Folder,
  FileCode,
  MessageSquare,
  Bot,
  MoreVertical,
  Activity,
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
    <div className="relative nexus-shadow border border-nexus-gray bg-[#050505] overflow-hidden">
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
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-nexus-purple" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-nexus-purple" />
    </div>
  );
};

// Sub-components

const IDEHeader = () => (
  <div className="h-10 border-b border-nexus-gray flex items-center justify-between px-3 bg-[#080808]">
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold">demo-project</span>
      <span className="text-[9px] bg-nexus-gray/20 px-1.5 py-0.5 text-nexus-muted font-mono">
        Running
      </span>
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 px-2 py-1 bg-nexus-purple text-white text-[10px] font-mono font-bold">
        <Play size={10} fill="currentColor" /> RUN
      </button>
      <div className="w-6 h-6 rounded-full bg-nexus-purple/20 border border-nexus-purple flex items-center justify-center text-[9px] font-bold text-nexus-purple">
        U1
      </div>
    </div>
  </div>
);

const NavSidebar = () => (
  <div className="w-12 border-r border-nexus-gray bg-[#050505] flex flex-col items-center py-2">
    <div className="w-full h-10 flex items-center justify-center border-l-2 border-nexus-purple bg-[#0A0A0A] text-nexus-purple">
      <Code2 size={18} strokeWidth={1.5} />
    </div>
    <div className="w-full h-10 flex items-center justify-center border-l-2 border-transparent text-nexus-muted hover:text-white hover:bg-white/5">
      <Activity size={18} strokeWidth={1.5} />
    </div>
    <div className="w-full h-10 flex items-center justify-center border-l-2 border-transparent text-nexus-muted hover:text-white hover:bg-white/5">
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
  <div className="w-[22%] min-w-[100px] border-r border-nexus-gray flex flex-col bg-[#080808]">
    <div className="p-2 border-b border-nexus-gray flex items-center gap-1.5 text-[10px] font-mono font-bold text-nexus-accent">
      <Bot size={12} /> AI ARCHITECT
    </div>
    <div className="flex-1 overflow-hidden p-2 space-y-2">
      {/* User Message */}
      <div className="flex gap-2">
        <div className="w-5 h-5 shrink-0 rounded-none border bg-nexus-gray/20 border-nexus-gray flex items-center justify-center text-nexus-muted">
          <MessageSquare size={10} />
        </div>
        <div className="p-2 text-[10px] leading-relaxed border bg-nexus-purple/10 border-nexus-purple/30 text-nexus-light font-mono max-w-[90%]">
          {userMessage}
          {phase === 'chat' && (
            <span className="w-1.5 h-3 bg-nexus-purple inline-block ml-0.5 animate-pulse align-middle" />
          )}
        </div>
      </div>

      {/* Agent Reply */}
      {agentText && (
        <div className="flex gap-2">
          <div className="w-5 h-5 shrink-0 rounded-none border bg-nexus-purple/20 border-nexus-purple flex items-center justify-center text-nexus-purple">
            <Bot size={10} />
          </div>
          <div className="p-2 text-[10px] leading-relaxed border bg-[#0A0A0A] border-nexus-gray text-nexus-light/80 font-mono max-w-[90%]">
            {agentText}
            {phase === 'agent' && (
              <span className="w-1.5 h-3 bg-nexus-purple inline-block ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

const FileTree = () => (
  <div className="w-[18%] min-w-[72px] border-r border-nexus-gray flex flex-col bg-[#050505]">
    <div className="p-2 border-b border-nexus-gray flex items-center justify-between text-[10px] font-mono font-bold text-nexus-muted">
      <span>FILES</span>
      <MoreVertical size={10} className="text-nexus-muted" />
    </div>
    <div className="py-1.5 flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 py-1 px-2 text-nexus-muted">
        <Folder size={12} className="text-nexus-purple" />
        <span className="font-mono text-[10px] truncate">src</span>
      </div>
      <div className="flex items-center gap-1.5 py-1 px-2 bg-nexus-purple/10 border-l-2 border-nexus-purple text-white">
        <FileCode size={12} className="text-nexus-purple" />
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
  <div className="flex-1 flex flex-col min-w-0 bg-[#0C0C0C]">
    {/* Editor Tabs */}
    <div className="flex border-b border-nexus-gray bg-[#080808]">
      <div className="px-3 py-1.5 bg-[#0C0C0C] border-t-2 border-t-nexus-purple text-[10px] font-mono text-white flex items-center gap-1.5 border-r border-nexus-gray/30">
        <FileCode size={12} className="text-nexus-purple" />
        main.py
      </div>
    </div>

    {/* Code Editor */}
    <div className="flex-1 flex font-mono text-xs overflow-hidden bg-[#0C0C0C] min-h-0">
      {/* Line Numbers */}
      <div className="w-8 shrink-0 bg-[#0A0A0A] border-r border-nexus-gray/20 text-nexus-muted/40 text-right pr-1.5 py-2 select-none text-[10px] leading-5">
        {codeLines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
        {phase === 'code' && <div className="leading-5">·</div>}
      </div>

      {/* Code Content */}
      <div className="flex-1 py-2 px-2 text-gray-400 overflow-hidden leading-5">
        {codeLines.map((line, i) => (
          <div key={i} className={getCodeLineColor(line)}>
            {line}
          </div>
        ))}
        {phase === 'code' && (
          <span className="w-2 h-4 bg-nexus-purple inline-block ml-0.5 animate-pulse align-middle" />
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
  <div className="border-t border-nexus-gray flex flex-col bg-black flex-shrink-0">
    <div className="flex items-center justify-between px-3 py-1.5 bg-[#080808] border-b border-nexus-gray/30">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono font-bold text-white border-b border-nexus-purple pb-0.5">
          TERMINAL
        </span>
        <span className="text-[10px] font-mono text-nexus-muted">OUTPUT</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
    </div>
    <div className="px-3 py-2 font-mono text-[10px] min-h-[48px] flex flex-col justify-center gap-0.5 text-nexus-light/80">
      {phase === 'deploy' || isDeployDone ? (
        <>
          <div className="flex items-center gap-2 text-nexus-accent">
            <span className="select-none">$</span>
            <span>pytholit deploy</span>
          </div>
          {deployLines.slice(0, deployLineIndex).map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-nexus-muted select-none w-3" />
              <span>{line}</span>
            </div>
          ))}
          {isDeployDone && (
            <div className="flex items-center gap-2 text-nexus-accent font-bold">
              <span className="text-nexus-muted select-none w-3" />
              <span>✓ Deployed</span>
            </div>
          )}
          {phase === 'deploy' && deployLineIndex < deployLines.length && (
            <div className="flex items-center gap-2">
              <span className="text-nexus-muted select-none w-3" />
              <span className="w-2 h-3 bg-nexus-accent animate-pulse" />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 text-nexus-muted">
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
    return 'text-nexus-purple';
  }
  if (line?.includes('self') || line?.includes('await')) {
    return 'text-nexus-accent';
  }
  if (line?.includes('"')) {
    return 'text-green-400';
  }
  return 'text-gray-300';
}
