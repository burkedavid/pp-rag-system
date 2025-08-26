'use client';

import React from 'react';
import { 
  BookOpen, 
  FileQuestion, 
  CheckCircle, 
  HelpCircle,
  Settings,
  Navigation,
  Info
} from 'lucide-react';

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  chunkCount?: number;
  lastUpdated?: string;
  scriptPath: string;
}

const documentTypes: DocumentType[] = [
  {
    id: 'how-to-guides',
    name: 'How-To Guides',
    description: 'Step-by-step procedural documentation with detailed workflows',
    icon: <BookOpen className="w-6 h-6" />,
    examples: ['How-to-Create-Cases.md', 'How-to-Generate-Reports.md'],
    scriptPath: 'scripts/ingest-how-to-guides.js'
  },
  {
    id: 'module-docs',
    name: 'Module Documentation',
    description: 'Official system documentation covering all features and modules',
    icon: <Settings className="w-6 h-6" />,
    examples: ['Premises_Module_Documentation.md', 'Licensing_Module_Documentation.md'],
    scriptPath: 'scripts/ingest-module-docs.js'
  },
  {
    id: 'verified-content',
    name: 'Verified Content',
    description: '100% source-code verified module functionality and interfaces',
    icon: <CheckCircle className="w-6 h-6" />,
    examples: ['Food-Safety-Module-Verified.md', 'Inspections-Module-Verified.md'],
    scriptPath: 'scripts/ingest-verified-content.js'
  },
  {
    id: 'online-ba-questions',
    name: 'Online BA Questions',
    description: 'Business analyst questions about online request processing',
    icon: <HelpCircle className="w-6 h-6" />,
    examples: ['automatic-matching-settings-faq.md', 'notice-type-days-faq.md'],
    scriptPath: 'scripts/ingest-online-ba-questions.js'
  },
  {
    id: 'faq-documents',
    name: 'FAQ Documents',
    description: 'General frequently asked questions and common scenarios',
    icon: <FileQuestion className="w-6 h-6" />,
    examples: ['licensing-guide-faq.md', 'premises-management-faq.md'],
    scriptPath: 'scripts/ingest-faq-documents.js'
  },
  {
    id: 'navigation-guides',
    name: 'Navigation Guides',
    description: 'UI guidance content and user interface explanations',
    icon: <Navigation className="w-6 h-6" />,
    examples: ['navigation-standards.md', 'ui-workflow-guides.md'],
    scriptPath: 'scripts/navigation-system/process/ingest-navigation.js'
  }
];

interface DocumentTypeSelectorProps {
  selectedType: string | null;
  onTypeSelect: (type: DocumentType) => void;
  stats?: Record<string, { chunkCount: number; lastUpdated: string }>;
}

export default function DocumentTypeSelector({ 
  selectedType, 
  onTypeSelect, 
  stats 
}: DocumentTypeSelectorProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Select Document Type
        </h3>
      </div>
      
      <p className="text-sm text-gray-600">
        Choose the type of content you want to upload and process. Each type uses specialized processing logic.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map((type) => {
          const isSelected = selectedType === type.id;
          const typeStats = stats?.[type.id];
          
          return (
            <div
              key={type.id}
              onClick={() => onTypeSelect(type)}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {type.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {type.name}
                  </h4>
                  {typeStats && (
                    <p className="text-xs text-gray-500">
                      {typeStats.chunkCount} chunks
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {type.description}
              </p>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Examples:</p>
                <div className="space-y-1">
                  {type.examples.slice(0, 2).map((example, index) => (
                    <div 
                      key={index}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded truncate"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {typeStats && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Last updated:</span>
                    <span>{formatDate(typeStats.lastUpdated)}</span>
                  </div>
                </div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedType && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Selected Type</h4>
          </div>
          <p className="text-sm text-blue-700">
            {documentTypes.find(t => t.id === selectedType)?.name} - 
            Files will be processed using {documentTypes.find(t => t.id === selectedType)?.scriptPath}
          </p>
        </div>
      )}
    </div>
  );
}

export { documentTypes };