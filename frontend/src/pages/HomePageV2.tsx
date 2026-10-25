import { NavbarV2 } from "@/components/v2/home/NavbarV2";
import { HeroSectionV2 } from "@/components/v2/home/HeroSectionV2";
import { EditorShowcaseV2 } from "@/components/v2/home/EditorShowcaseV2";
import { FeaturesSectionV2 } from "@/components/v2/home/FeaturesSectionV2";
import { StepsSectionV2 } from "@/components/v2/home/StepsSectionV2";
import { YourResumesSectionV2 } from "@/components/v2/home/YourResumesSectionV2";
import { Footer } from "@/components/Footer";

export default function HomePageV2() {
  return (
    <div className="relative min-h-screen bg-background">
      <NavbarV2 />
      <HeroSectionV2 />
      <EditorShowcaseV2 />
      <FeaturesSectionV2 />
      <StepsSectionV2 />
      <YourResumesSectionV2 />
      <Footer homePath="/v2" />
    </div>
  );
}
