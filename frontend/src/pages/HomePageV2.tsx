import { NavbarV2 } from "@/components/v2/home/NavbarV2";
import { HeroSectionV2 } from "@/components/v2/home/HeroSectionV2";

export default function HomePageV2() {
  return (
    <div className="relative min-h-screen bg-background">
      <NavbarV2 />
      <HeroSectionV2 />
    </div>
  );
}
