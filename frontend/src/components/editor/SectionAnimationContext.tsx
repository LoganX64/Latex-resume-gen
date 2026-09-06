import { createContext, useContext } from "react";

interface SectionAnimationState {
  collapsed: boolean;
}

const SectionAnimationContext = createContext<SectionAnimationState>({
  collapsed: true,
});

export const useSectionAnimation = () => useContext(SectionAnimationContext);
export const SectionAnimationProvider = SectionAnimationContext.Provider;
