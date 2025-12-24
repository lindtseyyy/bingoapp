/**
 * Initialize App with Default Data
 * Run this to pre-populate the app with example patterns
 */

import { getPredefinedPatterns } from '../services/patternService';
import { getAllPatterns, savePattern } from '../services/storageService';

export async function initializeApp(): Promise<void> {
  try {
    // Check if patterns already exist
    const existingPatterns = await getAllPatterns();
    
    if (existingPatterns.length > 0) {
      console.log('App already initialized with patterns');
      return;
    }

    // Load predefined patterns
    const predefinedPatterns = getPredefinedPatterns();
    
    // Save each pattern
    for (const pattern of predefinedPatterns) {
      await savePattern(pattern);
    }

    console.log(`Initialized app with ${predefinedPatterns.length} patterns`);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}
