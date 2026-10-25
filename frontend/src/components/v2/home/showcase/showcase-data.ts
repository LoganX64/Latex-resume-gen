import { sampleResume } from "@/stores/resume-store";
import type { ResumeData, SectionOrder } from "@/types/resume";

export const SHOWCASE_PHOTO = "/profile-pic-preview.jpg";
export const SHOWCASE_WIDTH = 1440;
export const SHOWCASE_HEIGHT = 900;
export const SHOWCASE_SIDEBAR_WIDTH = 240;

export const showcaseResume: ResumeData = {
  ...sampleResume,
  personalInfo: {
    ...sampleResume.personalInfo,
    profileImage: SHOWCASE_PHOTO,
  },
  experience: sampleResume.experience.slice(0, 2),
  skills: sampleResume.skills.slice(0, 4),
  projects: sampleResume.projects.slice(0, 2),
  certifications: sampleResume.certifications.slice(0, 2),
  achievements: sampleResume.achievements.slice(0, 1),
  publications: sampleResume.publications.slice(0, 1),
};

export const showcaseSections: SectionOrder[] = [
  { id: "1", type: "summary", label: "Professional Summary" },
  { id: "2", type: "experience", label: "Work Experience" },
  { id: "3", type: "skills", label: "Technical Skills" },
  { id: "4", type: "projects", label: "Projects" },
  { id: "5", type: "education", label: "Education" },
  { id: "6", type: "certifications", label: "Certifications" },
  { id: "7", type: "achievements", label: "Achievements" },
  { id: "8", type: "publications", label: "Publications" },
  { id: "9", type: "languages", label: "Languages" },
];
