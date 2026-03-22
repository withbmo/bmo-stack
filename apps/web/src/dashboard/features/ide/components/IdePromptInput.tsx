'use client';

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from '@/components/ai-elements/attachments';
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '@/components/ai-elements/model-selector';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
import { CheckIcon, GlobeIcon } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const models = [
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4o',
    name: 'GPT-4o',
    providers: ['openai', 'azure'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    providers: ['openai', 'azure'],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-opus-4-20250514',
    name: 'Claude 4 Opus',
    providers: ['anthropic', 'azure', 'google', 'amazon-bedrock'],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-sonnet-4-20250514',
    name: 'Claude 4 Sonnet',
    providers: ['anthropic', 'azure', 'google', 'amazon-bedrock'],
  },
  {
    chef: 'Google',
    chefSlug: 'google',
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    providers: ['google'],
  },
] as const;

interface AttachmentItemProps {
  attachment: {
    id: string;
    type: 'file';
    filename?: string;
    mediaType: string;
    url: string;
  };
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(() => onRemove(attachment.id), [onRemove, attachment.id]);
  return (
    <Attachment data={attachment} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = 'AttachmentItem';

type Model = (typeof models)[number];

interface ModelItemProps {
  m: Model;
  selectedModel: string;
  onSelect: (id: string) => void;
}

const ModelItem = memo(({ m, selectedModel, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id]);
  return (
    <ModelSelectorItem onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {m.providers.map(provider => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {selectedModel === m.id ? <CheckIcon className="ml-auto size-4" /> : <div className="ml-auto size-4" />}
    </ModelSelectorItem>
  );
});

ModelItem.displayName = 'ModelItem';

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback((id: string) => attachments.remove(id), [attachments]);

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map(attachment => (
        <AttachmentItem attachment={attachment} key={attachment.id} onRemove={handleRemove} />
      ))}
    </Attachments>
  );
};

export function IdePromptInput({
  selectedLLM,
  setSelectedLLM,
  isThinking,
  onSubmitText,
}: {
  selectedLLM: string;
  setSelectedLLM: (id: string) => void;
  isThinking: boolean;
  onSubmitText: (text: string) => void;
}) {
  const [model, setModel] = useState<string>(selectedLLM || models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const status = useMemo(() => (isThinking ? 'streaming' : 'ready'), [isThinking]);

  useEffect(() => {
    const exists = models.some(m => m.id === selectedLLM);
    if (exists && selectedLLM !== model) {
      setModel(selectedLLM);
      return;
    }

    if (!exists) {
      const fallback = models[0].id;
      setModel(fallback);
      if (selectedLLM !== fallback) setSelectedLLM(fallback);
    }
  }, [selectedLLM, model, setSelectedLLM]);

  const selectedModelData = models.find(m => m.id === model) ?? models[0];

  const handleModelSelect = useCallback(
    (id: string) => {
      setModel(id);
      setSelectedLLM(id);
      setModelSelectorOpen(false);
    },
    [setSelectedLLM]
  );

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text);
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      onSubmitText(message.text ?? '');
    },
    [onSubmitText]
  );

  return (
    <div className="w-full shrink-0 border-t border-border bg-card p-2">
      <PromptInputProvider>
        <PromptInput className="w-full" globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputAttachmentsDisplay />
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
          <PromptInputFooter className="gap-2">
            <PromptInputTools className="min-w-0 flex-1 overflow-x-auto pr-1">
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>

              <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="shrink-0">
                    {selectedModelData?.chefSlug && <ModelSelectorLogo provider={selectedModelData.chefSlug} />}
                    {selectedModelData?.name && <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {['OpenAI', 'Anthropic', 'Google'].map(chef => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter(m => m.chef === chef)
                          .map(m => (
                            <ModelItem key={m.id} m={m} onSelect={handleModelSelect} selectedModel={model} />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit className="shrink-0" status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
