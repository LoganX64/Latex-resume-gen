import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditorSidebarV2 } from "@/components/v2/editor/EditorSidebarV2";

export default function EditorV2Layout() {
  return (
    <TooltipProvider delay={400}>
      <SidebarProvider>
        <EditorSidebarV2 />
        <SidebarInset className="h-svh overflow-hidden bg-background" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
