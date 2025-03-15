// English responses with their Spanish translations
const translations = {
  welcome: {
    english: "Hello! I'm Grizzly, your AI assistant. How can I help you today?",
    spanish: "¡Hola! Soy Grizzly, tu asistente de IA. ¿Cómo puedo ayudarte hoy?"
  },
  responses: [
    {
      english: "I'm here to help! Could you provide more details?",
      spanish: "¡Estoy aquí para ayudar! ¿Podrías proporcionar más detalles?"
    },
    {
      english: "That's an interesting question. Let me think about that...",
      spanish: "Esa es una pregunta interesante. Déjame pensar en eso..."
    },
    {
      english: "I understand what you're asking. Here's what I can tell you...",
      spanish: "Entiendo lo que estás preguntando. Esto es lo que puedo decirte..."
    },
    {
      english: "Thanks for sharing that. Is there anything specific you'd like to know?",
      spanish: "Gracias por compartir eso. ¿Hay algo específico que te gustaría saber?"
    },
    {
      english: "I'd be happy to assist with that. Let me explain...",
      spanish: "Estaré encantado de ayudarte con eso. Déjame explicarte..."
    }
  ],
  imageReceived: {
    english: "I've received your image. Let me analyze it for you...",
    spanish: "He recibido tu imagen. Déjame analizarla para ti..."
  },
  docReceived: {
    english: "I've received your document. Let me process it and extract the information...",
    spanish: "He recibido tu documento. Déjame procesarlo y extraer la información..."
  }
};

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

// Get document received message in specified language
export function getDocumentReceivedMessage(language: SupportedLanguage): string {
  return translations.docReceived[language];
}

// Translate a message for display (simplified version)
export function translateText(text: string, targetLanguage: SupportedLanguage): string {
  // This is a simplified implementation. In a real app, you'd connect to a translation API.
  if (targetLanguage === 'spanish') {
    return `[Traducido]: ${text}`;
  } else {
    return `[Translated]: ${text}`;
  }
}
