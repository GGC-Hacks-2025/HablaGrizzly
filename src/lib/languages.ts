import ISO6391 from 'iso-639-1';

// Map of language names to ISO codes
export const languageOptions = ISO6391.getAllNames().map(name => ({
  label: name,
  value: ISO6391.getCode(name)
})).sort((a, b) => a.label.localeCompare(b.label));

// Most common languages for quick access
export const commonLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Russian', value: 'ru' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Italian', value: 'it' },
];

/**
 * Convert a language code to its name
 * @param code - ISO 639-1 language code
 * @returns Language name
 */
export function langFromCode(code: string): string {
  return ISO6391.getName(code);
}

/**
 * Convert a language name to its code
 * @param name - Language name
 * @returns ISO 639-1 language code
 */
export function langToCode(name: string): string {
  return ISO6391.getCode(name);
}

/**
 * Check if a given code is a valid ISO 639-1 language code
 * @param code - Language code to validate
 * @returns Boolean indicating if the code is valid
 */
export function isValidLanguageCode(code: string): boolean {
  return ISO6391.validate(code);
} 