'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Zap,
  Loader2
} from 'lucide-react';

interface IngestionJob {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  currentFile?: string;
  startTime: Date;
  endTime?: Date;
  error?: string;
  logs: string[];
}

interface ProgressMonitorProps {
  jobId: string | null;
  onComplete: () => void;
  onError: (error: string) => void;
}

export default function ProgressMonitor({ jobId, onComplete, onError }: ProgressMonitorProps) {
  const [job, setJob] = useState<IngestionJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    
    const pollJob = async () => {
      try {
        const response = await fetch(`/api/rag/ingest?jobId=${jobId}`);
        const jobData = await response.json();
        
        if (response.ok) {
          setJob(jobData);
          
          if (jobData.status === 'completed') {
            setIsPolling(false);
            onComplete();
          } else if (jobData.status === 'failed') {
            setIsPolling(false);
            onError(jobData.error || 'Ingestion failed');
          }
        }
      } catch (error) {
        console.error('Failed to poll job status:', error);
        setIsPolling(false);
        onError('Failed to monitor job progress');
      }
    };

    // Initial poll
    pollJob();
    
    // Set up polling interval
    const interval = setInterval(pollJob, 2000);
    
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [jobId, onComplete, onError]);

  if (!job) {
    return null;
  }

  const getStatusIcon = () => {
    switch (job.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDuration = (start: Date, end?: Date) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    return `${minutes}m ${seconds}s`;
  };

  const formatJobType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">
              {formatJobType(job.type)} Ingestion
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              Status: {job.status}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {job.processedFiles}/{job.totalFiles} files
          </p>
          <p className="text-xs text-gray-500">
            Duration: {formatDuration(job.startTime, job.endTime)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{job.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              job.status === 'completed' 
                ? 'bg-green-500' 
                : job.status === 'failed'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      {/* Current File */}
      {job.currentFile && job.status === 'running' && (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Processing:
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-mono">
            {job.currentFile}
          </p>
        </div>
      )}

      {/* Error Message */}
      {job.status === 'failed' && job.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Error</span>
          </div>
          <p className="text-sm text-red-600">{job.error}</p>
        </div>
      )}

      {/* Success Message */}
      {job.status === 'completed' && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">
              Completed Successfully
            </span>
          </div>
          <p className="text-sm text-green-600">
            Processed {job.totalFiles} files and generated embeddings
          </p>
        </div>
      )}

      {/* Logs */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">
            Recent Activity
          </h4>
        </div>
        
        <div className="bg-white rounded-lg border max-h-32 overflow-y-auto">
          {job.logs.length > 0 ? (
            <div className="p-3 space-y-1">
              {job.logs.slice(-10).map((log, index) => (
                <div key={index} className="text-xs font-mono text-gray-600">
                  {log}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-xs text-gray-500 text-center">
              No logs available
            </div>
          )}
        </div>
      </div>

      {/* Job Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Job ID:</span>
            <div className="font-mono truncate">{job.id}</div>
          </div>
          <div>
            <span className="font-medium">Started:</span>
            <div>{new Date(job.startTime).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}