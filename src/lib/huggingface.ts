import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Model ID for Microsoft's Phi-4-multimodal-instruct model
const PHI_4_MODEL_ID = 'microsoft/Phi-4-multimodal-instruct';

interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  system?: string;
}

/**
 * Translate text using the Phi-4 model
 * @param text - Text to translate
 * @param options - Configuration options for translation
 * @returns Translated text
 */
export async function translateText(text: string, options: TranslationOptions): Promise<string> {
  const { sourceLanguage, targetLanguage, system } = options;
  
  const systemPrompt = system || 
    `You are a helpful translator that accurately translates text ` +
    `${sourceLanguage ? `from ${sourceLanguage} ` : ''}to ${targetLanguage}. ` +
    `Provide only the translation without explanations.`;
  
  try {
    const response = await hf.textGeneration({
      model: PHI_4_MODEL_ID,
      inputs: text,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.2,
        system: systemPrompt,
      }
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}

/**
 * Analyze an image using the Phi-4 multimodal model
 * @param imageUrl - URL or base64 data URL of the image
 * @param prompt - Text prompt to guide the analysis
 * @returns Analysis result text
 */
export async function analyzeImageWithPhi4(imageUrl: string, prompt: string): Promise<string> {
  try {
    // For multimodal models, we need to prepare the inputs differently
    const response = await hf.multimodalTextGeneration({
      model: PHI_4_MODEL_ID,
      inputs: {
        image: imageUrl,
        text: prompt
      },
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.2,
      }
    });
    
    return response.generated_text;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image with Phi-4 model');
  }
}

/**
 * Extract text from an image and translate it
 * @param imageUrl - URL or base64 data URL of the image
 * @param targetLanguage - Target language for translation
 * @returns Translated text from the image
 */
export async function extractAndTranslateImageText(
  imageUrl: string, 
  targetLanguage: string
): Promise<string> {
  try {
    const prompt = `Extract all text from this image and translate it to ${targetLanguage}. Return only the translated text.`;
    
    return await analyzeImageWithPhi4(imageUrl, prompt);
  } catch (error) {
    console.error('Extract and translate error:', error);
    throw new Error('Failed to extract and translate text from image');
  }
} 