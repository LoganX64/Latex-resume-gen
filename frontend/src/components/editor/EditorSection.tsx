import type { ReactNode } from "react";
import { m } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { editorSection } from "@/lib/motion";

interface EditorSectionProps {
  sectionType: string;
  children: ReactNode;
}

export function EditorSection({ sectionType, children }: EditorSectionProps) {
  const { ref, isInView } = useScrollReveal();

  return (
    <m.div
      ref={ref}
      id={`section-${sectionType}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={editorSection}
    >
      {children}
    </m.div>
  );
}
