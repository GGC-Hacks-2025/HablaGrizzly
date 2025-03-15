"use client";

import React from 'react';
import Typewriter from 'typewriter-effect';
import { ChatBearIcon } from '@/components';

export type MessageType = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
  typing?: boolean;
}

export default function ChatMessage({ message, typing = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`w-full mb-8 ${isUser ? 'pl-12' : ''}`}>
      {!isUser && (
        <div className="flex items-center mb-2 ml-2">
          <div className="mr-3">
            <ChatBearIcon size="sm" />
          </div>
          <div className="font-medium text-sm text-foreground/70">Grizzly</div>
        </div>
      )}

      <div className={`${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`${
            isUser
              ? 'bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-[85%]'
              : 'bg-secondary text-foreground rounded-2xl px-4 py-3 max-w-[85%]'
          }`}
        >
          {isUser || !typing ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {message.content}
            </div>
          ) : (
            <Typewriter
              options={{
                delay: 30,
                cursor: '<span class="typewriter-cursor"></span>',
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(message.content)
                  .start();
              }}
            />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex justify-end mt-2 mr-2">
          <div className="text-sm text-foreground/60">You</div>
        </div>
      )}
    </div>
  );
}
