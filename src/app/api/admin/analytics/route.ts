import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsMetrics, getConfidenceTrends } from '@/lib/admin-database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const days = parseInt(searchParams.get('days') || '30');

    // Get basic analytics
    const analytics = await getAnalyticsMetrics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    // Get confidence trends
    const trends = await getConfidenceTrends(days);

    return NextResponse.json({
      analytics,
      trends,
      period: {
        days,
        startDate: startDate || new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}