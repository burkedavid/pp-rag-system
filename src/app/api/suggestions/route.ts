import { NextRequest, NextResponse } from 'next/server';
import { generateSearchSuggestions } from '@/lib/claude';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await generateSearchSuggestions(query);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await generateSearchSuggestions(query);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}