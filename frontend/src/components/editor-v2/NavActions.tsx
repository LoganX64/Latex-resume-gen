import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from "@/components/Icon";
import {
  faFloppyDisk,
  faDownload,
  faFileLines,
  faRotateLeft,
} from "@/lib/icons";
import { useExportActions } from "@/hooks/useExportActions";
import { useResumeStore } from "@/stores/resume-store";
import { toast } from "sonner";

interface NavActionsProps {
  onSaveClick?: () => void;
}

export function NavActions({ onSaveClick }: NavActionsProps) {
  const resetResume = useResumeStore((s) => s.resetResume);
  const { handleExportPdf, handleExportLatex, isExportingPdf } = useExportActions();

  const handleLoadSample = () => {
    resetResume();
    toast.success("Sample data loaded", {
      description: "Resume populated with sample data.",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onSaveClick} tooltip="Save as version">
            <Icon icon={faFloppyDisk} className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span>Save Version</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleExportPdf()} disabled={isExportingPdf} tooltip="Export PDF">
            <Icon icon={faDownload} className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span>Export PDF</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleExportLatex()} tooltip="Export LaTeX">
            <Icon icon={faFileLines} className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span>Export LaTeX</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLoadSample} tooltip="Load sample data">
            <Icon icon={faRotateLeft} className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span>Load Sample</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
