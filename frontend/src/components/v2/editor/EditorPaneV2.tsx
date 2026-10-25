import { EditorHeaderV2 } from "@/components/v2/editor/EditorHeaderV2";
import { EditorPanelV2 } from "@/components/v2/editor/EditorPanelV2";
import { StorageCardV2 } from "@/components/v2/editor/StorageCardV2";

interface EditorPaneV2Props {
  activeSection: string;
  isExportingPdf: boolean;
  shortcutsOpen: boolean;
  onShortcutsOpenChange: (open: boolean) => void;
  onSaveClick: () => void;
  onClearResume: () => void;
  onLoadSample: () => void;
  onExportPdf: () => void;
}

export function EditorPaneV2({
  activeSection,
  isExportingPdf,
  shortcutsOpen,
  onShortcutsOpenChange,
  onSaveClick,
  onClearResume,
  onLoadSample,
  onExportPdf,
}: EditorPaneV2Props) {
  return (
    <section className="relative flex h-full min-h-0 min-w-0 flex-col">
      <EditorHeaderV2
        isExportingPdf={isExportingPdf}
        shortcutsOpen={shortcutsOpen}
        onShortcutsOpenChange={onShortcutsOpenChange}
        onSaveClick={onSaveClick}
        onClearResume={onClearResume}
        onLoadSample={onLoadSample}
        onExportPdf={onExportPdf}
      />
      <div className="relative min-h-0 flex-1">
        <EditorPanelV2 activeSection={activeSection} />
        <StorageCardV2 />
      </div>
    </section>
  );
}
