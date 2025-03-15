import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/huggingface';
import { langFromCode, langToCode } from '@/lib/languages';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const translatedText = await translateText(text, {
      sourceLanguage,
      targetLanguage,
    });

    return NextResponse.json({
      translatedText,
      sourceLanguage,
      targetLanguage
    });
  } catch (error) {
    console.error('Error in translation API:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
} 