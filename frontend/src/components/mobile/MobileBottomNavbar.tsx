import { Icon } from "@/components/Icon";
import { faEye, faDownload, faHouse, faBookmark, faFloppyDisk } from "@/lib/icons";
import { Spinner } from "@/components/ui/spinner";
import { m } from "framer-motion";

interface MobileBottomNavbarProps {
  onHome: () => void;
  onSaved: () => void;
  onSave: () => void;
  onPreview: () => void;
  onDownload: () => void;
  isExportingPdf: boolean;
}

const BTN_SIZE = 56;
const VW       = 358;
const BAR_H    = 64;
const R_OUT    = 22;
const CX       = VW / 2;
const NR       = 32;
const FR       = 14;
const PAD_TOP  = 16;

const svgPath = [
  `M ${R_OUT} 0`,
  `L ${CX - NR - FR} 0`,
  `Q ${CX - NR} 0, ${CX - NR} ${FR}`,
  `A ${NR} ${NR} 0 0 0 ${CX + NR} ${FR}`,
  `Q ${CX + NR} 0, ${CX + NR + FR} 0`,
  `L ${VW - R_OUT} 0`,
  `A ${R_OUT} ${R_OUT} 0 0 1 ${VW} ${R_OUT}`,
  `L ${VW} ${BAR_H - R_OUT}`,
  `A ${R_OUT} ${R_OUT} 0 0 1 ${VW - R_OUT} ${BAR_H}`,
  `L ${R_OUT} ${BAR_H}`,
  `A ${R_OUT} ${R_OUT} 0 0 1 0 ${BAR_H - R_OUT}`,
  `L 0 ${R_OUT}`,
  `A ${R_OUT} ${R_OUT} 0 0 1 ${R_OUT} 0`,
  `Z`,
].join(" ");

export function MobileBottomNavbar({
  onHome,
  onSaved,
  onSave,
  onPreview,
  onDownload,
  isExportingPdf,
}: MobileBottomNavbarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none select-none px-4 pb-3 safe-area-inset-bottom"
      style={{ paddingTop: PAD_TOP }}
    >
      <div
        className="relative mx-auto max-w-md pointer-events-auto"
        style={{
          height: BAR_H,
          filter:
            "drop-shadow(0px 8px 24px rgba(0,0,0,0.08)) drop-shadow(0px 2px 6px rgba(0,0,0,0.04))",
        }}
      >
        <svg
          viewBox={`0 0 ${VW} ${BAR_H}`}
          preserveAspectRatio="none"
          className="w-full h-full block"
          aria-hidden="true"
        >
          <path d={svgPath} fill="white" />
        </svg>

        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
        >
          <NavTab label="Save" onClick={onSave} ariaLabel="Save version">
            <Icon icon={faFloppyDisk} style={{ width: 20, height: 20 }} />
          </NavTab>

          <NavTab label="Saved" onClick={onSaved} ariaLabel="Saved versions">
            <Icon icon={faBookmark} style={{ width: 20, height: 20 }} />
          </NavTab>

          <div aria-hidden="true" />

          <NavTab label="Preview" onClick={onPreview} ariaLabel="Preview">
            <Icon icon={faEye} style={{ width: 20, height: 20 }} />
          </NavTab>

          <NavTab
            label={isExportingPdf ? "Exporting" : "Download"}
            onClick={onDownload}
            disabled={isExportingPdf}
            ariaLabel="Download PDF"
          >
            {isExportingPdf ? (
              <Spinner style={{ width: 20, height: 20 }} />
            ) : (
              <Icon icon={faDownload} style={{ width: 20, height: 20 }} />
            )}
          </NavTab>
        </div>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"
        style={{ top: 0, zIndex: 20 }}
      >
        <m.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          onClick={onHome}
          aria-label="Home"
          className="flex items-center justify-center rounded-full text-[var(--primary-foreground)] focus:outline-none shadow-md"
          style={{
            width: BTN_SIZE,
            height: BTN_SIZE,
            background: "var(--primary)",
          }}
        >
          <Icon icon={faHouse} style={{ width: 22, height: 22 }} />
        </m.button>
      </div>
    </nav>
  );
}

interface NavTabProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

function NavTab({ label, onClick, disabled, ariaLabel, children }: NavTabProps) {
  return (
    <m.button
      whileTap={{ scale: 0.88, y: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex flex-col items-center justify-center h-full text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 focus:outline-none"
      style={{ gap: 3 }}
    >
      {children}
      <span className="font-medium leading-none" style={{ fontSize: 11 }}>
        {label}
      </span>
    </m.button>
  );
}
