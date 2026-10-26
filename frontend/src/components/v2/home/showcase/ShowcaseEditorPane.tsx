import { memo, useEffect, useRef, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/Icon";
import { MoonIcon } from "@/components/MoonIcon";
import { SunIcon } from "@/components/SunIcon";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  faBug,
  faCalendar,
  faCheck,
  faChevronDown,
  faDownload,
  faEye,
  faFloppyDisk,
  faGithub,
  faGripVertical,
  faHouse,
  faKeyboard,
  faMagnifyingGlass,
  faRotateLeft,
  faShieldHalved,
  faTrash,
  faUpload,
  faXmark,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { SHOWCASE_PHOTO, showcaseResume } from "./showcase-data";

const headerButtonClass =
  "border border-dashed border-border/70 text-foreground";

function StaticInput({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <Input
      readOnly
      tabIndex={-1}
      value={value}
      className={cn("!h-8 px-2 text-xs", className)}
    />
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <StaticInput value={value} className={className} />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <CardHeader className="px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-rose-500">
          <Icon icon={faGripVertical} className="h-4 w-4" />
        </span>
        <CardTitle className="flex-1 text-base font-semibold text-foreground">
          {title}
        </CardTitle>
        <span className="inline-flex size-8 items-center justify-center">
          <Icon icon={faEye} className="h-4 w-4 text-primary" />
        </span>
        <span className="inline-flex size-8 items-center justify-center">
          <Icon
            icon={faChevronDown}
            className="h-4 w-4 text-muted-foreground"
          />
        </span>
      </div>
    </CardHeader>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="relative gap-0 overflow-hidden border border-border/60 bg-background/80 py-0 shadow-sm">
      <SectionHeader title={title} />
      <CardContent className="px-3 pt-1 pb-3">{children}</CardContent>
    </Card>
  );
}

function EditorHeader() {
  const { darkMode } = useTheme();

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-3">
      <span className="text-sm font-semibold text-foreground">
        Resume Editor
      </span>
      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faDownload} className="h-4 w-4" />
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faFloppyDisk} className="h-4 w-4" />
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faHouse} className="h-4 w-4" />
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faTrash} className="h-4 w-4 text-rose-500" />
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faRotateLeft} className="h-4 w-4" />
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          {darkMode ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faMagnifyingGlass} className="h-4 w-4" />
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            headerButtonClass
          )}
        >
          <Icon icon={faKeyboard} className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function PersonalInfoCard() {
  const { personalInfo } = showcaseResume;

  return (
    <Card className="relative gap-0 overflow-hidden border border-border/60 bg-background/60 shadow-sm backdrop-blur-sm">
      <CardHeader className="px-3 py-2.5">
        <CardTitle className="text-base font-semibold text-foreground">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pt-1 pb-3">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name *" value={personalInfo.fullName} />
              <Field
                label="Professional Title"
                value={personalInfo.professionalTitle ?? ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email *" value={personalInfo.email} />
              <Field label="Phone *" value={personalInfo.phone} />
            </div>
            <Field label="Location *" value={personalInfo.location} />
            <div className="grid grid-cols-3 gap-3">
              <Field label="LinkedIn" value={personalInfo.linkedin ?? ""} />
              <Field label="GitHub" value={personalInfo.github ?? ""} />
              <Field label="Website" value={personalInfo.website ?? ""} />
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="relative h-20 w-20">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted">
                <img
                  src={SHOWCASE_PHOTO}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <Icon icon={faXmark} className="h-3 w-3" />
              </span>
            </div>
            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 cursor-default gap-1 text-xs"
              )}
            >
              <Icon icon={faUpload} className="h-3 w-3" />
              Upload Photo
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard() {
  const { summary } = showcaseResume;

  return (
    <SectionCard title="Professional Summary">
      <div className="space-y-1.5">
        <Label className="text-xs">Professional Summary</Label>
        <div className="min-h-25 w-full resize-y rounded-md border border-input bg-input/20 px-2 py-2 text-sm leading-relaxed text-foreground">
          {summary}
        </div>
        <p className="text-xs text-muted-foreground">
          {summary.length}/500 characters recommended
        </p>
      </div>
    </SectionCard>
  );
}

function ExperienceCard() {
  const experience = showcaseResume.experience[0];

  return (
    <SectionCard title="Work Experience">
      <Card className="gap-0 overflow-hidden">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-rose-500">
              <Icon icon={faGripVertical} className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 text-xs font-medium text-muted-foreground">
              Experience 1
            </span>
            <span className="inline-flex size-8 items-center justify-center">
              <Icon
                icon={faChevronDown}
                className="h-3 w-3 text-muted-foreground"
              />
            </span>
            <span className="inline-flex size-8 items-center justify-center">
              <Icon icon={faTrash} className="h-3 w-3 text-rose-500" />
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Company *" value={experience.company} />
              <Field label="Position *" value={experience.position} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Location" value={experience.location ?? ""} />
              <div className="space-y-1.5">
                <Label className="text-xs">Start Date *</Label>
                <span className="flex h-8 w-full items-center gap-1 rounded-md border border-input bg-background px-2 text-xs">
                  <span className="flex-1 truncate text-left">Mar 2022</span>
                  <Icon icon={faCalendar} className="size-3.5 opacity-50" />
                </span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End Date</Label>
                <span className="flex h-8 w-full items-center gap-1 rounded-md border border-input bg-background px-2 text-xs">
                  <span className="flex-1 truncate text-left">Present</span>
                  <Icon icon={faCalendar} className="size-3.5 opacity-50" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground">
                <Icon icon={faCheck} className="h-3 w-3" />
              </span>
              <Label className="text-xs">Currently working here</Label>
            </div>
          </div>
        </div>
      </Card>
    </SectionCard>
  );
}

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" },
  );
}

