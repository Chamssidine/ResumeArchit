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
  photoUrl: '',
  contactInfo: { name: '', email: '', phone: '', address: '', linkedin: '', github: '', portfolio: '' },
  professionalSummary: '',
  skills: [],
  experience: [{ id: generateId(), company: '', role: '', startDate: '', endDate: '', description: '', location: '' }],
  education: [{ id: generateId(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' }],
  projects: [],
  certifications: [],
  languages: [],
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
