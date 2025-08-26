'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Database, Search, Trash2, Eye, FileText, Clock, 
  Filter, RefreshCw, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentChunk {
  id?: number;
  source_file: string;
  section_title?: string;
  chunk_text: string;
  chunk_index: number;
  token_count: number;
  embedding: number[];
  metadata: {
    document_type?: string;
    topic_area?: string;
    section_type?: string;
    has_procedures?: boolean;
    subsection_count?: number;
    complexity_level?: string;
  };
  created_at?: string;
}

interface EmbeddingsStats {
  total_chunks: number;
  total_files: number;
  total_tokens: number;
  document_types: Array<{
    document_type: string;
    chunk_count: number;
    file_count: number;
  }>;
}

export default function EmbeddingsManager() {
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [stats, setStats] = useState<EmbeddingsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFile, setSelectedFile] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [expandedChunk, setExpandedChunk] = useState<number | null>(null);

  useEffect(() => {
    loadEmbeddings();
  }, []);

  const loadEmbeddings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/embeddings');
      if (response.ok) {
        const data = await response.json();
        setChunks(data.chunks || []);
        setStats(data.stats || null);
      } else {
        console.error('Failed to load embeddings');
      }
    } catch (error) {
      console.error('Error loading embeddings:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChunk = async (chunkId: number, sourceFile: string) => {
    try {
      setDeleting(prev => new Set([...prev, `${chunkId}`]));
      
      const response = await fetch('/api/admin/embeddings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunkId })
      });

      if (response.ok) {
        setChunks(prev => prev.filter(chunk => chunk.id !== chunkId));
        await loadEmbeddings(); // Refresh stats
      } else {
        console.error('Failed to delete chunk');
      }
    } catch (error) {
      console.error('Error deleting chunk:', error);
    } finally {
      setDeleting(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${chunkId}`);
        return newSet;
      });
    }
  };

  const deleteAllChunksForFile = async (sourceFile: string) => {
    if (!confirm(`Are you sure you want to delete ALL chunks for "${sourceFile}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(prev => new Set([...prev, sourceFile]));
      
      const response = await fetch('/api/admin/embeddings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceFile })
      });

      if (response.ok) {
        setChunks(prev => prev.filter(chunk => chunk.source_file !== sourceFile));
        await loadEmbeddings(); // Refresh stats
      } else {
        console.error('Failed to delete file chunks');
      }
    } catch (error) {
      console.error('Error deleting file chunks:', error);
    } finally {
      setDeleting(prev => {
        const newSet = new Set(prev);
        newSet.delete(sourceFile);
        return newSet;
      });
    }
  };

  const filteredChunks = chunks.filter(chunk => {
    const matchesSearch = !searchTerm || 
      chunk.source_file.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.chunk_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.section_title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || 
      chunk.metadata?.document_type === selectedType;

    const matchesFile = selectedFile === 'all' || 
      chunk.source_file === selectedFile;

    const matchesDate = dateFilter === 'all' || (() => {
      if (!chunk.created_at) return false;
      const chunkDate = new Date(chunk.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return chunkDate.toDateString() === now.toDateString();
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          return chunkDate.toDateString() === yesterday.toDateString();
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return chunkDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return chunkDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return chunkDate >= yearAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesFile && matchesDate;
  });

  const uniqueTypes = Array.from(new Set(chunks.map(c => c.metadata?.document_type).filter(Boolean)));
  const uniqueFiles = Array.from(new Set(chunks.map(c => c.source_file)));

  const truncateText = (text: string, maxLength: number = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Chunks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_chunks.toLocaleString()}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Files</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_files}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_tokens.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Doc Types</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.document_types.length}</p>
                </div>
                <Filter className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Document Chunks Management
            </div>
            <Button onClick={loadEmbeddings} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search chunks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Document Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Files</option>
              {uniqueFiles.map(file => (
                <option key={file} value={file}>{file}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last month</option>
              <option value="year">Last year</option>
            </select>
          </div>

          <p className="text-sm text-gray-600">
            Showing {filteredChunks.length} of {chunks.length} chunks
          </p>
        </CardContent>
      </Card>

      {/* Chunks List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading embeddings...</p>
            </CardContent>
          </Card>
        ) : filteredChunks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No chunks found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredChunks.map((chunk, index) => (
            <Card key={chunk.id || index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{chunk.source_file}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Chunk {chunk.chunk_index + 1}
                      </span>
                      {chunk.metadata?.document_type && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {chunk.metadata.document_type}
                        </span>
                      )}
                    </div>
                    
                    {chunk.section_title && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Section:</strong> {chunk.section_title}
                      </p>
                    )}

                    <div className="text-sm text-gray-600 mb-2 flex gap-4">
                      <span><strong>Tokens:</strong> {chunk.token_count}</span>
                      {chunk.metadata?.topic_area && (
                        <span><strong>Topic:</strong> {chunk.metadata.topic_area}</span>
                      )}
                      {chunk.created_at && (
                        <span><strong>Created:</strong> {formatDate(chunk.created_at)}</span>
                      )}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700">
                        {expandedChunk === chunk.id ? chunk.chunk_text : truncateText(chunk.chunk_text)}
                      </p>
                      {chunk.chunk_text.length > 200 && (
                        <button
                          onClick={() => setExpandedChunk(expandedChunk === chunk.id ? null : chunk.id || -1)}
                          className="text-blue-600 hover:text-blue-800 text-xs mt-2 font-medium"
                        >
                          {expandedChunk === chunk.id ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => deleteAllChunksForFile(chunk.source_file)}
                      disabled={deleting.has(chunk.source_file)}
                      variant="outline"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete File
                    </Button>
                    
                    {chunk.id && (
                      <Button
                        onClick={() => deleteChunk(chunk.id!, chunk.source_file)}
                        disabled={deleting.has(`${chunk.id}`)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Chunk
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}