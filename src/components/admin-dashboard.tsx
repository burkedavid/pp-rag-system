'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, TrendingUp, AlertTriangle, Clock, Search, Users, 
  CheckCircle, AlertCircle, XCircle, Filter, Download, Eye,
  ArrowUp, ArrowDown, Minus, Activity, Database, Bot, Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  analytics: {
    total_questions: number;
    avg_confidence: number;
    confidence_distribution: {
      high: number;
      medium: number;
      low: number;
    };
    avg_response_time: number;
    top_failing_categories: Array<{
      category: string;
      low_confidence_count: number;
      avg_similarity: number;
    }>;
    improvement_opportunities: Array<{
      query_pattern: string;
      frequency: number;
      avg_confidence: number;
      suggested_action: string;
    }>;
  };
  trends: Array<{
    date: string;
    total_questions: number;
    high_confidence: number;
    medium_confidence: number;
    low_confidence: number;
    avg_similarity: number;
    avg_response_time: number;
  }>;
}

interface Question {
  id: number;
  query: string;
  confidence: 'high' | 'medium' | 'low';
  similarity_score: number;
  sources_count: number;
  response_time_ms: number;
  timestamp: string;
  source_quality_score: string;
  how_to_guide_count: number;
  verified_content_count: number;
  faq_content_count: number;
  module_doc_count: number;
  model_used: string;
  ip_address: string;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'questions' | 'improvements'>('overview');
  const [dateRange, setDateRange] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionsPerPage] = useState(50);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  useEffect(() => {
    loadQuestions();
  }, [currentPage, searchTerm, confidenceFilter]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${dateRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const confidenceParam = confidenceFilter !== 'all' ? `&confidence=${confidenceFilter}` : '';
      const pageParam = `&page=${currentPage}&limit=${questionsPerPage}`;
      const response = await fetch(`/api/admin/questions?${pageParam}${searchParam}${confidenceParam}`);
      const data = await response.json();
      setQuestions(data.questions);
      setTotalQuestions(data.total || data.questions.length);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setLoading(true);
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageJump = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'low': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Home Button */}
          <div className="absolute top-4 left-6">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">RAG System Admin Dashboard</h1>
              <p className="text-blue-200">Monitor question quality, confidence levels, and improvement opportunities</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Live Monitoring</span>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4 relative z-10">
        {/* Quick Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white/95">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Questions</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {analytics.analytics.total_questions.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-slate-600">Last {dateRange} days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/95">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Confidence</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {(analytics.analytics.avg_confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-slate-600">Similarity score average</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/95">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Low Confidence</p>
                    <p className="text-3xl font-bold text-red-600">
                      {analytics.analytics.confidence_distribution.low}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-slate-600">Need attention</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/95">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Response</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {Math.round(analytics.analytics.avg_response_time / 1000)}s
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-slate-600">Processing time</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 bg-white/90 p-1 rounded-xl shadow-lg border-0">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'questions', label: 'Questions Log', icon: Database },
            { id: 'improvements', label: 'Improvements', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Confidence Distribution */}
            <Card className="shadow-lg border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analytics.analytics.confidence_distribution.high}
                    </div>
                    <div className="text-sm text-slate-600">High Confidence (≥70%)</div>
                    <div className="mt-2 w-full bg-green-100 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(analytics.analytics.confidence_distribution.high / analytics.analytics.total_questions) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {analytics.analytics.confidence_distribution.medium}
                    </div>
                    <div className="text-sm text-slate-600">Medium Confidence (50-70%)</div>
                    <div className="mt-2 w-full bg-yellow-100 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ 
                          width: `${(analytics.analytics.confidence_distribution.medium / analytics.analytics.total_questions) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {analytics.analytics.confidence_distribution.low}
                    </div>
                    <div className="text-sm text-slate-600">Low Confidence (&lt;50%)</div>
                    <div className="mt-2 w-full bg-red-100 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ 
                          width: `${(analytics.analytics.confidence_distribution.low / analytics.analytics.total_questions) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Failing Categories */}
            <Card className="shadow-lg border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Categories Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.analytics.top_failing_categories.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-800">{category.category}</h4>
                        <p className="text-sm text-slate-600">
                          {category.low_confidence_count} low confidence questions
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          {(category.avg_similarity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">avg similarity</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'questions' && (
          <Card className="shadow-lg border-0 bg-white/95">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Questions Log
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      {totalQuestions.toLocaleString()} total questions
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={confidenceFilter}
                        onChange={(e) => {
                          setConfidenceFilter(e.target.value as 'all' | 'high' | 'medium' | 'low');
                          setCurrentPage(1);
                          setLoading(true);
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Confidence</option>
                        <option value="high">🟢 High Confidence</option>
                        <option value="medium">🟡 Medium Confidence</option>
                        <option value="low">🔴 Low Confidence</option>
                      </select>
                      <Input
                        placeholder="Search all questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button onClick={handleSearch} size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Confidence Level Explanations */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      How AI Confidence is Determined
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <div className="font-medium text-green-800 mb-1">🟢 High Confidence (75%+ similarity)</div>
                        <p className="text-green-700">Strong documentation match found with multiple quality sources. AI found clear, specific answers.</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div className="font-medium text-yellow-800 mb-1">🟡 Medium Confidence (40-75% similarity)</div>
                        <p className="text-yellow-700">Moderate match found. Some relevant content exists but may lack detail or specificity.</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="font-medium text-red-800 mb-1">🔴 Low Confidence (&lt;40% similarity)</div>
                        <p className="text-red-700">Poor or no documentation match. These questions indicate content gaps needing improvement.</p>
                      </div>
                    </div>
                    <p className="text-blue-700 text-xs mt-3">
                      <strong>Confidence Factors:</strong> Semantic similarity score, number of quality sources, content type (how-to guides, verified content), and AI model certainty.
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Pagination Controls - Top */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages} • Showing {Math.min((currentPage - 1) * questionsPerPage + 1, totalQuestions)}-{Math.min(currentPage * questionsPerPage, totalQuestions)} of {totalQuestions.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePreviousPage} 
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const startPage = Math.max(1, currentPage - 2);
                        const pageNum = startPage + i;
                        if (pageNum <= totalPages) {
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageJump(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                        return null;
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-slate-400 px-1">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageJump(totalPages)}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextPage} 
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Compact Questions Table */}
              <div className="space-y-1">
                {questions.map((question) => (
                  <div key={question.id} className="p-3 border border-slate-200 rounded-md hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-150">
                    <div className="flex items-center justify-between gap-4">
                      {/* Question and metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          {getConfidenceIcon(question.confidence)}
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded border",
                            getConfidenceColor(question.confidence)
                          )}>
                            {question.confidence.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {(question.similarity_score * 100).toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-500">
                            {Math.round(question.response_time_ms / 1000)}s
                          </span>
                          <span className="text-xs text-slate-400">#{question.id}</span>
                        </div>
                        <p className="text-slate-800 font-medium mb-1 truncate pr-4">{question.query}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span title="Total Sources: Number of documentation sources found for this query" className="hover:text-slate-700 cursor-help">
                            📄 {question.sources_count}
                          </span>
                          <span title="How-To Guides: Step-by-step procedural guides found (high quality content)" className="hover:text-slate-700 cursor-help">
                            📋 {question.how_to_guide_count}
                          </span>
                          <span title="Verified Content: Officially verified documentation sources" className="hover:text-slate-700 cursor-help">
                            ✅ {question.verified_content_count}
                          </span>
                          <span title="FAQ Content: Frequently Asked Questions documentation found" className="hover:text-slate-700 cursor-help">
                            ❓ {question.faq_content_count}
                          </span>
                          <span title="Module Documentation: Technical module documentation sources" className="hover:text-slate-700 cursor-help">
                            📚 {question.module_doc_count}
                          </span>
                          <span className="text-slate-400">|</span>
                          <span title="AI Model: The AI model used to generate this response" className="hover:text-slate-700 cursor-help">
                            {question.model_used.includes('claude') ? 'Claude 4.0' : 'Fallback'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Timestamp & IP */}
                      <div className="text-right text-xs text-slate-500 whitespace-nowrap">
                        <div>{new Date(question.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(question.timestamp).toLocaleTimeString()}</div>
                        <div title={`User IP Address: ${question.ip_address}`} className="text-slate-400 font-mono cursor-help hover:text-slate-600">
                          {question.ip_address}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls - Bottom */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePreviousPage} 
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-slate-600 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextPage} 
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedTab === 'improvements' && analytics && (
          <Card className="shadow-lg border-0 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Improvement Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.analytics.improvement_opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 mb-2">{opportunity.query_pattern}</h4>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-slate-600">
                            Asked {opportunity.frequency} times
                          </span>
                          <span className="text-sm text-slate-600">
                            Avg confidence: {(opportunity.avg_confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-amber-800 font-medium">
                          {opportunity.suggested_action}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-600">
                          #{index + 1}
                        </div>
                        <div className="text-xs text-slate-500">priority</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}