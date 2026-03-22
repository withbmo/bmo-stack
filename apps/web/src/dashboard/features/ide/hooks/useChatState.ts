import { useCallback, useEffect, useRef, useState } from 'react';

import type { AgentContext, AgentMode, ChatMessage, FileNode, ToolStep } from '@/shared/types';

const LLM_OPTIONS = [
  { id: 'claude', label: 'Claude' },
  { id: 'gpt', label: 'GPT-4o' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'mistral', label: 'Mistral' },
] as const;

export { LLM_OPTIONS };

export function useChatState(activeFile: FileNode | null) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'agent',
      text: 'Pytholit Agent online. I have full context of your project. Ask me anything, or switch to **Edit** mode to modify files directly.',
      timestamp: Date.now(),
      status: 'done',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<AgentMode>('ask');
  const [selectedLLM, setSelectedLLM] = useState<string>('claude');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [llmDropdownOpen, setLlmDropdownOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [agentContext, setAgentContext] = useState<AgentContext>({ files: [] });
  const chatFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (activeFile && !agentContext.files.includes(activeFile.name)) {
      setAgentContext(ctx => ({
        ...ctx,
        files: [...ctx.files.slice(-4), activeFile.name],
      }));
    }
  }, [activeFile, agentContext.files]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (chatFormRef.current?.contains(target)) return;
      setModeDropdownOpen(false);
      setLlmDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitMessage = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed || isThinking) return;

      const userMsg: ChatMessage = {
        id: Date.now(),
        role: 'user',
        text: trimmed,
        timestamp: Date.now(),
        contextFiles: agentContext.files.length > 0 ? [...agentContext.files] : undefined,
      };
      setChatMessages(prev => [...prev, userMsg]);
      setIsThinking(true);

      const thinkTime = 800 + Math.random() * 1200;
      setTimeout(() => {
        setIsThinking(false);
        const agentMsg = buildAgentResponse(trimmed, chatMode, activeFile);
        setChatMessages(prev => [...prev, agentMsg]);
      }, thinkTime);
    },
    [isThinking, agentContext.files, chatMode, activeFile]
  );

  const handleChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim() || isThinking) return;
      submitMessage(chatInput);
      setChatInput('');
    },
    [chatInput, isThinking, submitMessage]
  );

  const clearChat = useCallback(() => {
    setChatMessages([
      {
        id: Date.now(),
        role: 'agent',
        text: 'Chat cleared. Ready for a new session.',
        timestamp: Date.now(),
        status: 'done',
      },
    ]);
  }, []);

  return {
    chatMessages,
    chatInput,
    setChatInput,
    handleChatSubmit,
    submitMessage,
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
    clearChat,
  };
}

function buildAgentResponse(
  input: string,
  mode: AgentMode,
  activeFile: FileNode | null
): ChatMessage {
  const lower = input.toLowerCase();
  const id = Date.now() + 1;
  const timestamp = Date.now();

  if (mode === 'edit') {
    return {
      id,
      role: 'agent',
      timestamp,
      status: 'done',
      text: `Applied edit to **${activeFile?.name ?? 'active file'}**.`,
      codeBlocks: [
        {
          language: activeFile?.language ?? 'python',
          filename: activeFile?.name,
          code: `# Applied changes based on: "${input}"\n# Diff preview would appear here`,
        },
      ],
    };
  }

  if (mode === 'agent') {
    const steps: ToolStep[] = [
      { type: 'read', file: activeFile?.name ?? 'main.py' },
      { type: 'search', query: input.slice(0, 40) },
      { type: 'edit', file: activeFile?.name ?? 'main.py', diff: `- # old code\n+ # updated code based on task` },
    ];
    return {
      id,
      role: 'agent',
      timestamp,
      status: 'done',
      toolSteps: steps,
      text: `Completed **"${input}"** — reviewed ${steps.length} steps. Changes applied.`,
    };
  }

  // ask mode
  if (lower.includes('function') || lower.includes('code') || lower.includes('write')) {
    return {
      id,
      role: 'agent',
      timestamp,
      status: 'done',
      text: `Here's an example for your request:`,
      codeBlocks: [
        {
          language: activeFile?.language ?? 'python',
          filename: activeFile?.name,
          code: `def example_function():\n    """Generated based on your request."""\n    pass`,
        },
      ],
    };
  }

  return {
    id,
    role: 'agent',
    timestamp,
    status: 'done',
    text: `I've analyzed ${activeFile?.name ?? 'your project'}. ${
      lower.includes('error') || lower.includes('bug')
        ? 'I found a potential issue. Check the highlighted lines and ensure proper error handling.'
        : lower.includes('explain') || lower.includes('what')
          ? 'This code handles the core logic of your application. Let me know if you need a deeper breakdown.'
          : "Let me know if you'd like me to refactor, test, or extend this further."
    }`,
  };
}
