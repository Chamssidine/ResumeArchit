
'use client';

import Image from 'next/image';
import type { ResumeData, ResumePreviewProps, ExperienceEntry, EducationEntry, ProjectEntry, LanguageEntry, CertificationEntry } from '@/types/resume';
import { getFontClassName } from '@/fonts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Mail, MapPin, Phone, Link as LinkIcon, Github, User, Briefcase, GraduationCap, Star, HardHat, CalendarDays, LanguagesIcon } from 'lucide-react';

// Helper to format dates (YYYY-MM or YYYY to Month YYYY or Present)
const formatDate = (dateStr: string | undefined, isEndDate?: boolean) => {
  if (!dateStr) return isEndDate ? 'Present' : '';
  if (isEndDate && (dateStr.toLowerCase() === 'present' || dateStr === '')) return 'Present';
  
  // Check if it's just a year or YYYY-MM
  if (/^\d{4}$/.test(dateStr)) { // Just a year
    return dateStr;
  }
  
  try {
    const [year, month] = dateStr.split('-');
    if (year && month) {
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return dateStr; // Fallback for other formats like "2023"
  } catch (e) {
    return dateStr; // fallback if format is unexpected
  }
};

const SectionTitle: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <h2 
    className="text-xl font-bold mt-6 mb-3 pb-1" 
    style={{ color: color, borderBottom: `2px solid ${color}` }}
  >
    {title.toUpperCase()}
  </h2>
);

const SidebarLink: React.FC<{ href?: string; text: string; iconColor: string; Icon?: React.ElementType; isEmail?: boolean; isPhone?: boolean }> = ({ href, text, iconColor, Icon, isEmail, isPhone }) => {
  if (!text) return null;
  const linkHref = isEmail ? `mailto:${text}` : isPhone ? `tel:${text}` : href;
  return (
    <a href={linkHref} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:underline break-all">
      {Icon && <Icon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: iconColor }} />}
      {text}
    </a>
  );
};


