'use client';

import type { ChatMessage, ToolStep } from '@/shared/types';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning';

type IdeConversationProps = {
  messages: ChatMessage[];
  isThinking?: boolean;
};

function getStepLabel(step: ToolStep) {
  switch (step.type) {
    case 'read':
      return `Read ${step.file}`;
    case 'edit':
      return `Edited ${step.file}`;
    case 'run':
      return `Ran ${step.command}`;
    case 'search':
      return `Searched "${step.query}"`;
    default:
      return 'Performed action';
  }
}

export function IdeConversation({ messages, isThinking = false }: IdeConversationProps) {
  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent className="gap-3 p-3">
        {messages.length === 0 ? (
          <ConversationEmptyState
            description="Ask the agent anything about your project."
            title="No messages yet"
          />
        ) : null}

        {messages.map(message => {
          const from = message.role === 'user' ? 'user' : 'assistant';
          return (
            <Message from={from} key={message.id}>
              <MessageContent className={from === 'assistant' ? 'w-full max-w-full rounded-lg border border-border bg-muted/20 px-3 py-2' : ''}>
                {from === 'assistant' ? (
                  <MessageResponse>{message.text}</MessageResponse>
                ) : (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}

                {message.codeBlocks?.length ? (
                  <div className="mt-2 space-y-2">
                    {message.codeBlocks.map((block, index) => (
                      <pre
                        className="overflow-x-auto rounded-md border border-border bg-background p-2 text-xs"
                        key={`${message.id}-code-${index}`}
                      >
                        <code>{block.code}</code>
                      </pre>
                    ))}
                  </div>
                ) : null}

                {message.toolSteps?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                    {message.toolSteps.map((step, index) => (
                      <li key={`${message.id}-step-${index}`}>{getStepLabel(step)}</li>
                    ))}
                  </ul>
                ) : null}
              </MessageContent>
            </Message>
          );
        })}

        {isThinking ? (
          <Message from="assistant">
            <MessageContent className="rounded-lg border border-border bg-muted/20 px-3 py-2">
                <Reasoning defaultOpen isStreaming>
                  <ReasoningTrigger />
                  <ReasoningContent>{`Inspecting project context.
Reviewing related files and recent messages.
Preparing the best next response.`}</ReasoningContent>
                </Reasoning>
              </MessageContent>
            </Message>
          ) : null}
      </ConversationContent>

      <ConversationScrollButton />
    </Conversation>
  );
}
