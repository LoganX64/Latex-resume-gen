import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@/components/Icon";
import { faChevronLeft, faChevronRight } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { NavSectionsV2 } from "@/components/v2/editor/NavSectionsV2";
import { EditorSidebarFooterV2 } from "@/components/v2/editor/EditorSidebarFooterV2";
import "@/components/v2/editor/editor-sidebar-v2.css";

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
  const isCollapsed = state === "collapsed";

  return (
    <>
      <Sidebar
        collapsible="icon"
        variant="floating"
        className="editor-sidebar-v2"
      >
        <SidebarHeader className="h-14 flex items-center justify-center p-0 gap-0">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    to="/v2"
                    className="flex items-center justify-center rounded-md"
                    aria-label="CVStack home"
                  >
                    <img
                      src="/logo.svg"
                      alt="CVStack"
                      className="h-9 w-9 shrink-0 rounded-md"
                    />
                  </Link>
                }
              />
              <TooltipContent side="right">CVStack</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center w-full h-full px-3">
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
      </Sidebar>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
              className={cn(
                "fixed z-30 hidden size-6 items-center justify-center rounded-full border border-border/40 bg-background text-foreground transition-[left,top,background-color,color] duration-300 ease-in-out hover:bg-muted md:flex",
                isCollapsed
                  ? "top-[46px] left-[calc(var(--sidebar-width-icon)-2px)]"
                  : "top-[54px] left-[calc(var(--sidebar-width)-20px)]"
              )}
            >
              <Icon
                icon={isCollapsed ? faChevronRight : faChevronLeft}
                style={{ width: 8, height: 8 }}
              />
            </button>
          }
        />
        <TooltipContent side="right">
          {isCollapsed ? "Open sidebar" : "Close sidebar"}
        </TooltipContent>
      </Tooltip>
    </>
  );
}
