'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoUploader } from '@/components/photo-uploader';
import { ResumeFormSection } from '@/components/resume-form-section';
import type {
  ResumeData,
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
} from '@/types/resume';
import { generateId } from '@/types/resume';
import { enhanceSectionWithAI } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Wand2 } from 'lucide-react';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: Dispatch<SetStateAction<ResumeData>>;
}

export function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const { toast } = useToast();
  const [aiLoadingStates, setAiLoadingStates] = useState<Record<string, boolean>>({});

  const handleAiEnhance = async (
    fieldKey: keyof ResumeData | `experience.${number}.description` | `education.${number}.description` | `projects.${number}.description`,
    sectionType: string,
    currentText: string
  ) => {
    setAiLoadingStates(prev => ({ ...prev, [fieldKey as string]: true }));
    try {
      const optimizedText = await enhanceSectionWithAI({ sectionText: currentText, sectionType });
      
      if (fieldKey === 'professionalSummary') {
        setResumeData(prev => ({ ...prev, professionalSummary: optimizedText }));
      } else if (typeof fieldKey === 'string' && fieldKey.startsWith('experience.')) {
        const index = parseInt(fieldKey.split('.')[1]);
        setResumeData(prev => ({
          ...prev,
          experience: prev.experience.map((exp, i) => i === index ? { ...exp, description: optimizedText } : exp)
        }));
      } else if (typeof fieldKey === 'string' && fieldKey.startsWith('education.')) {
         const index = parseInt(fieldKey.split('.')[1]);
        setResumeData(prev => ({
          ...prev,
          education: prev.education.map((edu, i) => i === index ? { ...edu, description: optimizedText } : edu)
        }));
      } else if (typeof fieldKey === 'string' && fieldKey.startsWith('projects.')) {
        const index = parseInt(fieldKey.split('.')[1]);
        setResumeData(prev => ({
          ...prev,
          projects: prev.projects.map((proj, i) => i === index ? { ...proj, description: optimizedText } : proj)
        }));
      }
      toast({ title: "Content Enhanced!", description: `${sectionType} has been optimized by AI.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Enhancement Failed", description: (error as Error).message });
    } finally {
      setAiLoadingStates(prev => ({ ...prev, [fieldKey as string]: false }));
    }
  };


  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value } as ContactInfo,
    }));
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Assuming skills are comma-separated
    setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill) }));
  };
  
  const createDefaultExperience = (): ExperienceEntry => ({ id: generateId(), company: '', role: '', startDate: '', endDate: '', description: '', location: '' });
  const createDefaultEducation = (): EducationEntry => ({ id: generateId(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' });
  const createDefaultProject = (): ProjectEntry => ({ id: generateId(), name: '', description: '', technologies: '', link: '' });
  const createDefaultCertification = (): CertificationEntry => ({ id: generateId(), name: '', issuingOrganization: '', dateIssued: '', credentialId: '' });
  const createDefaultLanguage = (): LanguageEntry => ({ id: generateId(), language: '', proficiency: 'Intermediate' });

  const handleArrayFieldChange = <TItem extends { id: string }>(
    field: keyof ResumeData,
    index: number,
    property: keyof TItem,
    value: any
  ) => {
    setResumeData(prev => {
      const items = [...(prev[field] as TItem[])];
      items[index] = { ...items[index], [property]: value };
      return { ...prev, [field]: items };
    });
  };
  
  const handleAddItem = <TItem extends { id: string }>(field: keyof ResumeData, createDefaultItem: () => TItem) => {
    setResumeData(prev => ({ ...prev, [field]: [...(prev[field] as TItem[]), createDefaultItem()] }));
  };

  const handleRemoveItem = <TItem extends { id: string }>(field: keyof ResumeData, idToRemove: string) => {
    setResumeData(prev => ({ ...prev, [field]: (prev[field] as TItem[]).filter(item => item.id !== idToRemove) }));
  };


  return (
    <div className="space-y-6 pb-16">
      <Accordion type="multiple" defaultValue={['contactInfo', 'summary']} className="w-full">
        <AccordionItem value="photo">
          <AccordionTrigger className="text-xl font-semibold">Photo</AccordionTrigger>
          <AccordionContent className="p-4">
            <PhotoUploader
              photoUrl={resumeData.photoUrl}
              onPhotoChange={(url) => setResumeData(prev => ({ ...prev, photoUrl: url }))}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contactInfo">
          <AccordionTrigger className="text-xl font-semibold">Contact Information</AccordionTrigger>
          <AccordionContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={resumeData.contactInfo.name} onChange={handleContactChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={resumeData.contactInfo.email} onChange={handleContactChange} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" value={resumeData.contactInfo.phone} onChange={handleContactChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={resumeData.contactInfo.address} onChange={handleContactChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input id="linkedin" name="linkedin" value={resumeData.contactInfo.linkedin} onChange={handleContactChange} />
              </div>
              <div>
                <Label htmlFor="github">GitHub Profile URL</Label>
                <Input id="github" name="github" value={resumeData.contactInfo.github} onChange={handleContactChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input id="portfolio" name="portfolio" value={resumeData.contactInfo.portfolio} onChange={handleContactChange} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary">
          <AccordionTrigger className="text-xl font-semibold">Professional Summary</AccordionTrigger>
          <AccordionContent className="p-4 space-y-2">
            <Label htmlFor="professionalSummary">Summary</Label>
            <Textarea
              id="professionalSummary"
              value={resumeData.professionalSummary}
              onChange={(e) => setResumeData(prev => ({ ...prev, professionalSummary: e.target.value }))}
              rows={5}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAiEnhance('professionalSummary', 'Professional Summary', resumeData.professionalSummary)}
              disabled={aiLoadingStates['professionalSummary']}
              className="mt-2"
            >
              {aiLoadingStates['professionalSummary'] ? <LoadingSpinner size={16} className="mr-2" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Enhance with AI
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger className="text-xl font-semibold">Skills</AccordionTrigger>
          <AccordionContent className="p-4 space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={resumeData.skills.join(', ')}
              onChange={handleSkillsChange}
              placeholder="e.g., JavaScript, React, Project Management"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger className="text-xl font-semibold">Experience</AccordionTrigger>
          <AccordionContent className="p-0">
            <ResumeFormSection<ExperienceEntry>
              title=""
              items={resumeData.experience}
              onAddItem={() => handleAddItem('experience', createDefaultExperience)}
              onRemoveItem={(id) => handleRemoveItem('experience', id)}
              itemNoun="Experience"
              renderItem={(item, index) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor={`exp-company-${index}`}>Company</Label><Input id={`exp-company-${index}`} value={item.company} onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)} /></div>
                    <div><Label htmlFor={`exp-role-${index}`}>Role</Label><Input id={`exp-role-${index}`} value={item.role} onChange={(e) => handleArrayFieldChange('experience', index, 'role', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor={`exp-startDate-${index}`}>Start Date</Label><Input id={`exp-startDate-${index}`} type="month" value={item.startDate} onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)} /></div>
                    <div><Label htmlFor={`exp-endDate-${index}`}>End Date (or Present)</Label><Input id={`exp-endDate-${index}`} type="month" value={item.endDate} onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)} /></div>
                  </div>
                   <div><Label htmlFor={`exp-location-${index}`}>Location</Label><Input id={`exp-location-${index}`} value={item.location} onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)} /></div>
                  <div>
                    <Label htmlFor={`exp-description-${index}`}>Description</Label>
                    <Textarea id={`exp-description-${index}`} value={item.description} onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)} rows={4} />
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiEnhance(`experience.${index}.description` as any, 'Experience Description', item.description)}
                        disabled={aiLoadingStates[`experience.${index}.description`]}
                        className="mt-2"
                      >
                        {aiLoadingStates[`experience.${index}.description`] ? <LoadingSpinner size={16} className="mr-2" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Enhance
                      </Button>
                  </div>
                </div>
              )}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className="text-xl font-semibold">Education</AccordionTrigger>
          <AccordionContent className="p-0">
             <ResumeFormSection<EducationEntry>
              title=""
              items={resumeData.education}
              onAddItem={() => handleAddItem('education', createDefaultEducation)}
              onRemoveItem={(id) => handleRemoveItem('education', id)}
              itemNoun="Education Entry"
              renderItem={(item, index) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor={`edu-institution-${index}`}>Institution</Label><Input id={`edu-institution-${index}`} value={item.institution} onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)} /></div>
                    <div><Label htmlFor={`edu-degree-${index}`}>Degree</Label><Input id={`edu-degree-${index}`} value={item.degree} onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><Label htmlFor={`edu-field-${index}`}>Field of Study</Label><Input id={`edu-field-${index}`} value={item.fieldOfStudy} onChange={(e) => handleArrayFieldChange('education', index, 'fieldOfStudy', e.target.value)} /></div>
                     <div><Label htmlFor={`edu-gpa-${index}`}>GPA</Label><Input id={`edu-gpa-${index}`} value={item.gpa} onChange={(e) => handleArrayFieldChange('education', index, 'gpa', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor={`edu-startDate-${index}`}>Start Date</Label><Input id={`edu-startDate-${index}`} type="month" value={item.startDate} onChange={(e) => handleArrayFieldChange('education', index, 'startDate', e.target.value)} /></div>
                    <div><Label htmlFor={`edu-endDate-${index}`}>End Date</Label><Input id={`edu-endDate-${index}`} type="month" value={item.endDate} onChange={(e) => handleArrayFieldChange('education', index, 'endDate', e.target.value)} /></div>
                  </div>
                  <div>
                    <Label htmlFor={`edu-description-${index}`}>Description/Achievements</Label>
                    <Textarea id={`edu-description-${index}`} value={item.description} onChange={(e) => handleArrayFieldChange('education', index, 'description', e.target.value)} rows={3} />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiEnhance(`education.${index}.description` as any, 'Education Description', item.description)}
                        disabled={aiLoadingStates[`education.${index}.description`]}
                        className="mt-2"
                      >
                        {aiLoadingStates[`education.${index}.description`] ? <LoadingSpinner size={16} className="mr-2" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Enhance
                      </Button>
                  </div>
                </div>
              )}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="projects">
          <AccordionTrigger className="text-xl font-semibold">Projects</AccordionTrigger>
          <AccordionContent className="p-0">
            <ResumeFormSection<ProjectEntry>
              title=""
              items={resumeData.projects}
              onAddItem={() => handleAddItem('projects', createDefaultProject)}
              onRemoveItem={(id) => handleRemoveItem('projects', id)}
              itemNoun="Project"
              renderItem={(item, index) => (
                <div className="space-y-4">
                  <div><Label htmlFor={`proj-name-${index}`}>Project Name</Label><Input id={`proj-name-${index}`} value={item.name} onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)} /></div>
                  <div><Label htmlFor={`proj-tech-${index}`}>Technologies (comma-separated)</Label><Input id={`proj-tech-${index}`} value={item.technologies} onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)} /></div>
                  <div><Label htmlFor={`proj-link-${index}`}>Project Link</Label><Input id={`proj-link-${index}`} value={item.link} onChange={(e) => handleArrayFieldChange('projects', index, 'link', e.target.value)} /></div>
                  <div>
                    <Label htmlFor={`proj-description-${index}`}>Description</Label>
                    <Textarea id={`proj-description-${index}`} value={item.description} onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)} rows={3} />
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiEnhance(`projects.${index}.description` as any, 'Project Description', item.description)}
                        disabled={aiLoadingStates[`projects.${index}.description`]}
                        className="mt-2"
                      >
                        {aiLoadingStates[`projects.${index}.description`] ? <LoadingSpinner size={16} className="mr-2" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Enhance
                      </Button>
                  </div>
                </div>
              )}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certifications">
          <AccordionTrigger className="text-xl font-semibold">Certifications</AccordionTrigger>
          <AccordionContent className="p-0">
            <ResumeFormSection<CertificationEntry>
                title=""
                items={resumeData.certifications}
                onAddItem={() => handleAddItem('certifications', createDefaultCertification)}
                onRemoveItem={(id) => handleRemoveItem('certifications', id)}
                itemNoun="Certification"
                renderItem={(item, index) => (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor={`cert-name-${index}`}>Certification Name</Label><Input id={`cert-name-${index}`} value={item.name} onChange={(e) => handleArrayFieldChange('certifications', index, 'name', e.target.value)} /></div>
                        <div><Label htmlFor={`cert-org-${index}`}>Issuing Organization</Label><Input id={`cert-org-${index}`} value={item.issuingOrganization} onChange={(e) => handleArrayFieldChange('certifications', index, 'issuingOrganization', e.target.value)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor={`cert-date-${index}`}>Date Issued</Label><Input id={`cert-date-${index}`} type="month" value={item.dateIssued} onChange={(e) => handleArrayFieldChange('certifications', index, 'dateIssued', e.target.value)} /></div>
                        <div><Label htmlFor={`cert-id-${index}`}>Credential ID (Optional)</Label><Input id={`cert-id-${index}`} value={item.credentialId} onChange={(e) => handleArrayFieldChange('certifications', index, 'credentialId', e.target.value)} /></div>
                    </div>
                  </div>
                )}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger className="text-xl font-semibold">Languages</AccordionTrigger>
          <AccordionContent className="p-0">
             <ResumeFormSection<LanguageEntry>
                title=""
                items={resumeData.languages}
                onAddItem={() => handleAddItem('languages', createDefaultLanguage)}
                onRemoveItem={(id) => handleRemoveItem('languages', id)}
                itemNoun="Language"
                renderItem={(item, index) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`lang-name-${index}`}>Language</Label>
                        <Input id={`lang-name-${index}`} value={item.language} onChange={(e) => handleArrayFieldChange('languages', index, 'language', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor={`lang-proficiency-${index}`}>Proficiency</Label>
                        <Select
                            value={item.proficiency}
                            onValueChange={(value) => handleArrayFieldChange('languages', index, 'proficiency', value)}
                        >
                            <SelectTrigger id={`lang-proficiency-${index}`}>
                                <SelectValue placeholder="Select proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Fluent">Fluent</SelectItem>
                                <SelectItem value="Native">Native</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
