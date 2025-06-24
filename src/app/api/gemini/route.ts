import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET(request: Request) {
  const GEMINI_API = process.env.GEMINI_API;
  const ai = new GoogleGenAI({ apiKey: GEMINI_API });
  const { searchParams } = new URL(request.url);
  const userInput = searchParams.get('message') || '';
  try {
    const response = await ai.models.generateContent({
      model: 'gemma-3n-e4b-it',
      contents: `${userInput}`,
    });

    return NextResponse.json(response.candidates);
  } catch (error) {
    console.error('Error initializing GoogleGenAI:', error);
    return NextResponse.json(
      { error: 'Token limit exceeded' },
      { status: 429 }
    );
  }
}
