import { NextRequest, NextResponse } from 'next/server';
import { getRecentQuestions, searchQuestions } from '@/lib/admin-database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const confidence = searchParams.get('confidence') as 'high' | 'medium' | 'low' | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    let questions;
    let total = 0;
    
    if (search) {
      // For search, get total count first then paginated results
      questions = await searchQuestions(search, limit, offset, confidence || undefined);
      // Get total count for search results (we'll need to update the function)
      const allSearchResults = await searchQuestions(search, 1000, 0, confidence || undefined); // Get large number to count
      total = allSearchResults.length;
    } else {
      questions = await getRecentQuestions(limit, offset, confidence || undefined);
      // Get total count of all questions with confidence filter
      const { sql } = await import('@/lib/database');
      if (confidence) {
        const [countResult] = await sql`SELECT COUNT(*) as count FROM question_logs WHERE confidence = ${confidence}`;
        total = parseInt(countResult.count);
      } else {
        const [countResult] = await sql`SELECT COUNT(*) as count FROM question_logs`;
        total = parseInt(countResult.count);
      }
    }

    return NextResponse.json({
      questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      search: search || null,
      confidence: confidence || null
    });

  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions data' },
      { status: 500 }
    );
  }
}