function SkillsCard() {
  const { skills } = showcaseResume;

  return (
    <SectionCard title="Technical Skills">
      <div className="space-y-2">
        {skills.map((category) => (
          <Card key={category.id} className="gap-0 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-500">
                  <Icon icon={faGripVertical} className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 text-xs font-medium text-muted-foreground">
                  {category.name}
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon
                    icon={faChevronDown}
                    className="h-3 w-3 text-muted-foreground"
                  />
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon icon={faTrash} className="h-3 w-3 text-rose-500" />
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-[11px] leading-none text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function ProjectsCard() {
  const { projects } = showcaseResume;

  return (
    <SectionCard title="Projects">
      <div className="space-y-2">
        {projects.map((project) => (
          <Card key={project.id} className="gap-0 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-500">
                  <Icon icon={faGripVertical} className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 truncate text-xs font-medium text-foreground">
                  {project.name}
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon
                    icon={faChevronDown}
                    className="h-3 w-3 text-muted-foreground"
                  />
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon icon={faTrash} className="h-3 w-3 text-rose-500" />
                </span>
              </div>
              {project.description && (
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1">
                {project.technologies.slice(0, 4).map((technology) => (
                  <span
                    key={technology}
                    className="rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] leading-none text-muted-foreground"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function EducationCard() {
  const { education } = showcaseResume;

  return (
    <SectionCard title="Education">
      <div className="space-y-2">
        {education.map((item) => (
          <Card key={item.id} className="gap-0 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-500">
                  <Icon icon={faGripVertical} className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 truncate text-xs font-medium text-foreground">
                  {item.institution}
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon
                    icon={faChevronDown}
                    className="h-3 w-3 text-muted-foreground"
                  />
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon icon={faTrash} className="h-3 w-3 text-rose-500" />
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {item.degree}
                {item.specialization ? ` · ${item.specialization}` : ""}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/80">
                <Icon icon={faCalendar} className="size-2.5" />
                {formatMonth(item.startDate)} – {formatMonth(item.endDate)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function CertificationsCard() {
  const { certifications } = showcaseResume;

  return (
    <SectionCard title="Certifications">
      <div className="space-y-2">
        {certifications.map((certification) => (
          <Card key={certification.id} className="gap-0 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-500">
                  <Icon icon={faGripVertical} className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 truncate text-xs font-medium text-foreground">
                  {certification.name}
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon
                    icon={faChevronDown}
                    className="h-3 w-3 text-muted-foreground"
                  />
                </span>
                <span className="inline-flex size-8 items-center justify-center">
                  <Icon icon={faTrash} className="h-3 w-3 text-rose-500" />
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="truncate">{certification.issuer}</span>
                <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground/80">
                  <Icon icon={faCalendar} className="size-2.5" />
                  {formatMonth(certification.date)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function StorageCard() {
  return (
    <Card
      size="sm"
      className="absolute inset-x-4 bottom-2 z-20 gap-1.5 rounded-xl border border-border/40 bg-background/85 px-3 py-2 ring-0 dark:border-white/10"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
          <Icon
            icon={faShieldHalved}
            className="h-3.5 w-3.5 shrink-0 text-emerald-500"
          />
          <span>Stored locally in browser</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Icon icon={faGithub} className="h-3 w-3" />
            <span>LoganX64</span>
          </span>
          <span>·</span>
          <Icon icon={faBug} className="h-3 w-3 text-rose-500" />
        </div>
      </div>
    </Card>
  );
}

export const ShowcaseEditorPane = memo(function ShowcaseEditorPane({
  activeSection,
}: {
  activeSection: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolledSectionRef = useRef<string | null>(null);

  useEffect(() => {
    if (scrolledSectionRef.current === activeSection) return;
    scrolledSectionRef.current = activeSection;

    const container = scrollRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(
      `[data-showcase-section="${activeSection}"]`,
    );

    container.scrollTo({
      top: target ? target.offsetTop - 8 : 0,
      behavior: "smooth",
    });
  }, [activeSection]);

  return (
    <section className="relative flex h-full min-h-0 min-w-0 flex-col [contain:layout_paint]">
      <EditorHeader />
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          data-showcase-scroll
          className="relative h-full overflow-y-auto px-4 pt-1 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="space-y-4">
            <div data-showcase-section="personal">
              <PersonalInfoCard />
            </div>
            <div data-showcase-section="summary">
              <SummaryCard />
            </div>
            <div data-showcase-section="experience">
              <ExperienceCard />
            </div>
            <div data-showcase-section="skills">
              <SkillsCard />
            </div>
            <div data-showcase-section="projects">
              <ProjectsCard />
            </div>
            <div data-showcase-section="education">
              <EducationCard />
            </div>
            <div data-showcase-section="certifications">
              <CertificationsCard />
            </div>
          </div>
        </div>
        <StorageCard />
      </div>
    </section>
  );
});
