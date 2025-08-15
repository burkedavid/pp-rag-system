import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSourceFile(filename: string): string {
  return filename
    .replace(/^\d+-/, '') // Remove number prefix
    .replace(/\.md$/, '') // Remove .md extension
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
}

export function getConfidenceColor(confidence: 'high' | 'medium' | 'low'): string {
  switch (confidence) {
    case 'high':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getConfidenceIcon(confidence: 'high' | 'medium' | 'low'): string {
  switch (confidence) {
    case 'high':
      return '✓';
    case 'medium':
      return '⚠';
    case 'low':
      return '⚠';
    default:
      return '?';
  }
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery || searchQuery.length < 3) return text;
  
  // Clean and prepare the search query
  const cleanQuery = searchQuery.trim().toLowerCase();
  let highlightedText = text;
  
  // First, try to highlight exact phrases (2+ words)
  const words = cleanQuery.split(/\s+/).filter(word => word.length > 2);
  if (words.length >= 2) {
    // Try to find multi-word phrases first
    const phraseRegex = new RegExp(`(${words.join('\\s+')})`, 'gi');
    if (phraseRegex.test(text)) {
      highlightedText = highlightedText.replace(phraseRegex, 
        '<span style="background-color: #dbeafe; color: #1e40af; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-weight: 500; border: 1px solid #bfdbfe;">$1</span>');
      return highlightedText;
    }
  }
  
  // If no phrase match, highlight only the most significant terms (5+ chars or key regulatory terms)
  const significantTerms = words.filter(term => 
    term.length >= 5 || 
    ['food', 'inspection', 'license', 'permit', 'safety', 'health', 'premises', 'business'].includes(term)
  );
  
  // Limit to max 3 highlights to avoid clutter
  significantTerms.slice(0, 3).forEach(term => {
    const regex = new RegExp(`\\b(${term})\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, 
      '<span style="background-color: #eff6ff; color: #1e40af; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-weight: 500;">$1</span>');
  });
  
  return highlightedText;
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}