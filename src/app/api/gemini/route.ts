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

    const res = NextResponse.json(response.candidates);
    res.headers.set(
      'Access-Control-Allow-Origin',
      'https://hit-me-up-blue.vercel.app'
    );
    res.headers.set('Access-Control-Allow-Methods', 'GET');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return res;
  } catch (error) {
    console.error('Error initializing GoogleGenAI:', error);
    const errorRes = NextResponse.json(
      { error: 'Token limit exceeded' },
      { status: 429 }
    );

    errorRes.headers.set('Access-Control-Allow-Origin', 'https://hit-me-up-blue.vercel.app');
    errorRes.headers.set('Access-Control-Allow-Methods', 'GET');
    errorRes.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorRes;
  }
}
