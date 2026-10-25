import { useNavigate } from "react-router-dom";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { faFloppyDisk, faHouse } from "@/lib/icons";

interface EditorSidebarFooterV2Props {
  onSaveClick?: () => void;
}

export function EditorSidebarFooterV2({
  onSaveClick,
}: EditorSidebarFooterV2Props) {
  const { state } = useSidebar();
  const navigate = useNavigate();

  if (state === "collapsed") {
    return (
      <SidebarFooter className="gap-0 border-0 p-1">
        <Card size="sm" className="gap-0 rounded-lg p-0.5">
          <SidebarMenu className="items-center gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="sm"
                onClick={onSaveClick}
                tooltip="Save as version"
                className="justify-center"
              >
                <Icon icon={faFloppyDisk} className="h-3 w-3 lg:h-4 lg:w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="sm"
                onClick={() => navigate("/v2")}
                tooltip="Back to home"
                className="justify-center"
              >
                <Icon icon={faHouse} className="h-3 w-3 lg:h-4 lg:w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Card>
      </SidebarFooter>
    );
  }

  return (
    <SidebarFooter className="p-2">
      <Card size="sm" className="gap-0 rounded-lg p-1">
        <div className="flex items-center gap-1">
          <SidebarMenuButton
            size="sm"
            onClick={onSaveClick}
            tooltip="Save as version"
            className="h-8 flex-1 justify-center gap-1 px-1.5"
          >
            <Icon icon={faFloppyDisk} className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="font-medium">Save</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            size="sm"
            onClick={() => navigate("/v2")}
            tooltip="Back to home"
            className="h-8 flex-1 justify-center gap-1 px-1.5"
          >
            <Icon icon={faHouse} className="h-3 w-3 lg:h-4 lg:w-4" />
            <span>Home</span>
          </SidebarMenuButton>
        </div>
      </Card>
    </SidebarFooter>
  );
}
