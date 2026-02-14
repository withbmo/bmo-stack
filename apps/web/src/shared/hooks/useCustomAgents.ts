import { useState, useCallback } from 'react';

export interface CustomAgent {
  id: string;
  name: string;
  apiKey: string;
  api: string;
}

interface UseCustomAgentsReturn {
  agents: CustomAgent[];
  newAgentName: string;
  newAgentApiKey: string;
  newAgentApi: string;
  setNewAgentName: (value: string) => void;
  setNewAgentApiKey: (value: string) => void;
  setNewAgentApi: (value: string) => void;
  addAgent: (e: React.FormEvent) => void;
  removeAgent: (id: string) => void;
  canSubmit: boolean;
}

export function useCustomAgents(): UseCustomAgentsReturn {
  const [agents, setAgents] = useState<CustomAgent[]>([]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentApiKey, setNewAgentApiKey] = useState('');
  const [newAgentApi, setNewAgentApi] = useState('');

  const canSubmit = Boolean(
    newAgentName.trim() && newAgentApi.trim() && newAgentApiKey.trim()
  );

  const addAgent = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const name = newAgentName.trim();
    const api = newAgentApi.trim();
    const apiKey = newAgentApiKey.trim();
    if (!name || !api || !apiKey) return;

    setAgents((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, apiKey, api },
    ]);
    setNewAgentName('');
    setNewAgentApiKey('');
    setNewAgentApi('');
  }, [newAgentName, newAgentApi, newAgentApiKey]);

  const removeAgent = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    agents,
    newAgentName,
    newAgentApiKey,
    newAgentApi,
    setNewAgentName,
    setNewAgentApiKey,
    setNewAgentApi,
    addAgent,
    removeAgent,
    canSubmit,
  };
}
