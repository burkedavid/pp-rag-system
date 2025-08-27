'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

interface RAGSettings {
  id: number;
  similarity_threshold: number;
  source_count: number;
  confidence_threshold_medium: number;
  confidence_threshold_high: number;
  updated_at: string;
}

interface RAGSettingsProps {
  onSettingsChange?: () => void;
}

export default function RAGSettings({ onSettingsChange }: RAGSettingsProps) {
  const [settings, setSettings] = useState<RAGSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    similarity_threshold: 0.45,
    source_count: 5,
    confidence_threshold_medium: 0.5,
    confidence_threshold_high: 0.7
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/rag-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
      setFormData({
        similarity_threshold: data.similarity_threshold,
        source_count: data.source_count,
        confidence_threshold_medium: data.confidence_threshold_medium,
        confidence_threshold_high: data.confidence_threshold_high
      });
    } catch (error) {
      setError('Failed to load RAG settings');
      console.error('Error loading RAG settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/rag-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess('RAG settings updated successfully');
      onSettingsChange?.();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setFormData({
      similarity_threshold: 0.45,
      source_count: 5,
      confidence_threshold_medium: 0.5,
      confidence_threshold_high: 0.7
    });
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (field: keyof typeof formData, value: number) => {
    // Only update if the value is valid (not NaN)
    if (!isNaN(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/95">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-blue-600" />
            RAG System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/95">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-blue-600" />
          RAG System Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Control similarity thresholds and source count for RAG responses
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Similarity Threshold */}
          <div className="space-y-2">
            <Label htmlFor="similarity_threshold">Minimum Similarity Threshold</Label>
            <Input
              id="similarity_threshold"
              type="number"
              min="0.1"
              max="1.0"
              step="0.05"
              value={formData.similarity_threshold}
              onChange={(e) => handleInputChange('similarity_threshold', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Minimum similarity score to provide an answer (0.1 - 1.0). Current: {formData.similarity_threshold}
            </p>
          </div>

          {/* Source Count */}
          <div className="space-y-2">
            <Label htmlFor="source_count">Number of Sources</Label>
            <Input
              id="source_count"
              type="number"
              min="1"
              max="20"
              step="1"
              value={formData.source_count}
              onChange={(e) => handleInputChange('source_count', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Number of source documents to retrieve (1 - 20). Current: {formData.source_count}
            </p>
          </div>

          {/* Medium Confidence Threshold */}
          <div className="space-y-2">
            <Label htmlFor="confidence_threshold_medium">Medium Confidence Threshold</Label>
            <Input
              id="confidence_threshold_medium"
              type="number"
              min="0.1"
              max="1.0"
              step="0.05"
              value={formData.confidence_threshold_medium}
              onChange={(e) => handleInputChange('confidence_threshold_medium', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Minimum similarity for medium confidence (0.1 - 1.0). Current: {formData.confidence_threshold_medium}
            </p>
          </div>

          {/* High Confidence Threshold */}
          <div className="space-y-2">
            <Label htmlFor="confidence_threshold_high">High Confidence Threshold</Label>
            <Input
              id="confidence_threshold_high"
              type="number"
              min="0.1"
              max="1.0"
              step="0.05"
              value={formData.confidence_threshold_high}
              onChange={(e) => handleInputChange('confidence_threshold_high', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Minimum similarity for high confidence (0.1 - 1.0). Current: {formData.confidence_threshold_high}
            </p>
          </div>
        </div>

        {/* Current Settings Info */}
        {settings && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Current Active Settings</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div>Similarity Threshold: <span className="font-mono">{settings.similarity_threshold}</span></div>
              <div>Source Count: <span className="font-mono">{settings.source_count}</span></div>
              <div>Medium Confidence: <span className="font-mono">{settings.confidence_threshold_medium}</span></div>
              <div>High Confidence: <span className="font-mono">{settings.confidence_threshold_high}</span></div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Last updated: {new Date(settings.updated_at).toLocaleString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
          
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}