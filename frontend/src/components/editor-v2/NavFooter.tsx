import { useNavigate } from "react-router-dom";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@/components/Icon";
import {
  faFloppyDisk,
  faHouse,
  faEye,
  faDownload,
} from "@/lib/icons";

interface NavFooterProps {
  stats: { visits: number; downloads: number };
  onSaveClick?: () => void;
}

export function NavFooter({ stats, onSaveClick }: NavFooterProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();

  return (
    <SidebarFooter className="p-2">
      {state === "collapsed" ? (
        <div className="flex flex-col items-center gap-1 py-1">
          <span
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-sidebar-accent transition-colors cursor-default"
            title={`${stats.visits.toLocaleString()} visit${stats.visits !== 1 ? "s" : ""}`}
          >
            <Icon icon={faEye} className="h-4 w-4 text-sidebar-foreground/60" />
          </span>
          <span
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-sidebar-accent transition-colors cursor-default"
            title={`${stats.downloads.toLocaleString()} download${stats.downloads !== 1 ? "s" : ""}`}
          >
            <Icon icon={faDownload} className="h-4 w-4 text-sidebar-foreground/60" />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-sidebar-foreground/60">
          <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
            <Icon icon={faEye} className="h-3.5 w-3.5" />
            <span>
              {stats.visits.toLocaleString()} visit
              {stats.visits !== 1 ? "s" : ""}
            </span>
          </span>
          <span className="text-sidebar-foreground/30">·</span>
          <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
            <Icon icon={faDownload} className="h-3.5 w-3.5" />
            <span>
              {stats.downloads.toLocaleString()} download
              {stats.downloads !== 1 ? "s" : ""}
            </span>
          </span>
        </div>
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="sm"
            onClick={onSaveClick}
            tooltip="Save as version"
          >
            <Icon icon={faFloppyDisk} className="h-3 w-3 lg:h-4 lg:w-4" />
            <span>Save Version</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="sm"
            onClick={() => navigate("/")}
            tooltip="Back to home"
          >
            <Icon icon={faHouse} className="h-3 w-3 lg:h-4 lg:w-4" />
            <span>Home</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
