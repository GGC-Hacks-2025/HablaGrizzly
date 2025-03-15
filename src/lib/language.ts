export type SupportedLanguage = 'english' | 'spanish';

// Common Spanish words and patterns to detect Spanish text
const spanishPatterns = [
  /¿/, /¡/, /ñ/, /á/, /é/, /í/, /ó/, /ú/,
  /\b(hola|gracias|buenos días|buenas tardes|buenas noches|por favor|cómo|qué|cuál|dónde|cuándo|quién|por qué)\b/i
];

// Simple language detection based on common patterns
export function detectLanguage(text: string): SupportedLanguage {
  // Check for Spanish patterns
  for (const pattern of spanishPatterns) {
    if (pattern.test(text)) {
      return 'spanish';
    }
  }
  return 'english'; // Default to English
}

const translations = {
  welcome: {
    english: "Hello! I'm Grizzly, your bilingual AI assistant. How can I help you today?",
    spanish: "¡Hola! Soy Grizzly, tu asistente bilingüe. ¿Cómo puedo ayudarte hoy?"
  },
  responses: [
    {
      english: "I'm here to help! Could you provide more details?",
      spanish: "¡Estoy aquí para ayudar! ¿Podrías proporcionar más detalles?"
    },
    {
      english: "That's interesting! Let me help you with that.",
      spanish: "¡Eso es interesante! Déjame ayudarte con eso."
    },
    {
      english: "I understand. Here's what I can tell you...",
      spanish: "Entiendo. Esto es lo que puedo decirte..."
    },
    {
      english: "Thanks for your message! Is there anything specific you'd like to know?",
      spanish: "¡Gracias por tu mensaje! ¿Hay algo específico que te gustaría saber?"
    }
  ],
  imageReceived: {
    english: "I see you've shared an image! Let me take a look...",
    spanish: "¡Veo que has compartido una imagen! Déjame verla..."
  },
  error: {
    english: "I apologize, but I encountered an error. Could you try again?",
    spanish: "Lo siento, pero encontré un error. ¿Podrías intentarlo de nuevo?"
  }
};

// Get welcome message in specified language
export function getWelcomeMessage(language: SupportedLanguage): string {
  return translations.welcome[language];
}

// Get a random response in specified language
export function getRandomResponse(language: SupportedLanguage): string {
  const randomIndex = Math.floor(Math.random() * translations.responses.length);
  return translations.responses[randomIndex][language];
}

// Get image received message in specified language
export function getImageReceivedMessage(language: SupportedLanguage): string {
  return translations.imageReceived[language];
}

// Get error message in specified language
export function getErrorMessage(language: SupportedLanguage): string {
  return translations.error[language];
}
