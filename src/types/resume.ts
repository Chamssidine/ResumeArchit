
export interface ContactInfo {
  name: string;
  title: string; // Added for job title/tagline
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string; // Location was in HTML, ensure it's used if available
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string; // GPA wasn't in HTML, can be optional
  description: string; // Description can be course details or achievements
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string; // Comma-separated
  link: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuingOrganization: string;
  dateIssued: string;
  credentialId: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native' | 'Courant' | 'Professionnel'; // Added from HTML
}

export interface ResumeData {
  photoUrl: string; // base64 string or image URL
  contactInfo: ContactInfo;
  professionalSummary: string;
  skills: string[]; // Array of skill strings
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[]; // Not in provided HTML, will be hidden if empty
  languages: LanguageEntry[];
}

export interface Template {
  id: string;
  name: string;
  component: React.FC<ResumePreviewProps>; // For future template components
}

export interface PersonalizationConfig {
  primaryColor: string; // hex
  accentColor: string; // hex
  fontFamily: string; // font family name
}

export interface ResumePreviewProps {
  resumeData: ResumeData;
  personalization: PersonalizationConfig;
  templateId: string; // To select internal styling if component handles multiple templates
}

// Helper function to generate unique IDs for array items
export const generateId = () => Math.random().toString(36).substr(2, 9);
