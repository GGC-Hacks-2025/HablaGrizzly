import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/googleVision';
import { analyzeImageWithPhi4, extractAndTranslateImageText } from '@/lib/huggingface';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const targetLanguage = formData.get('targetLanguage') as string || 'en';
    const action = formData.get('action') as string || 'analyze'; // analyze, translate, extract

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Process based on the requested action
    let result;
    
    if (action === 'analyze') {
      // Use Google Vision for general analysis
      const visionResults = await analyzeImage(buffer);
      
      // Convert image to base64 for Phi-4
      const base64Image = buffer.toString('base64');
      const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
      
      // Get additional insights from Phi-4
      const prompt = "Describe what you see in this image with details about objects, scene, and any text visible.";
      const phi4Analysis = await analyzeImageWithPhi4(dataUrl, prompt);
      
      result = {
        googleVision: visionResults,
        phi4Analysis
      };
    } 
    else if (action === 'translate') {
      // Convert image to base64 for Phi-4
      const base64Image = buffer.toString('base64');
      const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
      
      // Extract and translate text with Phi-4
      const translatedText = await extractAndTranslateImageText(dataUrl, targetLanguage);
      
      result = {
        translatedText,
        targetLanguage
      };
    }
    else if (action === 'extract') {
      // Use Google Vision for text extraction only
      const extractedText = await analyzeImage(buffer);
      
      result = {
        extractedText: extractedText.text
      };
    }
    
    return NextResponse.json(result);
  } 
  catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 