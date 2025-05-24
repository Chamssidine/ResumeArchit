
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
  photoUrl: 'https://i.imgur.com/ZBfWnXU.png', // From HTML
  contactInfo: {
    name: 'Chamssidine Abdallah Ambinintsoa', // From HTML
    title: 'Développeur Fullstack | Mobile | Back-end', // From HTML
    email: 'chamssidineab@gmail.com', // From HTML
    phone: '+261 34 03 394 20', // From HTML
    address: 'Antananarivo, Madagascar', // From HTML
    linkedin: 'https://www.linkedin.com/in/abdallah-ambininstoa-chamssidine-219450219/', // From HTML
    github: 'https://github.com/Chamssidine', // From HTML
    portfolio: '', // Not in HTML, leave empty or add example
  },
  professionalSummary:
    'Développeur Fullstack passionné avec une solide expérience dans le développement mobile, back-end, web et immersif. J’ai également travaillé sur des projets utilisant l’IA et la blockchain, avec une attention particulière à la sécurité et à la performance. Curieux, rigoureux et proactif.', // From HTML
  skills: [ // From HTML
    'Kotlin, Jetpack Compose, Kotlin Multiplatform',
    'C#, Unity, .NET, ASP.NET',
    'Python, Java, PHP, JavaScript, HTML/CSS',
    'React, Node.js',
    'MySQL, Oracle, Firebase',
    'OpenAI API, Blockchain (Solidity)',
    'CI/CD, Git, DevOps, Firebase',
    'Sécurité, Authentification, Performance'
  ],
  experience: [ // From HTML
    {
      id: generateId(),
      company: 'Freelance',
      role: 'Développeur Mobile',
      startDate: '2023', // Simplified date, form expects YYYY-MM
      endDate: 'Présent',
      description: 'Applications Android avec Jetpack Compose, intégration API, stockage cloud',
      location: '', // Not specified directly for this role in HTML
    },
    {
      id: generateId(),
      company: 'i-Oasis VR Training',
      role: 'Développeur Back-End',
      startDate: '2022',
      endDate: '2023',
      description: 'Développement d\'API sécurisées avec ASP.NET, intégration de la blockchain, gestion des utilisateurs, collaboration avec les équipes mobile et VR.',
      location: '',
    },
    {
      id: generateId(),
      company: 'i-Oasis VR Training',
      role: 'Développeur Unity C#',
      startDate: '2021',
      endDate: '2022',
      description: 'Conception de simulations interactives VR, optimisation graphique, intégration IA dans les environnements immersifs.',
      location: '',
    },
     {
      id: generateId(),
      company: 'Projet Personnel',
      role: 'Développeur Fullstack',
      startDate: '2022',
      endDate: '2023',
      description: 'Développement d\'une application de gestion de données RH et financières en React/Node.js avec authentification sécurisée, génération automatique de documents PDF et dashboard analytique.',
      location: '',
    },
  ],
  education: [ // From HTML
    {
      id: generateId(),
      institution: 'E-Media University',
      degree: 'Licence en Informatique',
      fieldOfStudy: '', // Not specified, can be combined with degree
      startDate: '2018',
      endDate: '2021',
      gpa: '',
      description: '',
    },
  ],
  projects: [ // From HTML
    {
      id: generateId(),
      name: 'ImageAuth',
      description: 'Authentification d’images via ASP.NET & Blockchain',
      technologies: 'ASP.NET, Blockchain',
      link: '',
    },
    {
      id: generateId(),
      name: 'JobFinder AI',
      description: 'Application d’optimisation de recherche d’emploi développée en React, Node.js avec IA (OpenAI)',
      technologies: 'React, Node.js, OpenAI',
      link: '',
    },
    {
      id: generateId(),
      name: 'CVBuilder',
      description: 'Application web de création de CV interactive avec React.js (aperçu en temps réel + export PDF)',
      technologies: 'React.js',
      link: '',
    },
     { id: generateId(), name: 'RecruteMoi', description: 'Simulateur d’entretien IA (OpenAI API)', technologies: 'OpenAI API', link: '' },
     { id: generateId(), name: 'OrienteMoi', description: 'Application d’orientation pro interactive', technologies: '', link: '' },
     { id: generateId(), name: 'CrowdManagement VR', description: 'Simulation VR IA', technologies: 'VR, AI', link: '' },
     { id: generateId(), name: 'Facial Recognition System', description: 'Détection et reconnaissance faciale (Python)', technologies: 'Python', link: '' },
     { id: generateId(), name: 'GestPerso', description: 'Gestion du personnel (ASP.NET + SQL)', technologies: 'ASP.NET, SQL', link: '' },
     { id: generateId(), name: 'DataGuard', description: 'Gestion de données sécurisées (Cloud + .NET)', technologies: 'Cloud, .NET', link: '' },
     { id: generateId(), name: 'BudgetGuard', description: 'Suivi budgétaire personnel (Android)', technologies: 'Android', link: '' },
     { id: generateId(), name: 'CertiVote', description: 'Plateforme de vote électronique Blockchain', technologies: 'Blockchain', link: '' },
  ],
  certifications: [], // Not in provided HTML
  languages: [ // From HTML
    { id: generateId(), language: 'Français', proficiency: 'Courant' },
    { id: generateId(), language: 'Anglais', proficiency: 'Professionnel' },
    { id: generateId(), language: 'Allemand', proficiency: 'Intermediate' }, // Mapped B1 to Intermediate
  ],
};

const initialPersonalization: PersonalizationConfig = {
  primaryColor: '#003366', // Dark Blue from HTML sidebar
  accentColor: '#78A7D1',  // Sky Blue (can be adjusted, used for icons/links)
  fontFamily: 'Geist Sans', 
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
    if (!isMounted) return; 
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
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader onExportPdf={handleExportPdf} isExporting={isExportingPdf} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:grid-cols-5">
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
            <ScrollArea className="h-auto max-h-[calc(100vh-200px)] lg:max-h-none pr-4 -mr-4">
                <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
            </ScrollArea>
          </div>

          <div className="lg:col-span-2 xl:col-span-3 sticky top-24 self-start"> 
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
