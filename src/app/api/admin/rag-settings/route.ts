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
    
    // Convert and validate numbers, handling NaN cases
    const simThreshold = Number(similarity_threshold);
    const srcCount = Number(source_count);
    const medThreshold = Number(confidence_threshold_medium);
    const highThreshold = Number(confidence_threshold_high);
    
    if (
      isNaN(simThreshold) || simThreshold < 0.1 || simThreshold > 1.0 ||
      isNaN(srcCount) || srcCount < 1 || srcCount > 20 || !Number.isInteger(srcCount) ||
      isNaN(medThreshold) || medThreshold < 0.1 || medThreshold > 1.0 ||
      isNaN(highThreshold) || highThreshold < 0.1 || highThreshold > 1.0
    ) {
      return NextResponse.json(
        { error: 'Invalid settings values. Similarity and confidence thresholds must be between 0.1-1.0, source count must be 1-20.' },
        { status: 400 }
      );
    }
    
    if (highThreshold <= medThreshold) {
      return NextResponse.json(
        { error: 'High confidence threshold must be greater than medium confidence threshold.' },
        { status: 400 }
      );
    }
    
    await initializeRAGSettingsTable();
    const updatedSettings = await updateRAGSettings({
      similarity_threshold: simThreshold,
      source_count: srcCount,
      confidence_threshold_medium: medThreshold,
      confidence_threshold_high: highThreshold
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