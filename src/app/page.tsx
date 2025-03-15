"use client";

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatHeader, ChatInput, ChatMessage, MessageType } from '@/components';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import {
  SupportedLanguage,
  detectLanguage,
  getWelcomeMessage,
  getRandomResponse,
  getImageReceivedMessage,
  getErrorMessage
} from '@/lib/language';

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('english');

  // Handle language change
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  };

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: MessageType = {
          id: uuidv4(),
          role: 'assistant',
          content: getWelcomeMessage(language),
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }, 1000);
    }
  }, [messages.length, language]);

  const handleSendMessage = async (content: string) => {
    // Detect user's language
    const detectedLanguage = detectLanguage(content);
    setLanguage(detectedLanguage);

    // Add user message
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add assistant response
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getRandomResponse(detectedLanguage),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getErrorMessage(detectedLanguage),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendImage = async (image: File) => {
    // Add user message with image
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: language === 'english' ? `[Image: ${image.name}]` : `[Imagen: ${image.name}]`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add assistant response
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getImageReceivedMessage(language),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Add error message
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getErrorMessage(language),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <ChatHeader language={language} onLanguageChange={handleLanguageChange} />
        
        <div className="flex flex-col space-y-4 p-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="text-gray-500 italic">
              {language === 'english' ? 'Typing...' : 'Escribiendo...'}
            </div>
          )}
        </div>

        <ChatInput 
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          language={language}
        />
      </Card>
    </main>
  );
}
