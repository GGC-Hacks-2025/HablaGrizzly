"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { toast } from 'sonner';
import { SupportedLanguage } from '@/lib/language';

interface FeedbackFormProps {
  onClose: () => void;
  onNewChat: () => void;
  language: SupportedLanguage;
}

export default function FeedbackForm({ onClose, onNewChat, language }: FeedbackFormProps) {
  const [helpfulRating, setHelpfulRating] = useState(0);
  const [easeOfUseRating, setEaseOfUseRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Text translations
  const texts = {
    title: language === 'english' ? 'Your Feedback' : 'Tu Opinión',
    description: language === 'english'
      ? 'Please rate your experience with Speak Grizzly'
      : 'Por favor califica tu experiencia con Habla Grizzly',
    helpfulQuestion: language === 'english'
      ? 'How helpful was the assistant?'
      : '¿Qué tan útil fue el asistente?',
    easeQuestion: language === 'english'
      ? 'How easy was it to use?'
      : '¿Qué tan fácil fue de usar?',
    additionalFeedback: language === 'english'
      ? 'Additional feedback (optional)'
      : 'Comentarios adicionales (opcional)',
    placeholder: language === 'english'
      ? 'Tell us what you think...'
      : 'Dinos lo que piensas...',
    skip: language === 'english' ? 'Skip' : 'Omitir',
    submit: language === 'english' ? 'Submit Feedback' : 'Enviar Opinión',
    thankYou: language === 'english' ? 'Thank you for your feedback!' : '¡Gracias por tu opinión!',
    feedbackSubmitted: language === 'english' ? 'Feedback Submitted' : 'Opinión Enviada',
    close: language === 'english' ? 'Close' : 'Cerrar',
    newChat: language === 'english' ? 'Start New Chat' : 'Iniciar Nuevo Chat',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you would send this data to a server
    console.log({
      helpfulRating,
      easeOfUseRating,
      feedback
    });

    toast.success(texts.thankYou);
    setSubmitted(true);
  };

  const renderStars = (rating: number, setRating: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-2xl px-1 focus:outline-none"
          >
            {star <= rating ? (
              <BsStarFill className="text-yellow-500" />
            ) : (
              <BsStar className="text-gray-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{texts.feedbackSubmitted}</CardTitle>
          <CardDescription>{texts.thankYou}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>{texts.close}</Button>
          <Button onClick={onNewChat}>{texts.newChat}</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{texts.title}</CardTitle>
          <CardDescription>{texts.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium">{texts.helpfulQuestion}</label>
            {renderStars(helpfulRating, setHelpfulRating)}
          </div>

          <div className="space-y-2">
            <label className="font-medium">{texts.easeQuestion}</label>
            {renderStars(easeOfUseRating, setEaseOfUseRating)}
          </div>

          <div className="space-y-2">
            <label className="font-medium" htmlFor="feedback">{texts.additionalFeedback}</label>
            <Textarea
              id="feedback"
              placeholder={texts.placeholder}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} type="button">{texts.skip}</Button>
          <Button type="submit" disabled={!helpfulRating || !easeOfUseRating}>{texts.submit}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
