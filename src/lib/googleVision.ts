import { ImageAnnotatorClient } from '@google-cloud/vision';
import { promises as fs } from 'fs';

// This configuration will work in a server environment (API routes)
// The credentials will be loaded from the environment variable
let visionClient: ImageAnnotatorClient;

// Initialize the client with credentials
try {
  // For serverless environments, we initialize with explicit credentials
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    visionClient = new ImageAnnotatorClient({ credentials });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Standard way using credentials file path
    visionClient = new ImageAnnotatorClient();
  } else {
    console.error("Google Cloud Vision credentials not found");
  }
} catch (error) {
  console.error("Failed to initialize Google Cloud Vision client:", error);
}

/**
 * Detect text in an image using Google Cloud Vision API
 * @param imageBuffer - Buffer containing image data
 * @returns Detected text from the image
 */
export async function detectText(imageBuffer: Buffer): Promise<string> {
  try {
    const [result] = await visionClient.textDetection(imageBuffer);
    const detections = result.textAnnotations || [];
    
    // The first annotation typically contains the full text
    return detections[0]?.description || '';
  } catch (error) {
    console.error('Error detecting text:', error);
    throw new Error('Failed to detect text in image');
  }
}

/**
 * Analyze an image using Google Cloud Vision API
 * @param imageBuffer - Buffer containing image data
 * @returns Object with analysis results
 */
export async function analyzeImage(imageBuffer: Buffer) {
  try {
    // Perform multiple types of detection in parallel
    const [
      labelResults,
      objectResults,
      faceResults,
      textResults
    ] = await Promise.all([
      visionClient.labelDetection(imageBuffer),
      visionClient.objectLocalization(imageBuffer),
      visionClient.faceDetection(imageBuffer),
      visionClient.textDetection(imageBuffer)
    ]);

    return {
      labels: labelResults[0].labelAnnotations || [],
      objects: objectResults[0].localizedObjectAnnotations || [],
      faces: faceResults[0].faceAnnotations || [],
      text: textResults[0].textAnnotations?.[0]?.description || ''
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
} 