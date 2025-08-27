'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, FileText, ExternalLink, Clock, Home, Utensils, Dog, Users, Shield, AlertTriangle, Gavel, Building2, Star, Scale, MapPin, ClipboardList, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatSourceFile, getConfidenceColor, getConfidenceIcon, truncateText, highlightSearchTerms } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface SearchResult {
  id: number;
  source_file: string;
  section_title: string;
  chunk_text: string;
  similarity: number;
  metadata: {
    topic_area: string;
    section_type: string;
  };
}

interface RAGResponse {
  answer: string;
  sources: Array<{
    source_file: string;
    section_title: string;
    similarity: number;
  }>;
  confidence: 'high' | 'medium' | 'low';
  sourceQuality?: {
    howToGuideCount: number;
    verifiedContentCount: number;
    faqContentCount: number;
    moduleDocCount: number;
    totalSources: number;
    qualityScore: string;
  };
}

interface SearchHistory {
  query: string;
  timestamp: Date;
  confidence?: 'high' | 'medium' | 'low';
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [ragResponse, setRagResponse] = useState<RAGResponse | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'answer' | 'sources'>('answer');
  const [activeModule, setActiveModule] = useState<string>('food-safety');
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setSearchHistory(parsed);
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveToHistory = useCallback((query: string, confidence?: 'high' | 'medium' | 'low') => {
    const newEntry = { query, timestamp: new Date(), confidence };
    const updated = [newEntry, ...searchHistory.slice(0, 14)]; // Keep last 15 searches
    setSearchHistory(updated);
    localStorage.setItem('search-history', JSON.stringify(updated));
  }, [searchHistory]);

  // Fetch suggestions with debouncing
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    setLoadingStatus('🔍 Searching knowledge base...');
    
    console.log('Searching for:', searchQuery);
    
