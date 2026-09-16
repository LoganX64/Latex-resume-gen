import { useNavigate } from "react-router-dom";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@/components/Icon";
import { faFloppyDisk, faHouse, faEye, faDownload } from "@/lib/icons";

interface NavFooterProps {
  stats: { visits: number; downloads: number };
  onSaveClick?: () => void;
}

export function NavFooter({ stats, onSaveClick }: NavFooterProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();

  return (
    <SidebarFooter className="gap-2 border-t border-sidebar-border/70 bg-sidebar/80 p-3">
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
            <Icon
              icon={faDownload}
              className="h-4 w-4 text-sidebar-foreground/60"
            />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-md bg-sidebar-accent/50 px-2.5 py-2 text-[11px] text-sidebar-foreground/55">
          <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
            <Icon icon={faEye} className="h-3.5 w-3.5" />
            <span>
              {stats.visits.toLocaleString()} visit
              {stats.visits !== 1 ? "s" : ""}
            </span>
          </span>
          <span className="h-3 w-px bg-sidebar-border" />
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
            className="h-9"
          >
            <Icon icon={faFloppyDisk} className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="font-medium">Save Version</span>
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
