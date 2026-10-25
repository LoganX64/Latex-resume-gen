import { Link } from "react-router-dom";
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
import { NavSectionsV2 } from "@/components/v2/editor/NavSectionsV2";
import { EditorSidebarFooterV2 } from "@/components/v2/editor/EditorSidebarFooterV2";

interface EditorSidebarV2Props {
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  onSaveClick?: () => void;
}

export function EditorSidebarV2({
  activeSection,
  onSectionClick,
  onSaveClick,
}: EditorSidebarV2Props) {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader
        className={`h-14 flex ${state === "collapsed" ? "items-center" : "items-start"} justify-center p-0 gap-0`}
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
                    alt="CVStack"
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
              to="/v2"
              className="flex items-center gap-1 rounded-md hover:bg-sidebar-accent transition-colors px-1.5 py-1"
            >
              <img
                src="/logo.svg"
                alt=""
                className="h-7 w-7 shrink-0 object-contain"
              />
              <span className="text-lg font-bold italic tracking-tight">
                <span className="text-primary">CV</span>
                <span className="text-foreground">Stack</span>
              </span>
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
      <SidebarContent className="overflow-y-auto group-data-[collapsible=icon]:overflow-y-auto!">
        <NavSectionsV2
          activeSection={activeSection}
          onSectionClick={onSectionClick}
        />
      </SidebarContent>
      <EditorSidebarFooterV2 onSaveClick={onSaveClick} />
      <SidebarRail />
    </Sidebar>
  );
}
