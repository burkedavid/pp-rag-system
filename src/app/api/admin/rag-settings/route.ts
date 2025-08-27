import { NextRequest, NextResponse } from 'next/server';
import { getRAGSettings, updateRAGSettings, initializeRAGSettingsTable } from '@/lib/admin-database';

export async function GET() {
  try {
    await initializeRAGSettingsTable();
    const settings = await getRAGSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching RAG settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RAG settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { similarity_threshold, source_count, confidence_threshold_medium, confidence_threshold_high } = body;
    
    if (
      typeof similarity_threshold !== 'number' || similarity_threshold < 0.1 || similarity_threshold > 1.0 ||
      typeof source_count !== 'number' || source_count < 1 || source_count > 20 ||
      typeof confidence_threshold_medium !== 'number' || confidence_threshold_medium < 0.1 || confidence_threshold_medium > 1.0 ||
      typeof confidence_threshold_high !== 'number' || confidence_threshold_high < 0.1 || confidence_threshold_high > 1.0
    ) {
      return NextResponse.json(
        { error: 'Invalid settings values. Similarity and confidence thresholds must be between 0.1-1.0, source count must be 1-20.' },
        { status: 400 }
      );
    }
    
    if (confidence_threshold_high <= confidence_threshold_medium) {
      return NextResponse.json(
        { error: 'High confidence threshold must be greater than medium confidence threshold.' },
        { status: 400 }
      );
    }
    
    await initializeRAGSettingsTable();
    const updatedSettings = await updateRAGSettings({
      similarity_threshold,
      source_count,
      confidence_threshold_medium,
      confidence_threshold_high
    });
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating RAG settings:', error);
    return NextResponse.json(
      { error: 'Failed to update RAG settings' },
      { status: 500 }
    );
  }
}