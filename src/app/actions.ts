'use server';

import { optimizeResumeContent, type OptimizeResumeContentInput } from '@/ai/flows/optimize-resume-content';

interface EnhanceSectionInput {
  sectionText: string;
  sectionType: string; // e.g., "Professional Summary", "Experience Description"
}

export async function enhanceSectionWithAI(input: EnhanceSectionInput): Promise<string> {
  try {
    const genkitInput: OptimizeResumeContentInput = {
      resumeSection: input.sectionText,
      sectionType: input.sectionType,
    };
    const result = await optimizeResumeContent(genkitInput);
    return result.optimizedContent;
  } catch (error) {
    console.error('Error enhancing section with AI:', error);
    throw new Error('Failed to enhance content. Please try again.');
  }
}
