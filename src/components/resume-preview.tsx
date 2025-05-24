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
    <div className="flex items-center mb-3 mt-6">
      {Icon && <Icon className="w-5 h-5 mr-2" style={primaryColorStyle} />}
      <h2 className="text-xl font-bold" style={primaryColorStyle}>
        {title}
      </h2>
    </div>
  );

  const renderContactItem = (Icon: React.ElementType, text: string | undefined, href?: string) => {
    if (!text) return null;
    const content = (
      <div className="flex items-center text-sm text-gray-700 mb-1">
        <Icon className="w-3.5 h-3.5 mr-2" style={accentColorStyle} />
        {text}
      </div>
    );
    return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">{content}</a> : content;
  };

  return (
    <div
      id="resume-preview-content"
      className={`p-8 bg-white shadow-lg rounded-lg w-full max-w-3xl mx-auto my-8 ${fontClassName} text-gray-800 print-exact`}
      style={{ fontFamily: `var(${getFontClassName(personalization.fontFamily).replace('var(','').replace(')','')}, var(--font-geist-sans))` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `2px solid ${personalization.primaryColor}` }}>
        <div>
          <h1 className="text-4xl font-bold" style={primaryColorStyle}>
            {resumeData.contactInfo.name || 'Your Name'}
          </h1>
          {/* Contact Info under name */}
          <div className="mt-2 space-y-0.5">
            {renderContactItem(Mail, resumeData.contactInfo.email, `mailto:${resumeData.contactInfo.email}`)}
            {renderContactItem(Phone, resumeData.contactInfo.phone, `tel:${resumeData.contactInfo.phone}`)}
            {renderContactItem(MapPin, resumeData.contactInfo.address)}
            {renderContactItem(Linkedin, resumeData.contactInfo.linkedin, resumeData.contactInfo.linkedin)}
            {renderContactItem(Github, resumeData.contactInfo.github, resumeData.contactInfo.github)}
            {renderContactItem(LinkIcon, resumeData.contactInfo.portfolio, resumeData.contactInfo.portfolio)}
          </div>
        </div>
        {resumeData.photoUrl && (
          <Avatar className="h-32 w-32 rounded-md">
            <AvatarImage src={resumeData.photoUrl} alt={resumeData.contactInfo.name} data-ai-hint="person photo" />
            <AvatarFallback className="rounded-md text-4xl">
              {resumeData.contactInfo.name ? resumeData.contactInfo.name.charAt(0).toUpperCase() : <User size={48}/>}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Professional Summary */}
      {resumeData.professionalSummary && (
        <section>
          {renderSectionTitle('Summary', User)}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{resumeData.professionalSummary}</p>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section>
          {renderSectionTitle('Skills', Star)}
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 text-xs rounded-full border" style={{ backgroundColor: `${personalization.accentColor}20`, borderColor: personalization.accentColor, color: personalization.accentColor }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section>
          {renderSectionTitle('Experience', Briefcase)}
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <h3 className="text-lg font-semibold">{exp.role || 'Role'}</h3>
              <p className="text-md font-medium" style={accentColorStyle}>{exp.company || 'Company'} | {exp.location || 'Location'}</p>
              <p className="text-xs text-gray-500 mb-1">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate, true)}
              </p>
              {exp.description && <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section>
          {renderSectionTitle('Education', GraduationCap)}
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="text-lg font-semibold">{edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
              <p className="text-md font-medium" style={accentColorStyle}>{edu.institution || 'Institution'}</p>
              <p className="text-xs text-gray-500 mb-1">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate, true)}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </p>
              {edu.description && <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <section>
          {renderSectionTitle('Projects', HardHat)}
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">{proj.name || 'Project Name'}</h3>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                    <LinkIcon className="w-4 h-4" style={accentColorStyle}/>
                  </a>
                )}
              </div>
              {proj.technologies && <p className="text-xs text-gray-500 mb-1">Technologies: {proj.technologies}</p>}
              {proj.description && <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && (
        <section>
          {renderSectionTitle('Certifications', CalendarDays)}
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <h3 className="text-md font-semibold">{cert.name || 'Certification Name'}</h3>
              <p className="text-sm text-gray-600">{cert.issuingOrganization || 'Issuing Organization'}{cert.dateIssued ? ` | ${formatDate(cert.dateIssued)}` : ''}</p>
              {cert.credentialId && <p className="text-xs text-gray-500">Credential ID: {cert.credentialId}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Languages */}
      {resumeData.languages.length > 0 && (
        <section>
          {renderSectionTitle('Languages', LanguagesIcon)}
          <ul className="list-disc list-inside">
            {resumeData.languages.map((lang) => (
              <li key={lang.id} className="text-sm text-gray-700">
                {lang.language || 'Language'} - <span className="font-medium">{lang.proficiency || 'Proficiency'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
