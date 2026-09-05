import { Icon } from "@/components/Icon";
import { faMapPin, faArrowUpRightFromSquare, faPhone, faGlobe, faEnvelope, faGithub, faLinkedin } from "@/lib/icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type IconType = 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'website' | 'externalLink'

const iconMap: Record<IconType, IconDefinition> = {
  email: faEnvelope,
  phone: faPhone,
  location: faMapPin,
  linkedin: faLinkedin,
  github: faGithub,
  website: faGlobe,
  externalLink: faArrowUpRightFromSquare,
};

interface ContactIconProps {
  type: IconType
  className?: string
}

export function ContactIcon({ type, className = '' }: ContactIconProps) {
  return <Icon icon={iconMap[type]} className={className} />;
}