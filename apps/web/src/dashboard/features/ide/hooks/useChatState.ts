import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, FileNode } from '@/shared/types';

export function useChatState(activeFile: FileNode | null) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'agent',
      text: 'Pytholit Agent v2.0 online. I have context of your file tree. What are we building?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'ask' | 'editor'>('ask');
  const [selectedLLM, setSelectedLLM] = useState<string>('claude');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [llmDropdownOpen, setLlmDropdownOpen] = useState(false);
  const chatFormRef = useRef<HTMLFormElement>(null);

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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: chatInput,
    };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'agent',
          text: `I can help you with that. I've analyzed ${activeFile?.name || 'the project'} and updated the context.`,
        },
      ]);
    }, 1000);
  };

  return {
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
  };
}
