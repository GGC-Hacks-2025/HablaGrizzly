"use client";

import React, { useState, useRef, FormEvent, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IoSend, IoCamera, IoDocumentAttach, IoCloudUpload, IoClose } from 'react-icons/io5';
import { toast } from 'sonner';
import { SupportedLanguage } from '@/lib/language';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage?: (imageFile: File) => void;
  onSendDocument?: (documentFile: File) => void;
  disabled?: boolean;
  language: SupportedLanguage;
}

export default function ChatInput({
  onSendMessage,
  onSendImage,
  onSendDocument,
  disabled = false,
  language
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCameraPrompt, setShowCameraPrompt] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
    // Reset the file input
    e.target.value = '';
    setShowUploadArea(false);
  };

  const processFile = (file: File) => {
    // Handle different file types
    if (file.type.startsWith('image/')) {
      onSendImage?.(file);
      toast.success(language === 'english' ? 'Image uploaded' : 'Imagen subida');
    } else {
      onSendDocument?.(file);
      toast.success(language === 'english' ? 'Document uploaded' : 'Documento subido');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // Get placeholder text based on language
  const getPlaceholder = () => {
    return language === 'english'
      ? 'Type your message here...'
      : 'Escribe tu mensaje aquí...';
  };

  const openCamera = () => {
    setShowCameraPrompt(true);
  };
  
  const takePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
      setShowCameraPrompt(false);
    }
  };

  return (
    <div className="border-t border-border pt-4">
      {/* Camera Permission Prompt */}
      {showCameraPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-6 rounded-lg max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'english' ? 'Camera Access' : 'Acceso a la Cámara'}
            </h3>
            <p className="mb-6">
              {language === 'english' 
                ? 'Allow camera access to take a photo and share it with Grizzly?' 
                : '¿Permitir acceso a la cámara para tomar una foto y compartirla con Grizzly?'}
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCameraPrompt(false)}
              >
                {language === 'english' ? 'Cancel' : 'Cancelar'}
              </Button>
              <Button 
                onClick={takePhoto}
                className="bg-primary text-white"
              >
                {language === 'english' ? 'Allow' : 'Permitir'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dropbox-like Upload Area Modal */}
      {showUploadArea && (
        <div className="upload-area-container">
          <div className="upload-area">
            <div className="upload-area-header">
              <span>
                {language === 'english' ? 'Upload Files' : 'Subir Archivos'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUploadArea(false)}
              >
                <IoClose className="h-5 w-5" />
              </Button>
            </div>

            <div
              className={`dropbox-upload ${isDragging ? 'border-primary' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <IoCloudUpload className="upload-icon" />
              <div className="font-medium">
                {language === 'english'
                  ? 'Drop your files here'
                  : 'Arrastra tus archivos aquí'}
              </div>
              <div className="drag-indicator">
                {language === 'english'
                  ? 'or click to browse'
                  : 'o haz clic para explorar'}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                {language === 'english' ? 'Choose File' : 'Elegir Archivo'}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                className="camera-button w-full"
                onClick={() => {
                  openCamera();
                  setShowUploadArea(false);
                }}
              >
                <IoCamera className="h-5 w-5 mr-2" />
                {language === 'english' ? 'Take Photo' : 'Tomar Foto'}
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-xl bg-secondary p-2 shadow-md">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="min-h-[60px] resize-none bg-transparent text-foreground outline-none border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />

          <div className="absolute right-2 bottom-2 flex items-center space-x-2">
            <button
              onClick={openCamera}
              className="text-muted-foreground hover:text-foreground p-1 relative"
              disabled={disabled}
              type="button"
              aria-label={language === 'english' ? 'Take Photo' : 'Tomar Foto'}
            >
              <IoCamera className="h-5 w-5" />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                capture="environment"
                className="hidden"
              />
            </button>

            <button
              onClick={() => setShowUploadArea(true)}
              className="text-muted-foreground hover:text-foreground p-1"
              disabled={disabled}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" />
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!message.trim() || disabled}
              className={`bg-primary text-primary-foreground rounded-full p-1 ${(!message.trim() || disabled) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
