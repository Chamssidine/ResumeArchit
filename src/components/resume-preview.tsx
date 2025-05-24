
'use client';

import Image from 'next/image';
import type { ResumePreviewProps } from '@/types/resume';
import { getFontClassName } from '@/fonts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, CalendarDays, GraduationCap, HardHat, LanguagesIcon, Linkedin, Mail, MapPin, Phone, Star, User, Link as LinkIcon, Github } from 'lucide-react';

// Helper to format dates (YYYY-MM to Month YYYY or Present)
const formatDate = (dateStr: string, isEndDate?: boolean) => {
  if (!dateStr) return isEndDate ? 'Present' : '';
  if (isEndDate && (dateStr.toLowerCase() === 'present' || dateStr === '')) return 'Present';
  try {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch (e) {
    return dateStr; // fallback if format is unexpected
  }
};

export function ResumePreview({ resumeData, personalization, templateId }: ResumePreviewProps) {
  const fontClassName = getFontClassName(personalization.fontFamily);

  const primaryColorStyle = { color: personalization.primaryColor };
  const accentColorStyle = { color: personalization.accentColor };
  const borderColorStyle = { borderColor: personalization.primaryColor };

  const renderSectionTitle = (title: string, Icon?: React.ElementType) => (
    <div className="flex items-center pt-6 pb-2 mb-4 border-b-2" style={borderColorStyle}>
      {Icon && <Icon className="w-6 h-6 mr-3 flex-shrink-0" style={primaryColorStyle} />}
      <h2 className="text-2xl font-semibold" style={primaryColorStyle}>
        {title}
      </h2>
    </div>
  );

  const renderContactItem = (Icon: React.ElementType, text: string | undefined, href?: string) => {
    if (!text) return null;
    const content = (
      <div className="flex items-center text-sm text-muted-foreground mb-1">
        <Icon className="w-4 h-4 mr-2.5 flex-shrink-0" style={accentColorStyle} />
        <span className="break-all">{text}</span>
      </div>
    );
    return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary transition-colors duration-150">{content}</a> : content;
  };

  return (
    <div
      id="resume-preview-content"
      className={`p-10 bg-white shadow-xl rounded-lg w-full max-w-3xl mx-auto my-8 ${fontClassName} text-foreground print-exact`}
      style={{ fontFamily: `var(${getFontClassName(personalization.fontFamily).replace('var(','').replace(')','')}, var(--font-geist-sans))` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2" style={borderColorStyle}>
        <div className="max-w-[calc(100%-10rem)]"> {/* Ensure text doesn't overlap with photo if name is too long */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={primaryColorStyle}>
            {resumeData.contactInfo.name || 'Your Name'}
          </h1>
          <div className="space-y-1">
            {renderContactItem(Mail, resumeData.contactInfo.email, `mailto:${resumeData.contactInfo.email}`)}
            {renderContactItem(Phone, resumeData.contactInfo.phone, `tel:${resumeData.contactInfo.phone}`)}
            {renderContactItem(MapPin, resumeData.contactInfo.address)}
            {renderContactItem(Linkedin, resumeData.contactInfo.linkedin, resumeData.contactInfo.linkedin)}
            {renderContactItem(Github, resumeData.contactInfo.github, resumeData.contactInfo.github)}
            {renderContactItem(LinkIcon, resumeData.contactInfo.portfolio, resumeData.contactInfo.portfolio)}
          </div>
        </div>
        {resumeData.photoUrl && (
          <Avatar className="h-32 w-32 lg:h-36 lg:w-36 rounded-lg shadow-md ml-6 flex-shrink-0">
            <AvatarImage src={resumeData.photoUrl} alt={resumeData.contactInfo.name || 'User Photo'} data-ai-hint="person photo" />
            <AvatarFallback className="rounded-lg text-4xl lg:text-5xl">
              {resumeData.contactInfo.name ? resumeData.contactInfo.name.charAt(0).toUpperCase() : <User size={48} className="lg:size-60"/>}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Professional Summary */}
      {resumeData.professionalSummary && (
        <section>
          {renderSectionTitle('Summary', User)}
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{resumeData.professionalSummary}</p>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section>
          {renderSectionTitle('Skills', Star)}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1.5 text-xs rounded-md border font-medium" style={{ backgroundColor: `${personalization.accentColor}1A`, borderColor: `${personalization.accentColor}80`, color: personalization.accentColor }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.filter(exp => exp.company || exp.role).length > 0 && (
        <section>
          {renderSectionTitle('Experience', Briefcase)}
          {resumeData.experience.map((exp) => exp.company || exp.role ? (
            <div key={exp.id} className="mb-5 last:mb-0">
              <h3 className="text-lg font-semibold text-foreground">{exp.role || 'Role'}</h3>
              <p className="text-md font-medium mb-0.5" style={accentColorStyle}>
                {exp.company || 'Company'}
                {exp.location && <span className="text-sm text-muted-foreground font-normal"> | {exp.location}</span>}
              </p>
              {(exp.startDate || exp.endDate) && (
                <p className="text-xs text-muted-foreground mb-1.5">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate, true)}
                </p>
              )}
              {exp.description && <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{exp.description}</p>}
            </div>
          ): null)}
        </section>
      )}

      {/* Education */}
      {resumeData.education.filter(edu => edu.institution || edu.degree).length > 0 && (
        <section>
          {renderSectionTitle('Education', GraduationCap)}
          {resumeData.education.map((edu) => edu.institution || edu.degree ? (
            <div key={edu.id} className="mb-5 last:mb-0">
              <h3 className="text-lg font-semibold text-foreground">{edu.degree || 'Degree'} {edu.fieldOfStudy ? <span className="font-normal text-md">in {edu.fieldOfStudy}</span> : ''}</h3>
              <p className="text-md font-medium mb-0.5" style={accentColorStyle}>{edu.institution || 'Institution'}</p>
              {(edu.startDate || edu.endDate || edu.gpa) && (
                <p className="text-xs text-muted-foreground mb-1.5">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate, true)}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </p>
              )}
              {edu.description && <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{edu.description}</p>}
            </div>
          ): null)}
        </section>
      )}

      {/* Projects */}
      {resumeData.projects.filter(proj => proj.name).length > 0 && (
        <section>
          {renderSectionTitle('Projects', HardHat)}
          {resumeData.projects.map((proj) => proj.name ? (
            <div key={proj.id} className="mb-5 last:mb-0">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-foreground">{proj.name || 'Project Name'}</h3>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                    <LinkIcon className="w-4 h-4" style={accentColorStyle}/>
                  </a>
                )}
              </div>
              {proj.technologies && <p className="text-xs text-muted-foreground mb-1">Technologies: {proj.technologies}</p>}
              {proj.description && <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{proj.description}</p>}
            </div>
          ): null)}
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications.filter(cert => cert.name).length > 0 && (
        <section>
          {renderSectionTitle('Certifications', CalendarDays)}
          {resumeData.certifications.map((cert) => cert.name ? (
            <div key={cert.id} className="mb-3.5 last:mb-0">
              <h3 className="text-md font-semibold text-foreground">{cert.name || 'Certification Name'}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}{cert.dateIssued ? ` | ${formatDate(cert.dateIssued)}` : ''}</p>
              {cert.credentialId && <p className="text-xs text-muted-foreground/80 mt-0.5">Credential ID: {cert.credentialId}</p>}
            </div>
          ): null)}
        </section>
      )}

      {/* Languages */}
      {resumeData.languages.filter(lang => lang.language).length > 0 && (
        <section>
          {renderSectionTitle('Languages', LanguagesIcon)}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
            {resumeData.languages.map((lang) => lang.language ? (
              <div key={lang.id} className="text-sm text-foreground/90 flex justify-between">
                <span>{lang.language || 'Language'}</span>
                <span className="font-medium text-muted-foreground text-right">{lang.proficiency || 'Proficiency'}</span>
              </div>
            ): null)}
          </div>
        </section>
      )}
    </div>
  );
}