export function ResumePreview({ resumeData, personalization, templateId }: ResumePreviewProps) {
  const fontClassName = getFontClassName(personalization.fontFamily);
  const { contactInfo, professionalSummary, skills, experience, education, projects, certifications, languages } = resumeData;

  const sidebarTextColor = '#FFFFFF'; // Text color for dark sidebar
  const sidebarLinkIconColor = personalization.accentColor; // Use accent for icons in sidebar

  return (
    <div
      id="resume-preview-content"
      className={`min-h-[297mm] w-full max-w-[210mm] mx-auto bg-card shadow-xl flex ${fontClassName} print-exact`}
      style={{ fontFamily: `var(${getFontClassName(personalization.fontFamily).replace('var(','').replace(')','')}, var(--font-geist-sans))` }}
    >
      {/* Left "Sidebar" Column */}
      <div 
        className="w-[35%] p-6 flex flex-col items-center text-center" 
        style={{ backgroundColor: personalization.primaryColor, color: sidebarTextColor }}
      >
        {contactInfo.photoUrl && (
          <Avatar className="w-32 h-32 rounded-full border-2 mb-4" style={{ borderColor: sidebarLinkIconColor }}>
            <AvatarImage src={contactInfo.photoUrl} alt={contactInfo.name || 'User Photo'} data-ai-hint="person photo" />
            <AvatarFallback className="rounded-full text-4xl" style={{ backgroundColor: personalization.accentColor, color: personalization.primaryColor }}>
              {contactInfo.name ? contactInfo.name.charAt(0).toUpperCase() : <User size={48}/>}
            </AvatarFallback>
          </Avatar>
        )}
        <h1 className="text-2xl font-bold mb-1">{contactInfo.name || 'Your Name'}</h1>
        {contactInfo.title && <p className="text-sm mb-4">{contactInfo.title}</p>}
        
        <div className="space-y-2 text-sm text-left w-full">
          {contactInfo.address && (
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: sidebarLinkIconColor }} />
              <span>{contactInfo.address}</span>
            </div>
          )}
          {contactInfo.phone && (
             <div className="flex items-start">
              <Phone className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: sidebarLinkIconColor }} />
              <span>{contactInfo.phone}</span>
            </div>
          )}
          {contactInfo.email && (
            <div className="flex items-start">
              <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: sidebarLinkIconColor }} />
              <a href={`mailto:${contactInfo.email}`} className="hover:underline break-all">{contactInfo.email}</a>
            </div>
          )}
          {contactInfo.linkedin && (
            <SidebarLink href={contactInfo.linkedin} text={contactInfo.linkedin.replace('https://www.','').replace('linkedin.com/in/','LinkedIn: ')} Icon={Linkedin} iconColor={sidebarLinkIconColor} />
          )}
          {contactInfo.github && (
            <SidebarLink href={contactInfo.github} text={contactInfo.github.replace('https://www.','').replace('github.com/','GitHub: ')} Icon={Github} iconColor={sidebarLinkIconColor} />
          )}
          {contactInfo.portfolio && (
            <SidebarLink href={contactInfo.portfolio} text="Portfolio" Icon={LinkIcon} iconColor={sidebarLinkIconColor} />
          )}
        </div>
      </div>

      {/* Right "Content" Column */}
      <div className="w-[65%] p-8 bg-card text-foreground flex-grow">
        {professionalSummary && (
          <section>
            <SectionTitle title="Profil Professionnel" color={personalization.primaryColor} />
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{professionalSummary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <SectionTitle title="Compétences Techniques" color={personalization.primaryColor} />
            <ul className="list-none pl-0 space-y-1">
              {skills.map((skill, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span style={{ color: personalization.primaryColor, marginRight: '10px', lineHeight: '1.5' }}>•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {experience.filter(exp => exp.role || exp.company).length > 0 && (
          <section>
            <SectionTitle title="Expériences Professionnelles" color={personalization.primaryColor} />
            {experience.map((exp) => exp.role || exp.company ? (
              <div key={exp.id} className="mb-4 last:mb-0">
                <h3 className="text-md font-semibold text-foreground">
                  {exp.role} {exp.company && `– ${exp.company}`}
                </h3>
                {(exp.startDate || exp.endDate) && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate, true)}
                    {exp.location && <span className="ml-1">| {exp.location}</span>}
                  </p>
                )}
                {exp.description && <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{exp.description}</p>}
              </div>
            ): null)}
          </section>
        )}
        
        {projects.filter(proj => proj.name).length > 0 && (
          <section>
            <SectionTitle title="Projets Notables" color={personalization.primaryColor} />
            {projects.map((proj) => proj.name ? (
              <div key={proj.id} className="mb-4 last:mb-0">
                 <h3 className="text-md font-semibold text-foreground flex items-center">
                  {proj.name}
                  {proj.link && (
                    <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="ml-2">
                      <LinkIcon className="w-3 h-3" style={{ color: personalization.accentColor }}/>
                    </a>
                  )}
                </h3>
                {proj.technologies && <p className="text-xs text-muted-foreground mb-0.5">Technologies: {proj.technologies}</p>}
                {proj.description && <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{proj.description}</p>}
              </div>
            ): null)}
          </section>
        )}

        {education.filter(edu => edu.institution || edu.degree).length > 0 && (
          <section>
            <SectionTitle title="Formation" color={personalization.primaryColor} />
            {education.map((edu) => edu.institution || edu.degree ? (
              <div key={edu.id} className="mb-4 last:mb-0">
                <h3 className="text-md font-semibold text-foreground">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </h3>
                <p className="text-sm font-medium mb-0.5" style={{ color: personalization.accentColor }}>{edu.institution}</p>
                {(edu.startDate || edu.endDate) && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate, true)}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </p>
                )}
                {edu.description && <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{edu.description}</p>}
              </div>
            ): null)}
          </section>
        )}

        {certifications && certifications.filter(cert => cert.name).length > 0 && (
          <section>
            <SectionTitle title="Certifications" color={personalization.primaryColor} />
            {certifications.map((cert) => cert.name ? (
              <div key={cert.id} className="mb-3 last:mb-0">
                <h3 className="text-md font-semibold text-foreground">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuingOrganization}{cert.dateIssued ? ` | ${formatDate(cert.dateIssued)}` : ''}</p>
                {cert.credentialId && <p className="text-xs text-muted-foreground/80 mt-0.5">Credential ID: {cert.credentialId}</p>}
              </div>
            ): null)}
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <SectionTitle title="Langues" color={personalization.primaryColor} />
            <ul className="list-none pl-0 space-y-1">
              {languages.map((lang) => lang.language ? (
                <li key={lang.id} className="text-sm flex items-start">
                  <span style={{ color: personalization.primaryColor, marginRight: '10px', lineHeight: '1.5' }}>•</span>
                  <span><strong>{lang.language}:</strong> {lang.proficiency}</span>
                </li>
              ): null)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
