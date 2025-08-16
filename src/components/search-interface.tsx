'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, FileText, ExternalLink, Clock, Home } from 'lucide-react';
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
    const updated = [newEntry, ...searchHistory.slice(0, 9)]; // Keep last 10 searches
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
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const handleHomeClick = () => {
    setQuery('');
    setRagResponse(null);
    setSearchResults([]);
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
                    Sources ({searchResults.length})
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

                {/* Enhanced Answer Display */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                  <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed">
                    {console.log('Rendering answer:', ragResponse.answer)}
                    <ReactMarkdown>
                      {ragResponse.answer}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Modern Sources Summary */}
                {ragResponse.sources.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Referenced Sources
                    </h4>
                    <div className="grid gap-3">
                      {ragResponse.sources.map((source, index) => (
                        <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl hover:shadow-md transition-all duration-200">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-800 group-hover:text-blue-800 transition-colors">
                              {formatSourceFile(source.source_file)}
                            </div>
                            {source.section_title && (
                              <div className="text-sm text-slate-600">
                                Section: {source.section_title}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                              {Math.round(source.similarity * 100)}% match
                            </span>
                            <ExternalLink className="h-4 w-4 text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Detailed Source Results</h3>
                  <span className="text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                    {searchResults.length} documents found
                  </span>
                </div>
                {searchResults.map((result, index) => (
                  <div key={result.id} className="group border border-blue-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-800 group-hover:text-blue-800 transition-colors text-lg">
                            {formatSourceFile(result.source_file)}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                              {result.metadata?.topic_area?.replace('_', ' ').toUpperCase() || 'GENERAL'}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                              {Math.round(result.similarity * 100)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {result.section_title && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Section: {result.section_title}
                        </p>
                      </div>
                    )}
                    
                    <div 
                      className="prose prose-sm max-w-none text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-blue-100"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightSearchTerms(truncateText(result.chunk_text, 400), query) 
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

        {/* Modern Example Questions */}
        {!ragResponse && !isLoading && (
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-800">Try These Software Questions</CardTitle>
                <p className="text-slate-600">Get started with these Idox system interface questions</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  "How do I save search criteria?",
                  "How do I create a new dog case record?",
                  "How do I submit ideas to the Idox Ideas Portal?",
                  "How do I search for contacts?",
                  "How do I view dog records in the system?",
                  "How do I investigate food poisoning incidents?",
                  "How do I record food poisoning cases?",
                  "How do I process online food business registrations?",
                  "How do I search for dog records?"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(example)}
                    className="group text-left p-4 rounded-xl border border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-blue-800 transition-colors">
                      {example}
                    </div>
                    <div className="mt-2 flex items-center text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium">Try this</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </button>
                ))}
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