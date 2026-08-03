import type { ResumeData } from "@/types/resume";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/utils";
import config from "./config";
import { generateProfessionalLatex } from "./latex";
import { ContactIcon } from "../icons";

function fmtDateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = current ? "Present" : formatDate(end);
  if (!s) return "";
  return `${s} – ${e}`;
}

function Preview({
  resume,
  sections,
}: {
  resume: ResumeData;
  sections: { id: string; type: string; label: string }[];
}): ReactNode {
  const { personalInfo } = resume;

  return (
    <div
      style={{
        fontFamily: '"CMU Serif", "Times New Roman", Times, serif',
        fontSize: "14px",
        lineHeight: "1.14",
        color: "#000",
      }}
    >
      {/* Header */}
      {personalInfo.fullName && (
        <header className="text-center pb-1 mb-1">
          <h1
            className="text-[33px] font-bold text-black"
            style={{ fontVariant: "small-caps" }}
          >
            {personalInfo.fullName}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-[13px] text-gray-700 italic mt-0">
              {personalInfo.professionalTitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-0 mt-1 text-[14px] text-black">
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <ContactIcon type="phone" className="w-4 h-4" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.phone &&
              (personalInfo.email ||
                personalInfo.linkedin ||
                personalInfo.github ||
                personalInfo.website) && <span> | </span>}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="underline text-black inline-flex items-center gap-1"
              >
                <ContactIcon type="email" className="w-4 h-4" />
                {personalInfo.email}
              </a>
            )}
            {personalInfo.email &&
              (personalInfo.linkedin ||
                personalInfo.github ||
                personalInfo.website) && <span> | </span>}
            {personalInfo.linkedin && (
              <a
                href={`https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black inline-flex items-center gap-1"
              >
                <ContactIcon type="linkedin" className="w-4 h-4" />
                {personalInfo.linkedin}
              </a>
            )}
            {personalInfo.linkedin &&
              (personalInfo.github || personalInfo.website) && <span> | </span>}
            {personalInfo.github && (
              <a
                href={`https://${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black inline-flex items-center gap-1"
              >
                <ContactIcon type="github" className="w-4 h-4" />
                {personalInfo.github}
              </a>
            )}
            {personalInfo.github && personalInfo.website && <span> | </span>}
            {personalInfo.website && (
              <a
                href={`https://${personalInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black inline-flex items-center gap-1"
              >
                <ContactIcon type="website" className="w-4 h-4" />
                {personalInfo.website}
              </a>
            )}
          </div>
        </header>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <SectionContent key={section.id} section={section} resume={resume} />
      ))}
    </div>
  );
}

function SectionContent({
  section,
  resume,
}: {
  section: { type: string; label: string };
  resume: ResumeData;
}) {
  switch (section.type) {
    case "summary":
      return resume.summary ? (
        <Section title="Summary">
          <p className="text-[14px]">{resume.summary}</p>
        </Section>
      ) : null;

    case "experience":
      return resume.experience.length > 0 ? (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[14px]">
                  {exp.position || "Position"}
                </span>
                <span className="text-[14px] text-gray-700">
                  {fmtDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-gray-700 italic">
                  {exp.company || "Company"}
                </span>
                {exp.location && (
                  <span className="text-[13px] text-gray-700 italic">
                    {exp.location}
                  </span>
                )}
              </div>
              {exp.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {exp.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li
                      key={i}
                      className="text-[13px] pl-2 relative before:content-['•'] before:absolute before:left-0"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "skills":
      return resume.skills.length > 0 ? (
        <Section title="Technical Skills">
          <div className="text-[13px]">
            {resume.skills.map((cat) => (
              <div key={cat.id} className="mb-0.5 last:mb-0">
                <span className="font-bold">{cat.name || "Category"}:</span>{" "}
                {cat.skills.join(", ")}
              </div>
            ))}
          </div>
        </Section>
      ) : null;

    case "projects":
      return resume.projects.length > 0 ? (
        <Section title="Projects">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">
                  {proj.name || "Project"}
                  {proj.role && (
                    <>
                      {" "}
                      — <span className="italic font-normal">{proj.role}</span>
                    </>
                  )}
                </span>
                {proj.duration && (
                  <span className="text-[14px] text-gray-700">
                    {proj.duration}
                  </span>
                )}
              </div>
              {proj.technologies.length > 0 && (
                <p className="text-[13px] text-gray-700 mt-px">
                  <span className="italic">{proj.technologies.join(", ")}</span>
                </p>
              )}
              {proj.description && (
                <p className="text-[13px] mt-0">{proj.description}</p>
              )}
              {proj.bulletPoints.filter(Boolean).length > 0 && (
                <ul className="mt-0 space-y-0">
                  {proj.bulletPoints.filter(Boolean).map((bullet, i) => (
                    <li
                      key={i}
                      className="text-[13px] pl-2 relative before:content-['•'] before:absolute before:left-0"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {(proj.githubUrl || proj.liveDemoUrl) && (
                <p className="text-[13px] text-gray-700 mt-px">
                  {proj.githubUrl && <span>GitHub: {proj.githubUrl}</span>}
                  {proj.githubUrl && proj.liveDemoUrl && <span> | </span>}
                  {proj.liveDemoUrl && <span>Demo: {proj.liveDemoUrl}</span>}
                </p>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "education":
      return resume.education.length > 0 ? (
        <Section title="Education">
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[14px]">
                  {edu.institution || "Institution"}
                </span>
                <span className="text-[14px] text-gray-700">
                  {fmtDateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-gray-700 italic">
                  {edu.degree || "Degree"}
                  {edu.specialization ? `, ${edu.specialization}` : ""}
                </span>
                {edu.cgpa && (
                  <span className="text-[13px] text-gray-700">
                    CGPA: {edu.cgpa}
                  </span>
                )}
              </div>
            </div>
          ))}
        </Section>
      ) : null;

    case "certifications":
      return resume.certifications.length > 0 ? (
        <Section title="Certifications">
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-1 last:mb-0">
              <span className="font-bold text-[13px]">
                {cert.name || "Certification"}
              </span>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <ContactIcon
                    type="externalLink"
                    className="w-3.5 h-3.5 inline"
                  />
                </a>
              )}
              {cert.issuer && (
                <span className="text-[13px] text-gray-700">
                  {" "}
                  - {cert.issuer}
                </span>
              )}
              {cert.date && (
                <span className="text-[13px] text-gray-700 italic ml-1">
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "achievements":
      return resume.achievements.length > 0 ? (
        <Section title="Achievements">
          {resume.achievements.map((ach) => (
            <div key={ach.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[14px]">
                  {ach.title || "Achievement"}
                </span>
                {ach.date && (
                  <span className="text-[14px] text-gray-700">{ach.date}</span>
                )}
              </div>
              {ach.description && (
                <p className="text-[14px]">{ach.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "publications":
      return resume.publications.length > 0 ? (
        <Section title="Publications">
          {resume.publications.map((pub) => (
            <div key={pub.id} className="mb-1 last:mb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[14px]">
                  {pub.title || "Publication"}
                </span>
                <span className="text-[14px] text-gray-700">{pub.date}</span>
              </div>
              <span className="text-[14px] text-gray-700 italic">
                {pub.publisher}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-gray-500 hover:text-gray-700 not-italic"
                  >
                    <ContactIcon
                      type="externalLink"
                      className="w-3.5 h-3.5 inline"
                    />
                  </a>
                )}
              </span>
              {pub.description && (
                <p className="text-[14px]">{pub.description}</p>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "languages":
      return resume.languages.length > 0 ? (
        <Section title="Languages">
          <span className="text-[13px]">
            {resume.languages
              .map(
                (lang) =>
                  `${lang.name || "Language"}${lang.proficiency ? ` (${lang.proficiency})` : ""}`,
              )
              .join(", ")}
          </span>
        </Section>
      ) : null;

    case "customSections":
      return resume.customSections.length > 0 ? (
        <>
          {resume.customSections.map((cs) => (
            <Section key={cs.id} title={cs.title || "Custom Section"}>
              <p className="text-[14px] whitespace-pre-wrap">{cs.content}</p>
            </Section>
          ))}
        </>
      ) : null;

    default:
      return null;
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-px" data-section="true">
      <h2
        className="text-[16px] font-bold text-black border-b border-gray-300 pb-px mb-0.75"
        style={{ fontVariant: "small-caps" }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export default {
  config,
  Preview,
  generateLatex: generateProfessionalLatex,
};
