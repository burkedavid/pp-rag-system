import { NextRequest, NextResponse } from 'next/server';
import { generateRelatedQuestions } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { query, sources, answer } = await request.json();

    if (!query || !sources || !answer) {
      return NextResponse.json(
        { error: 'Query, sources, and answer are required' },
        { status: 400 }
      );
    }

    // Generate related questions using Claude
    const relatedQuestions = await generateRelatedQuestions(query, answer, sources);

    return NextResponse.json({
      relatedQuestions,
      query,
      note: "Related questions generated using Claude 4.0"
    });

  } catch (error) {
    console.error('Related questions generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate related questions' },
      { status: 500 }
    );
  }
}