    try {
      // Start both searches
      setLoadingStatus('📊 Analyzing your question...');
      
      const ragPromise = fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      const searchPromise = fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 10 })
      });

      setLoadingStatus('🤖 Generating AI response...');
      const [ragRes, searchRes] = await Promise.all([ragPromise, searchPromise]);

      setLoadingStatus('✨ Finalizing results...');

      if (ragRes.ok) {
        const ragData = await ragRes.json();
        console.log('RAG Response received:', ragData);
        console.log('RAG Answer content:', ragData.answer);
        console.log('RAG Response type:', typeof ragData.answer);
        console.log('RAG Answer length:', ragData.answer?.length);
        setRagResponse(ragData);
        saveToHistory(searchQuery, ragData.confidence);

        // Generate related questions in the background
        if (ragData.answer && ragData.sources) {
          setLoadingRelated(true);
          fetch('/api/related', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query: searchQuery, 
              sources: ragData.sources, 
              answer: ragData.answer 
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.relatedQuestions) {
              setRelatedQuestions(data.relatedQuestions);
            }
          })
          .catch(error => {
            console.error('Related questions error:', error);
            // Set fallback related questions
            setRelatedQuestions([
              "What are the next steps in this process?",
              "Are there any exceptions to this procedure?",
              "What documentation is required?",
              "How do I handle special cases?"
            ]);
          })
          .finally(() => setLoadingRelated(false));
        }
      } else {
        console.error('RAG request failed:', ragRes.status, await ragRes.text());
      }

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        setSearchResults(searchData.results || []);
      }

      setActiveTab('answer');
    } catch (error) {
      console.error('Search error:', error);
      setLoadingStatus('❌ Search failed. Please try again.');
      setTimeout(() => setLoadingStatus(''), 3000);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
    // Scroll to top to see the new answer
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const handleHomeClick = () => {
    setQuery('');
    setRagResponse(null);
    setSearchResults([]);
    setRelatedQuestions([]);
    setShowSuggestions(false);
    setActiveTab('answer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional AI-Powered Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Dynamic Background Patterns */}
        <div className="absolute inset-0">
          {/* Primary gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-800/80 to-blue-700/90"></div>
          
          {/* Animated mesh gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10"></div>
          
          {/* Tech pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          {/* Glowing orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-radial from-purple-400/15 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
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

          <div className="text-center space-y-6">
            {/* Clean Professional Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Public Protection Knowledge Base
              </h1>
              <div className="h-0.5 w-16 bg-blue-300 mx-auto rounded-full"></div>
            </div>

            {/* Concise Description */}
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              AI-powered search through comprehensive Idox system documentation. 
              Get accurate answers from official guidance across all regulatory modules.
            </p>

            {/* Simple Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/30 backdrop-blur-sm rounded-full border border-blue-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-blue-100 text-sm font-medium">Powered by Claude 4.0 & Amazon Titan</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 space-y-8">

        {/* Modern Search Interface Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-slate-800">Ask Your Question</h2>
                <p className="text-slate-600">Search through comprehensive regulatory documentation with AI-powered intelligence</p>
              </div>
              
              <div className="relative">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Search className="h-6 w-6 text-blue-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Ask about food inspections, licensing procedures, enforcement actions..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                        if (e.key === 'Escape') {
                          setShowSuggestions(false);
                        }
                      }}
                      onFocus={() => setShowSuggestions(query.length >= 3)}
                      className="pl-14 pr-6 py-4 text-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl shadow-sm transition-all duration-200 bg-white"
                    />
                  </div>
                  <Button 
                    onClick={() => handleSearch()} 
                    disabled={isLoading || !query.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Search className="h-5 w-5 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
              </div>

              {/* Professional Loading Animation */}
              {isLoading && loadingStatus && (
                <div className="mt-6 p-6 bg-white border border-blue-200 rounded-2xl shadow-lg">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Animated Search Icon */}
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="h-6 w-6 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Status Text */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-slate-800">AI Analysis in Progress</h3>
                      <p className="text-blue-700 font-medium">{loadingStatus}</p>
                      <p className="text-sm text-slate-500">Typically takes 10-15 seconds for comprehensive results</p>
                    </div>
                    
                    {/* Animated Dots */}
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    
                    {/* Process Steps */}
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span className={loadingStatus.includes('Searching') ? 'text-blue-600 font-medium' : ''}>Search</span>
                        <span className={loadingStatus.includes('Analyzing') ? 'text-blue-600 font-medium' : ''}>Analyze</span>
                        <span className={loadingStatus.includes('Generating') ? 'text-blue-600 font-medium' : ''}>Generate</span>
                        <span className={loadingStatus.includes('Finalizing') ? 'text-blue-600 font-medium' : ''}>Finalize</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className={`h-1 flex-1 rounded ${loadingStatus.includes('Searching') || loadingStatus.includes('Analyzing') || loadingStatus.includes('Generating') || loadingStatus.includes('Finalizing') ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                        <div className={`h-1 flex-1 rounded ${loadingStatus.includes('Analyzing') || loadingStatus.includes('Generating') || loadingStatus.includes('Finalizing') ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                        <div className={`h-1 flex-1 rounded ${loadingStatus.includes('Generating') || loadingStatus.includes('Finalizing') ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                        <div className={`h-1 flex-1 rounded ${loadingStatus.includes('Finalizing') ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-20 mt-3 bg-white border border-blue-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto backdrop-blur-sm">
                <div className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors duration-150 border-b border-blue-100/50 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="text-sm text-slate-700 font-medium">{suggestion}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Optimized Search History */}
            {searchHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-blue-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Searches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {searchHistory.slice(0, 8).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item.query)}
                      className="group text-left p-3 rounded-lg border border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="text-sm text-slate-700 font-medium group-hover:text-blue-800 transition-colors leading-tight">
                        {truncateText(item.query, 50)}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {item.confidence && (
                          <span 
                            className={cn("text-xs px-1.5 py-0.5 rounded font-medium cursor-help transition-all duration-200", 
                              item.confidence === 'high' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                              item.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 
                              'bg-red-100 text-red-700 hover:bg-red-200'
                            )}
                            title={
                              item.confidence === 'high' 
                                ? 'High Confidence: Strong documentation match (>70% similarity)'
                                : item.confidence === 'medium'
                                ? 'Medium Confidence: Moderate match (>50% similarity)'
                                : 'Low Confidence: Limited match (<50% similarity)'
                            }
                          >
                            {getConfidenceIcon(item.confidence)}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {item.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

        {/* Modern Results Section */}
        {(ragResponse || searchResults.length > 0) && (
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-slate-800">Search Results</CardTitle>
                  <p className="text-slate-600">AI-powered answers from official documentation</p>
                </div>
                <div className="flex gap-2 bg-blue-50 p-1 rounded-xl">
                  <Button
                    variant={activeTab === 'answer' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('answer')}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      activeTab === 'answer' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-100'
                    )}
                  >
                    AI Answer
                  </Button>
                  <Button
                    variant={activeTab === 'sources' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('sources')}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      activeTab === 'sources' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-100'
                    )}
                  >
                    Sources ({ragResponse?.sources?.length || 0})
                  </Button>
                </div>
              </div>
            </CardHeader>
          <CardContent className="p-8">
            {activeTab === 'answer' && ragResponse && (
              <div className="space-y-6">
                {/* Modern Confidence Indicator */}
                <div className="flex items-center justify-between">
                  <div 
                    className={cn(
                      "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-sm cursor-help transition-all duration-200 hover:shadow-md",
                      ragResponse.confidence === 'high' ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' :
                      ragResponse.confidence === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' :
                      'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                    )}
                    title={
                      ragResponse.confidence === 'high' 
                        ? 'High Confidence: Strong match found in documentation (>70% similarity). Answer based on highly relevant content.'
                        : ragResponse.confidence === 'medium'
                        ? 'Medium Confidence: Moderate match found (>50% similarity). Answer may require additional verification.'
                        : 'Low Confidence: Limited matching content found (<50% similarity). Please verify information or rephrase your question.'
                    }
                  >
                    <span className="mr-2 text-lg">{getConfidenceIcon(ragResponse.confidence)}</span>
                    {ragResponse.confidence.toUpperCase()} CONFIDENCE
                  </div>
                  <div className="text-sm text-slate-500">
                    Powered by Claude 4.0 & Titan v2
                  </div>
                </div>

                {/* Source Quality Indicator */}
                {ragResponse.sourceQuality && (
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-800">
                      <FileText className="h-3 w-3 mr-1.5" />
                      {ragResponse.sourceQuality.qualityScore}
                    </div>
                    <div className="text-xs text-slate-500">
                      {ragResponse.sourceQuality.howToGuideCount} procedures • {ragResponse.sourceQuality.verifiedContentCount} verified • {ragResponse.sourceQuality.moduleDocCount} module docs • {ragResponse.sourceQuality.totalSources} total
                    </div>
                  </div>
                )}

                {/* Enhanced Answer Display */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                  <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed">
                    <ReactMarkdown>
                      {ragResponse.answer}
                    </ReactMarkdown>
                  </div>
                </div>


                {/* Related Follow-up Questions */}
                {(relatedQuestions.length > 0 || loadingRelated) && (
                  <div className="space-y-4 mt-8 pt-6 border-t border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      <h4 className="text-lg font-semibold text-slate-800">Related Questions</h4>
                      {loadingRelated && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                    </div>
                    
                    {loadingRelated ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3">
                        {relatedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(question)}
                            className="group text-left p-4 rounded-lg border border-amber-200 hover:border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start justify-between">
                              <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-amber-800 transition-colors pr-2">
                                {question}
                              </div>
                              <ArrowRight className="h-4 w-4 text-amber-600 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-slate-500 text-center mt-3">
                      💡 Click any question to explore further
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sources' && ragResponse && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Sources Used in RAG Response</h3>
                  <span className="text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                    {ragResponse.sources.length} sources used
                  </span>
                </div>
                {ragResponse.sources.map((source, index) => (
                  <div key={`${source.source_file}-${index}`} className="group border border-blue-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-800 group-hover:text-blue-800 transition-colors text-lg">
                            {formatSourceFile(source.source_file)}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                              {source.section_title}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                              {Math.round(source.similarity * 100)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-blue-100">
                      <p><strong>Section:</strong> {source.section_title}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        This source was used in generating the response above with {Math.round(source.similarity * 100)}% relevance match.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

        {/* Enhanced Module-Based Example Questions */}
        {!ragResponse && !isLoading && (
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="space-y-3">
                <CardTitle className="text-2xl font-bold text-slate-800">Explore by Module</CardTitle>
                <p className="text-slate-600">Example questions to get you started with Idox Public Protection system functionality</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Module Tabs */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 bg-slate-50 p-2 rounded-xl">
                  {[
                    { id: 'food-safety', label: 'Food Safety', icon: Utensils, color: 'text-green-600', count: 10 },
                    { id: 'licensing', label: 'Licensing', icon: Gavel, color: 'text-cyan-600', count: 10 },
                    { id: 'service-requests', label: 'Service Requests', icon: ClipboardList, color: 'text-indigo-600', count: 10 },
                    { id: 'inspections', label: 'Inspections', icon: AlertTriangle, color: 'text-orange-600', count: 10 },
                    { id: 'premises', label: 'Premises', icon: Building2, color: 'text-teal-600', count: 10 },
                    { id: 'enforcement', label: 'Enforcement', icon: Shield, color: 'text-red-600', count: 10 },
                    { id: 'prosecutions', label: 'Prosecutions', icon: Scale, color: 'text-slate-600', count: 10 },
                    { id: 'system-search', label: 'System & Search', icon: Search, color: 'text-blue-600', count: 10 },
                    { id: 'contacts', label: 'Contacts', icon: Users, color: 'text-purple-600', count: 10 },
                    { id: 'dogs-animals', label: 'Dogs & Animals', icon: Dog, color: 'text-amber-600', count: 10 }
                  ].map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
                        activeModule === module.id
                          ? 'bg-white shadow-md text-slate-800 border-2 border-blue-200'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-white/70'
                      )}
                    >
                      <module.icon className={cn("h-4 w-4", module.color)} />
                      <span>{module.label}</span>
                      <span className="bg-slate-200 text-xs px-1.5 py-0.5 rounded-full">{module.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Content */}
              <div className="space-y-4">
                {/* Food Safety & Premises */}
                {activeModule === 'food-safety' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Utensils className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Food Safety & Premises</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create Food Poisoning investigation records in the system?",
                        "How do I navigate to Food Poisoning creation form in the system?",
                        "How do I create a premises record for food businesses?",
                        "How do I select case types when creating Food Poisoning investigations?",
                        "How do I record onset dates and symptoms in food poisoning cases?",
                        "How do I link premises to food poisoning investigation records?",
                        "How do I complete initial case information for food poisoning investigations?",
                        "How do I record patient symptoms in food poisoning cases?",
                        "How do I create service request records in the system?",
                        "How do I navigate to premises creation forms?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-green-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-green-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dogs & Animals */}
                {activeModule === 'dogs-animals' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Dog className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Dogs & Animals</h3>
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create a new dog case record?",
                        "How do I search for existing dog records?",
                        "How do I view dog case details?",
                        "How do I create dangerous dog reports?",
                        "How do I record dog bite incident details?",
                        "How do I complete case identification for dog cases?",
                        "How do I select dog case types when creating records?",
                        "How do I navigate to dog case creation forms?",
                        "How do I record incident dates for dog cases?",
                        "How do I link contacts to dog case records?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-amber-200 hover:border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-amber-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-amber-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Requests */}
                {activeModule === 'service-requests' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Service Requests</h3>
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create service request records in the system?",
                        "How do I navigate to service request creation forms?",
                        "How do I select service request categories when creating records?",
                        "How do I record complaint details in service requests?",
                        "How do I assign service requests to officers?",
                        "How do I complete basic information for service requests?",
                        "How do I link premises to service request records?",
                        "How do I record report dates in service requests?",
                        "How do I create food hygiene service request records?",
                        "How do I track service request status and progress?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-indigo-200 hover:border-indigo-400 bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-indigo-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* System & Search */}
                {activeModule === 'system-search' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-800">System & Search Functions</h3>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I search across all system modules?",
                        "How do I save search criteria for reuse?",
                        "How do I create advanced search filters?",
                        "How do I export search results?",
                        "How do I use recently viewed records?",
                        "How do I bookmark frequently accessed records?",
                        "How do I navigate between different system modules?",
                        "How do I access search history features?",
                        "How do I set up custom search parameters?",
                        "How do I use the global search functionality?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-blue-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enforcement & Compliance */}
                {activeModule === 'enforcement' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Enforcement & Compliance</h3>
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create enforcement action records?",
                        "How do I navigate to enforcement creation forms?",
                        "How do I select enforcement action types?",
                        "How do I record enforcement dates and details?",
                        "How do I link enforcement actions to inspection records?",
                        "How do I create improvement notice records?",
                        "How do I generate formal enforcement notices?",
                        "How do I complete enforcement action forms?",
                        "How do I track enforcement compliance status?",
                        "How do I record enforcement follow-up actions?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-red-200 hover:border-red-400 bg-gradient-to-br from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-red-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-red-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspections & Sampling */}
                {activeModule === 'inspections' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Inspections & Sampling</h3>
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create a new inspection record?",
                        "How do I navigate to Create Planned Inspection in the system?",
                        "How do I select inspection categories when creating inspection records?",
                        "How do I complete inspection scheduling details?",
                        "How do I link source cases to inspection records?",
                        "How do I record inspection findings and observations?",
                        "How do I complete basic inspection details?",
                        "How do I create planned premises inspection records?",
                        "How do I assign inspectors to inspection records?",
                        "How do I record planned dates for inspection activities?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-orange-200 hover:border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-orange-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-orange-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Premises Management */}
                {activeModule === 'premises' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5 text-teal-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Premises Management</h3>
                      <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create a new premises record?",
                        "How do I search for existing premises records?",
                        "How do I link contacts to premises records?",
                        "How do I navigate to premises creation forms?",
                        "How do I complete basic premises information?",
                        "How do I select premises registration types?",
                        "How do I record premises address details?",
                        "How do I create food business premises records?",
                        "How do I link business information to premises?",
                        "How do I update premises contact information?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-teal-200 hover:border-teal-400 bg-gradient-to-br from-teal-50 to-teal-100/50 hover:from-teal-100 hover:to-teal-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-teal-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-teal-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prosecutions */}
                {activeModule === 'prosecutions' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Scale className="h-5 w-5 text-slate-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Prosecutions & Legal</h3>
                      <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create prosecution case records?",
                        "How do I navigate to prosecution creation forms?",
                        "How do I complete prosecution case information?",
                        "How do I record prosecution proceedings details?",
                        "How do I track prosecution case status?",
                        "How do I link prosecution cases to source records?",
                        "How do I record court hearing dates?",
                        "How do I complete prosecution outcome information?",
                        "How do I create legal action records?",
                        "How do I manage prosecution evidence records?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-gradient-to-br from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-slate-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-slate-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Licensing */}
                {activeModule === 'licensing' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Gavel className="h-5 w-5 text-cyan-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Licensing & Permits</h3>
                      <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create a new licensing application?",
                        "How do I navigate to licensing application forms?",
                        "How do I select license types when creating applications?",
                        "How do I complete basic application information?",
                        "How do I link applicant contacts to licensing records?",
                        "How do I record application submission dates?",
                        "How do I create alcohol premises license applications?",
                        "How do I link premises to licensing applications?",
                        "How do I process license application forms?",
                        "How do I track licensing application status?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-cyan-200 hover:border-cyan-400 bg-gradient-to-br from-cyan-50 to-cyan-100/50 hover:from-cyan-100 hover:to-cyan-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-cyan-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-cyan-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contacts & Communications */}
                {activeModule === 'contacts' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-slate-800">Contacts & Communications</h3>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Example Questions</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "How do I create new contact records?",
                        "How do I search for existing contacts?",
                        "How do I navigate to contact creation forms?",
                        "How do I complete contact information details?",
                        "How do I link contacts to case records?",
                        "How do I update contact information?",
                        "How do I record contact communication preferences?",
                        "How do I create business contact records?",
                        "How do I merge duplicate contact records?",
                        "How do I add contact addresses and details?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="group text-left p-3 rounded-lg border border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-150 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="text-sm text-slate-700 font-medium leading-tight group-hover:text-purple-800 transition-colors mb-2">
                            {question}
                          </div>
                          <div className="flex items-center justify-end">
                            <ExternalLink className="h-3 w-3 text-purple-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        )}

        {/* Professional Footer */}
        <div className="text-center py-8 text-slate-500">
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-sm">
              © 2025 Idox Public Protection Knowledge Base. Powered by Claude 4.0 and Amazon Titan v2.
            </p>
            <p className="text-xs">
              All responses are generated from official documentation. Please verify critical information with current regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}