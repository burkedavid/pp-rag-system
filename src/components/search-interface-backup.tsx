'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, FileText, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatSourceFile, getConfidenceColor, getConfidenceIcon, truncateText, highlightSearchTerms } from '@/lib/utils';

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
    
    try {
      // Perform RAG query
      const ragPromise = fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      // Perform detailed search for sources tab
      const searchPromise = fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 10 })
      });

      const [ragRes, searchRes] = await Promise.all([ragPromise, searchPromise]);

      if (ragRes.ok) {
        const ragData = await ragRes.json();
        setRagResponse(ragData);
        saveToHistory(searchQuery, ragData.confidence);
      }

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        setSearchResults(searchData.results || []);
      }

      setActiveTab('answer');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
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

  const highlightedAnswer = ragResponse?.answer ? 
    highlightSearchTerms(ragResponse.answer, query) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Public Protection
                <span className="block text-blue-200">Knowledge Base</span>
              </h1>
              <div className="h-1 w-24 bg-blue-300 mx-auto rounded-full shadow-lg"></div>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
              Intelligent AI-powered search through Environmental Health, Trading Standards, 
              Licensing, Housing, and regulatory documentation. Get instant, accurate answers 
              from official Idox system guidance.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/30 backdrop-blur-sm rounded-full border border-blue-400/30">
              <span className="text-blue-100 text-sm font-medium">Powered by Idox System Documentation</span>
            </div>
          </div>
        </div>
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

            {/* Modern Search History */}
            {searchHistory.length > 0 && (
              <div className="mt-8 pt-6 border-t border-blue-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Searches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchHistory.slice(0, 6).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item.query)}
                      className="group text-left p-4 rounded-xl border border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="text-sm text-slate-700 font-medium truncate group-hover:text-blue-800 transition-colors">
                        {truncateText(item.query, 45)}
                      </div>
                      {item.confidence && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", 
                            item.confidence === 'high' ? 'bg-green-100 text-green-700' : 
                            item.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          )}>
                            {getConfidenceIcon(item.confidence)} {item.confidence}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      )}
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
                  <div className={cn(
                    "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-sm",
                    ragResponse.confidence === 'high' ? 'bg-green-50 border-green-200 text-green-800' :
                    ragResponse.confidence === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-red-50 border-red-200 text-red-800'
                  )}>
                    <span className="mr-2 text-lg">{getConfidenceIcon(ragResponse.confidence)}</span>
                    {ragResponse.confidence.toUpperCase()} CONFIDENCE
                  </div>
                  <div className="text-sm text-slate-500">
                    Powered by Claude 4.0 & Titan v2
                  </div>
                </div>

                {/* Enhanced Answer Display */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                  <div 
                    className="prose prose-lg max-w-none text-slate-800 leading-relaxed [&>p]:mb-4 [&>ul]:my-4 [&>ol]:my-4"
                    dangerouslySetInnerHTML={{ __html: highlightedAnswer }}
                  />
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
                              {result.metadata.topic_area.replace('_', ' ').toUpperCase()}
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
            <CardHeader className="pb-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-800">Example Questions</CardTitle>
                <p className="text-slate-600">Get started with these common regulatory queries</p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "How do I process a new food business registration?",
                  "What are the steps for a routine food safety inspection?",
                  "How do I handle a noise complaint?",
                  "What documents are needed for an alcohol license application?",
                  "How do I issue an improvement notice?",
                  "What is the process for investigating food poisoning?"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(example)}
                    className="group text-left p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 shadow-sm hover:shadow-lg"
                  >
                    <div className="text-slate-700 font-medium leading-relaxed group-hover:text-blue-800 transition-colors">
                      {example}
                    </div>
                    <div className="mt-2 flex items-center text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium">Click to search</span>
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
              © 2024 Idox Public Protection Knowledge Base. Powered by Claude 4.0 and Amazon Titan v2.
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