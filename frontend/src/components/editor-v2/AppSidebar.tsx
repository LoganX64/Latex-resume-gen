import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStatsStore } from "@/stores/stats-store";
import { recordVisit } from "@/utils/stats";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "@/components/PanelLeftIcon";
import { NavSections } from "@/components/editor-v2/NavSections";
import { NavFooter } from "@/components/editor-v2/NavFooter";

interface AppSidebarProps {
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  onSaveClick?: () => void;
}

export function AppSidebar({
  activeSection,
  onSectionClick,
  onSaveClick,
}: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const stats = useStatsStore();
  const refresh = useStatsStore((s) => s.refresh);

  useEffect(() => {
    recordVisit().then(() => refresh());
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader
        className={`h-14 flex ${state === "collapsed" ? "items-center" : "items-start"} justify-center border-b border-sidebar-border/70 p-0 gap-0`}
      >
        {state === "collapsed" ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={toggleSidebar}
                  className="group/logo relative flex items-center justify-center rounded-md"
                  aria-label="Open sidebar"
                >
                  <img
                    src="/logo.svg"
                    alt="Logo"
                    className="h-9 w-9 shrink-0 rounded-md group-hover/logo:invisible"
                  />
                  <PanelLeftIcon className="absolute h-5 w-5 text-rose-500 invisible group-hover/logo:visible" />
                </button>
              }
            />
            <TooltipContent side="right">Open sidebar</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between w-full h-full px-3">
            <Link
              to="/"
              className="rounded-md hover:bg-sidebar-accent transition-colors px-1.5 py-1"
            >
              <img
                src="/cvstack-logo-light.svg"
                alt="CVStack Logo"
                className="h-7 w-auto shrink-0 dark:hidden"
              />
              <img
                src="/cvstack-logo-dark.svg"
                alt="CVStack Logo"
                className="hidden h-7 w-auto shrink-0 dark:block"
              />
            </Link>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                  />
                }
              >
                <PanelLeftIcon className="h-4 w-4 text-rose-500" />
              </TooltipTrigger>
              <TooltipContent>Close sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="py-4 overflow-y-auto group-data-[collapsible=icon]:overflow-y-auto!">
        <NavSections
          activeSection={activeSection}
          onSectionClick={onSectionClick}
        />
      </SidebarContent>
      <NavFooter stats={stats} onSaveClick={onSaveClick} />
      <SidebarRail />
    </Sidebar>
  );
}
