"use client";

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BearMascot, ChatHeader, ChatInput, ChatMessage, FeedbackForm, MessageType, ChatBearIcon } from '@/components';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  SupportedLanguage,
  detectLanguage,
  getWelcomeMessage,
  getRandomResponse,
  getImageReceivedMessage,
  getDocumentReceivedMessage
} from '@/lib/language';
import { langFromCode, langToCode } from '@/lib/languages';

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState<SupportedLanguage>('english');
  const [userLanguage, setUserLanguage] = useState<SupportedLanguage>('english');
  const [processingImage, setProcessingImage] = useState(false);

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
    setUserLanguage(detectedLanguage);
    
    // Update UI language based on detected language
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
    setShowWelcome(false);

    try {
      // Convert language names to ISO codes for the API
      const sourceLanguageCode = detectedLanguage === 'english' ? 'en' : 'es';
      const targetLanguageCode = detectedLanguage === 'english' ? 'es' : 'en'; // Translate to the opposite language
      
      // Call the translation API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          sourceLanguage: sourceLanguageCode,
          targetLanguage: targetLanguageCode,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      
      // Create the AI response
      const translatedResponse = data.translatedText;
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: translatedResponse || getRandomResponse(detectedLanguage),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Sorry, there was an error processing your message.');
      
      // Fallback to random response
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getRandomResponse(detectedLanguage),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendImage = async (image: File) => {
    // Add user message
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: language === 'english' ? `[Image: ${image.name}]` : `[Imagen: ${image.name}]`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setProcessingImage(true);
    setShowWelcome(false);

    try {
      // Create a FormData object to send the image
      const formData = new FormData();
      formData.append('image', image);
      formData.append('action', 'analyze'); // 'analyze', 'translate', or 'extract'
      
      // Determine target language based on current language
      const targetLanguage = language === 'english' ? 'en' : 'es';
      formData.append('targetLanguage', targetLanguage);
      
      // Call the image analysis API
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image analysis failed');
      }
      
      const data = await response.json();
      
      // Create response based on the analysis
      let responseContent = '';
      
      if (data.phi4Analysis) {
        // Use Phi-4 analysis as the primary content
        responseContent = data.phi4Analysis;
      } else if (data.googleVision) {
        // Fallback to a summary of Google Vision results
        const labels = data.googleVision.labels.slice(0, 5).map((l: any) => l.description).join(', ');
        const text = data.googleVision.text || '';
        
        responseContent = language === 'english' 
          ? `I see the following in your image: ${labels}. ${text ? `I also found this text: "${text}"` : ''}`
          : `Veo lo siguiente en tu imagen: ${labels}. ${text ? `También encontré este texto: "${text}"` : ''}`;
      } else {
        // Fallback message
        responseContent = getImageReceivedMessage(language);
      }
      
      // Add assistant response
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Sorry, there was a problem processing your image.');
      
      // Fallback to basic response
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getImageReceivedMessage(language),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
      setProcessingImage(false);
    }
  };

  const handleSendDocument = (doc: File) => {
    // In a real app, you would upload this document to a server
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: language === 'english' ? `[Document: ${doc.name}]` : `[Documento: ${doc.name}]`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowWelcome(false);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getDocumentReceivedMessage(language),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleEndChat = () => {
    setShowFeedback(true);
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowFeedback(false);
    setShowWelcome(true);

    // Add initial welcome message
    setTimeout(() => {
      const welcomeMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: getWelcomeMessage(language),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  if (showFeedback) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <FeedbackForm
          onClose={() => setShowFeedback(false)}
          onNewChat={handleNewChat}
          language={language}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {!showWelcome && (
        <div className="container flex flex-col h-screen max-w-3xl p-4">
          <ChatHeader
            language={language}
            onLanguageChange={handleLanguageChange}
          />

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  typing={isTyping && message === messages[messages.length - 1] && message.role === 'assistant'}
                />
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="mr-2">
                    <ChatBearIcon size="sm" />
                  </div>
                  <div className="bg-secondary text-foreground py-3 px-4 rounded-lg rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length > 1 && !isTyping && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  onClick={handleEndChat}
                  className="text-foreground/60 hover:text-foreground"
                >
                  {language === 'english' ? 'End Chat' : 'Terminar Chat'}
                </Button>
              </div>
            )}
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onSendImage={handleSendImage}
            onSendDocument={handleSendDocument}
            disabled={isTyping}
            language={language}
          />
        </div>
      )}

      {showWelcome && (
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <div className="text-center mb-24">
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 md:w-64 md:h-64 relative">
                <Image
                  src="/Untitled design 2.png"
                  alt="Grizzly Design"
                  width={256}
                  height={256}
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'english' ? 'Hi, I\'m Grizzly.' : '¡Hola! Soy Grizzly.'}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-300 mb-16">
              {language === 'english' ? 'How can I help you today?' : '¿Cómo puedo ayudarte hoy?'}
            </p>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-xl bg-secondary p-2 shadow-md">
                <textarea
                  className="w-full resize-none bg-transparent p-3 text-foreground outline-none"
                  placeholder={language === 'english' ? 'Message Grizzly' : 'Mensaje para Grizzly'}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const content = e.currentTarget.value.trim();
                      if (content) {
                        handleSendMessage(content);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                ></textarea>

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="text-gray-400 hover:text-white p-1" aria-label="Upload file">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" />
                      <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>

                  <button
                    className="bg-green-700 text-white rounded-full p-1"
                    aria-label="Send"
                    onClick={() => {
                      const textarea = document.querySelector('textarea');
                      if (textarea && textarea.value.trim()) {
                        handleSendMessage(textarea.value.trim());
                        textarea.value = '';
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
