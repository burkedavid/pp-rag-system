// AI Configuration and Model Management

export interface ModelOptions {
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  stopSequences: string[];
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  options: ModelOptions;
}

// Default model configurations
const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  maxTokens: 2000,
  temperature: 0.3,
  topP: 0.9,
  topK: 250,
  stopSequences: []
};

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'claude-4-sonnet': {
    id: 'us.anthropic.claude-sonnet-4-20250514-v1:0',
    name: 'Claude 4.0 Sonnet',
    description: 'Most advanced model for complex reasoning and analysis',
    options: {
      ...DEFAULT_MODEL_OPTIONS,
      maxTokens: 4000,
      temperature: 0.2,  // Reduced from 0.3 for more consistent responses
      topK: 200  // Reduced from 250 for more focused responses
    }
  },
  'claude-3-5-sonnet': {
    id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    name: 'Claude 3.5 Sonnet',
    description: 'Most capable model for complex reasoning',
    options: {
      ...DEFAULT_MODEL_OPTIONS,
      maxTokens: 4000,
      temperature: 0.3
    }
  },
  'claude-3-haiku': {
    id: 'anthropic.claude-3-haiku-20240307-v1:0', 
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient model',
    options: {
      ...DEFAULT_MODEL_OPTIONS,
      maxTokens: 2000,
      temperature: 0.2
    }
  }
};

// Task-specific model mappings
const TASK_MODEL_MAPPING: Record<string, string> = {
  'rag-search': 'claude-4-sonnet',
  'document-analysis': 'claude-4-sonnet',
  'question-answering': 'claude-4-sonnet',
  'suggestions': 'claude-4-sonnet',
  'related-questions': 'claude-4-sonnet',
  'default': 'claude-4-sonnet'
};

export function getModelId(): string {
  return MODEL_CONFIGS['claude-4-sonnet'].id;
}

export function getModelIdWithOverride(): string {
  return process.env.CLAUDE_MODEL_ID || getModelId();
}

export function getModelOptions(): ModelOptions {
  return MODEL_CONFIGS['claude-4-sonnet'].options;
}

export function getModelConfig(modelKey: string = 'claude-4-sonnet'): ModelConfig {
  return MODEL_CONFIGS[modelKey] || MODEL_CONFIGS['claude-4-sonnet'];
}

export function getModelForTask(task: string): ModelConfig {
  const modelKey = TASK_MODEL_MAPPING[task] || TASK_MODEL_MAPPING.default;
  return getModelConfig(modelKey);
}

export function getModelIdForTask(task: string): string {
  return getModelForTask(task).id;
}

export function getModelOptionsForTask(task: string): ModelOptions {
  return getModelForTask(task).options;
}