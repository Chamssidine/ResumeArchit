
'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { TemplateSelector } from '@/components/template-selector';
import { PersonalizationOptions } from '@/components/personalization-options';
import { PdfExporter } from '@/components/pdf-exporter';
import type { ResumeData, PersonalizationConfig } from '@/types/resume';
import { generateId } from '@/types/resume';
import { ScrollArea } from '@/components/ui/scroll-area';
import { exportToPdf } from '@/lib/pdf-utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const initialResumeData: ResumeData = {
  photoUrl: 'https://placehold.co/300x300.png',
  contactInfo: {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-123-4567',
    address: '123 Main Street, Anytown, USA',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    portfolio: 'alexjohnson.dev',
  },
  professionalSummary:
    'Highly motivated and results-oriented software engineer with 5+ years of experience in developing and implementing innovative software solutions. Proficient in JavaScript, React, and Node.js, with a strong background in agile methodologies and a passion for creating user-centric applications. Proven ability to lead projects and collaborate effectively in team environments.',
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'SQL', 'NoSQL', 'Docker', 'AWS'],
  experience: [
    {
      id: generateId(),
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      startDate: '2021-06',
      endDate: 'Present',
      description:
        '- Led a team of 5 engineers in the development of a new SaaS platform, resulting in a 20% increase in user engagement.\n- Designed and implemented RESTful APIs for various microservices.\n- Optimized application performance, reducing load times by 30%.',
      location: 'San Francisco, CA',
    },
    {
      id: generateId(),
      company: 'Innovatech Ltd.',
      role: 'Software Engineer',
      startDate: '2018-07',
      endDate: '2021-05',
      description:
        '- Developed and maintained front-end components using React and Redux.\n- Collaborated with UX/UI designers to create responsive and accessible user interfaces.\n- Participated in code reviews and contributed to improving code quality.',
      location: 'Austin, TX',
    },
  ],
  education: [
    {
      id: generateId(),
      institution: 'State University',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-08',
      endDate: '2018-05',
      gpa: '3.9/4.0',
      description: 'Thesis on Machine Learning applications in e-commerce. Graduated with Honors.',
    },
    {
      id: generateId(),
      institution: 'City College',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Software Engineering',
      startDate: '2012-08',
      endDate: '2016-05',
      gpa: '3.7/4.0',
      description: 'Dean\'s List for 4 semesters. Capstone project involved developing a mobile app for local community services.',
    },
  ],
  projects: [
    {
      id: generateId(),
      name: 'E-commerce Platform',
      description: 'A full-stack e-commerce website with features like product listing, shopping cart, user authentication, and order processing. Built with Next.js, Stripe, and Prisma.',
      technologies: 'Next.js, TypeScript, Stripe, Prisma, Tailwind CSS',
      link: 'github.com/alexjohnson/ecommerce-project',
    },
    {
      id: generateId(),
      name: 'Task Management App',
      description: 'A Kanban-style task management application allowing users to create, organize, and track tasks. Implemented drag-and-drop functionality and real-time updates.',
      technologies: 'React, Firebase, Zustand, Framer Motion',
      link: 'github.com/alexjohnson/task-manager',
    },
  ],
  certifications: [
    {
      id: generateId(),
      name: 'AWS Certified Solutions Architect - Associate',
      issuingOrganization: 'Amazon Web Services',
      dateIssued: '2022-03',
      credentialId: 'AWS-SA-12345',
    },
    {
      id: generateId(),
      name: 'Certified ScrumMaster (CSM)',
      issuingOrganization: 'Scrum Alliance',
      dateIssued: '2020-11',
      credentialId: 'CSM-67890',
    },
  ],
  languages: [
    { id: generateId(), language: 'English', proficiency: 'Native' },
    { id: generateId(), language: 'Spanish', proficiency: 'Advanced' },
    { id: generateId(), language: 'German', proficiency: 'Intermediate' },
  ],
};

const initialPersonalization: PersonalizationConfig = {
  primaryColor: '#A778D1', // Strong Violet
  accentColor: '#78A7D1',  // Sky Blue
  fontFamily: 'Geist Sans', // Default from layout
};

export default function ResumeArchitectPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic');
  const [personalization, setPersonalization] = useState<PersonalizationConfig>(initialPersonalization);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleExportPdf = async () => {
    if (!isMounted) return; // Ensure client-side only execution
    setIsExportingPdf(true);
    try {
      await exportToPdf('resume-preview-content', `${resumeData.contactInfo.name.replace(/\s+/g, '_') || 'resume'}_${selectedTemplateId}.pdf`);
      toast({ title: 'PDF Exported!', description: 'Your resume has been successfully downloaded.' });
    } catch (error) {
      toast({ variant: "destructive", title: 'PDF Export Failed', description: (error as Error).message });
      console.error(error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (!isMounted) {
    return null; // Or a loading skeleton for the entire page
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader onExportPdf={handleExportPdf} isExporting={isExportingPdf} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:grid-cols-5">
          {/* Left Column: Controls & Form */}
          <div className="lg:col-span-1 xl:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Settings</h2>
                 <div className="space-y-6">
                    <TemplateSelector
                      selectedTemplateId={selectedTemplateId}
                      onTemplateChange={setSelectedTemplateId}
                    />
                    <PersonalizationOptions
                      config={personalization}
                      onConfigChange={setPersonalization}
                    />
                    <PdfExporter onExport={handleExportPdf} isExporting={isExportingPdf} />
                 </div>
              </CardContent>
            </Card>
           
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4 text-primary">Edit Content</h2>
            <ScrollArea className="h-auto max-h-[calc(100vh-200px)] lg:max-h-none pr-4 -mr-4"> {/* Adjust max-h as needed */}
                <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
            </ScrollArea>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-2 xl:col-span-3 sticky top-24 self-start"> {/* Make preview sticky */}
            <ScrollArea className="h-auto max-h-[calc(100vh-120px)] rounded-lg border shadow-xl">
              <ResumePreview
                resumeData={resumeData}
                personalization={personalization}
                templateId={selectedTemplateId}
              />
            </ScrollArea>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Resume Architect. All rights reserved.
      </footer>
    </div>
  );
}
