// AI Usage Audit and Logging

export interface AIUsageMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  duration: number;
}

export interface AIUsageLog {
  promptType: string;
  promptName: string;
  endpoint: string;
  model: string;
  metrics: AIUsageMetrics;
  success: boolean;
  errorMessage?: string;
  requestData?: any;
  responseData?: any;
  timestamp?: Date;
}

// Simple in-memory logging for demo
const usageLogs: AIUsageLog[] = [];

export async function logAIUsage(log: AIUsageLog): Promise<void> {
  try {
    const logEntry = {
      ...log,
      timestamp: new Date()
    };
    
    usageLogs.push(logEntry);
    
    // Keep only last 1000 entries to prevent memory issues
    if (usageLogs.length > 1000) {
      usageLogs.splice(0, usageLogs.length - 1000);
    }
    
    console.log(`🤖 AI Usage: ${log.promptName} - ${log.success ? 'Success' : 'Failed'} - ${log.metrics.totalTokens} tokens - ${log.metrics.duration}ms`);
    
    // In a real implementation, you would store this in a database
    // await database.aiUsage.create({ data: logEntry });
    
  } catch (error) {
    console.warn('Failed to log AI usage:', error);
  }
}

export function getUsageLogs(): AIUsageLog[] {
  return [...usageLogs];
}

export function getUsageStats(): {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalTokens: number;
  averageDuration: number;
} {
  const totalCalls = usageLogs.length;
  const successfulCalls = usageLogs.filter(log => log.success).length;
  const failedCalls = totalCalls - successfulCalls;
  const totalTokens = usageLogs.reduce((sum, log) => sum + log.metrics.totalTokens, 0);
  const averageDuration = totalCalls > 0 
    ? usageLogs.reduce((sum, log) => sum + log.metrics.duration, 0) / totalCalls 
    : 0;
    
  return {
    totalCalls,
    successfulCalls,
    failedCalls,
    totalTokens,
    averageDuration
  };
}