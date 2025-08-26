'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Settings,
  AlertTriangle,
  Info,
  Zap,
  CheckCircle
} from 'lucide-react';

interface IngestionOptions {
  action: 'full-reingestion' | 'incremental' | 'custom';
  clearExisting: boolean;
  batchSize: number;
  maxTokens: number;
  overlapTokens: number;
}

interface IngestionControlsProps {
  documentType: string | null;
  uploadedFiles: any[];
  onStartIngestion: (options: IngestionOptions) => void;
  onStopIngestion: () => void;
  isRunning: boolean;
  disabled?: boolean;
  recentlyCompleted?: boolean;
}

export default function IngestionControls({
  documentType,
  uploadedFiles,
  onStartIngestion,
  onStopIngestion,
  isRunning,
  disabled = false,
  recentlyCompleted = false
}: IngestionControlsProps) {
  const [options, setOptions] = useState<IngestionOptions>({
    action: 'incremental',
    clearExisting: false,
    batchSize: 5,
    maxTokens: 800,
    overlapTokens: 100
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStartIngestion = () => {
    if (!documentType) return;
    onStartIngestion(options);
  };

  const canStart = documentType && !isRunning && !disabled && 
    (options.action !== 'custom' || uploadedFiles.length > 0);

  return (
    <div className="space-y-6">
      {/* Action Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ingestion Options</h3>
        
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="action"
              value="incremental"
              checked={options.action === 'incremental'}
              onChange={(e) => setOptions(prev => ({ ...prev, action: e.target.value as any }))}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">Directory Scan</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Scans the entire directory and adds any new files found. Doesn't require file upload - checks the folder automatically.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="action"
              value="full-reingestion"
              checked={options.action === 'full-reingestion'}
              onChange={(e) => setOptions(prev => ({ ...prev, action: e.target.value as any }))}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-gray-900">Full Re-ingestion</span>
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                  Slower
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Clear all existing content and reprocess everything. Use when content has changed significantly.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="action"
              value="custom"
              checked={options.action === 'custom'}
              onChange={(e) => setOptions(prev => ({ ...prev, action: e.target.value as any }))}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-gray-900">Upload-Only Processing</span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Advanced
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Process ONLY the specific files you upload via this interface. Requires file upload first.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Warning for Full Re-ingestion */}
      {options.action === 'full-reingestion' && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800">Warning</span>
          </div>
          <p className="text-sm text-orange-700">
            This will remove all existing {documentType?.replace('-', ' ')} content and reprocess everything. 
            This operation cannot be undone and may take several minutes.
          </p>
        </div>
      )}

      {/* Advanced Options */}
      <div className="space-y-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          disabled={disabled}
        >
          <Settings className="w-4 h-4" />
          <span>Advanced Options</span>
          <span className="text-xs">
            {showAdvanced ? '(hide)' : '(show)'}
          </span>
        </button>

        {showAdvanced && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={options.batchSize}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    batchSize: parseInt(e.target.value) || 5 
                  }))}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of files processed simultaneously
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Tokens per Chunk
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="100"
                  value={options.maxTokens}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    maxTokens: parseInt(e.target.value) || 800 
                  }))}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum size of each content chunk
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlap Tokens
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="50"
                  value={options.overlapTokens}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    overlapTokens: parseInt(e.target.value) || 100 
                  }))}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Overlap between adjacent chunks
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="clearExisting"
                checked={options.clearExisting}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  clearExisting: e.target.checked 
                }))}
                disabled={disabled || options.action === 'full-reingestion'}
                className="mt-1"
              />
              <label htmlFor="clearExisting" className="text-sm text-gray-700">
                <span className="font-medium">Clear existing content first</span>
                <p className="text-gray-600">
                  Remove existing chunks before processing new files
                </p>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* File Summary */}
      {uploadedFiles.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Ready to Process</span>
          </div>
          <p className="text-sm text-blue-700">
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded and ready for {documentType?.replace('-', ' ')} ingestion
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          {isRunning ? (
            <button
              onClick={onStopIngestion}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Square className="w-4 h-4" />
              <span>Stop Ingestion</span>
            </button>
          ) : (
            <button
              onClick={handleStartIngestion}
              disabled={!canStart}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                recentlyCompleted 
                  ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {recentlyCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed Successfully</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Ingestion</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className={`text-sm transition-colors duration-300 ${recentlyCompleted ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
          {recentlyCompleted && 'Content successfully embedded and searchable! 🎉'}
          {!recentlyCompleted && !documentType && 'Select a document type to continue'}
          {!recentlyCompleted && documentType && !uploadedFiles.length && options.action === 'custom' && 'Custom processing requires uploaded files - upload files first'}
          {!recentlyCompleted && documentType && uploadedFiles.length > 0 && options.action === 'custom' && `Ready to process ${uploadedFiles.length} uploaded file(s) only`}
          {!recentlyCompleted && documentType && isRunning && 'Ingestion in progress...'}
        </div>
      </div>
    </div>
  );
}