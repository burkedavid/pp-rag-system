'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

import DocumentTypeSelector, { DocumentType } from '@/components/rag/DocumentTypeSelector';
import FileUploader from '@/components/rag/FileUploader';
import IngestionControls from '@/components/rag/IngestionControls';
import ProgressMonitor from '@/components/rag/ProgressMonitor';

interface UploadedFile {
  originalName: string;
  fileName: string;
  size: number;
  type: string;
  path: string;
}

interface RAGStats {
  total: {
    total_chunks: number;
    total_files: number;
    total_tokens: number;
  };
  byType: Array<{
    document_type: string;
    chunk_count: number;
    file_count: number;
    avg_token_count: number;
    last_updated: string;
  }>;
  confidence: Array<{
    confidence: string;
    count: number;
  }>;
}

export default function RAGManagementPage() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [stats, setStats] = useState<RAGStats | null>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>>([]);

  // Fetch RAG stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rag/status');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDocumentTypeSelect = (type: DocumentType) => {
    setSelectedDocumentType(type);
    setUploadedFiles([]); // Clear uploaded files when changing type
  };

  const handleUploadComplete = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    addNotification('success', `Successfully uploaded ${files.length} file(s)`);
  };

  const handleUploadError = (error: string) => {
    addNotification('error', `Upload failed: ${error}`);
  };

  const handleStartIngestion = async (options: any) => {
    if (!selectedDocumentType) {
      addNotification('error', 'Please select a document type');
      return;
    }

    try {
      setIsIngesting(true);
      
      const response = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedDocumentType.id,
          action: options.action,
          files: uploadedFiles,
          options
        })
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentJobId(result.jobId);
        addNotification('info', 'Ingestion started successfully');
      } else {
        throw new Error(result.error || 'Failed to start ingestion');
      }
    } catch (error) {
      setIsIngesting(false);
      addNotification('error', error instanceof Error ? error.message : 'Failed to start ingestion');
    }
  };

  const handleStopIngestion = () => {
    setCurrentJobId(null);
    setIsIngesting(false);
    addNotification('info', 'Ingestion stopped');
  };

  const handleIngestionComplete = () => {
    setIsIngesting(false);
    setCurrentJobId(null);
    setUploadedFiles([]);
    addNotification('success', 'Ingestion completed successfully!');
    fetchStats(); // Refresh stats
  };

  const handleIngestionError = (error: string) => {
    setIsIngesting(false);
    setCurrentJobId(null);
    addNotification('error', `Ingestion failed: ${error}`);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getStatsForType = (typeId: string) => {
    if (!stats) return null;
    return stats.byType.find(t => t.document_type === typeId) || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    RAG Content Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Upload and process documents for the RAG system
                  </p>
                </div>
              </div>
              
              <button
                onClick={fetchStats}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  notification.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : notification.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {notification.type === 'info' && <Activity className="w-5 h-5" />}
                  <span className="text-sm font-medium">{notification.message}</span>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Document Type Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <DocumentTypeSelector
                selectedType={selectedDocumentType?.id || null}
                onTypeSelect={handleDocumentTypeSelect}
                stats={stats?.byType.reduce((acc, item) => {
                  acc[item.document_type] = {
                    chunkCount: item.chunk_count,
                    lastUpdated: item.last_updated
                  };
                  return acc;
                }, {} as Record<string, any>)}
              />
            </div>

            {/* File Upload */}
            {selectedDocumentType && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Upload className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upload Files
                  </h2>
                </div>
                <FileUploader
                  documentType={selectedDocumentType.id}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                />
              </div>
            )}

            {/* Ingestion Controls */}
            {selectedDocumentType && (
              <div className="bg-white rounded-lg shadow p-6">
                <IngestionControls
                  documentType={selectedDocumentType.id}
                  uploadedFiles={uploadedFiles}
                  onStartIngestion={handleStartIngestion}
                  onStopIngestion={handleStopIngestion}
                  isRunning={isIngesting}
                  disabled={isIngesting}
                />
              </div>
            )}
          </div>

          {/* Right Column - Status & Progress */}
          <div className="space-y-6">
            
            {/* Current Stats */}
            {stats && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Content Overview
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(stats.total.total_chunks)}
                      </div>
                      <div className="text-sm text-gray-600">Total Chunks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(stats.total.total_files)}
                      </div>
                      <div className="text-sm text-gray-600">Total Files</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">By Type</h4>
                    <div className="space-y-2">
                      {stats.byType.slice(0, 4).map((type) => (
                        <div key={type.document_type} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">
                            {type.document_type.replace('_', ' ')}
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatNumber(type.chunk_count)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Monitor */}
            {currentJobId && (
              <ProgressMonitor
                jobId={currentJobId}
                onComplete={handleIngestionComplete}
                onError={handleIngestionError}
              />
            )}

            {/* Selected Type Info */}
            {selectedDocumentType && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Type Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <p className="text-sm text-gray-600">{selectedDocumentType.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Script:</span>
                    <p className="text-xs font-mono text-gray-600 bg-gray-100 p-2 rounded">
                      {selectedDocumentType.scriptPath}
                    </p>
                  </div>
                  {getStatsForType(selectedDocumentType.id) && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Current Stats:</span>
                      <div className="text-sm text-gray-600">
                        {formatNumber(getStatsForType(selectedDocumentType.id)!.chunk_count)} chunks, {' '}
                        {formatNumber(getStatsForType(selectedDocumentType.id)!.file_count)} files
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}