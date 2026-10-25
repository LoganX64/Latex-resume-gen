import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@/components/Icon";
import { SunIcon } from "@/components/SunIcon";
import { MoonIcon } from "@/components/MoonIcon";
import { KeyboardShortcutsButton } from "@/components/KeyboardShortcutsButton";
import { useTheme } from "@/components/theme-provider";
import {
  faDownload,
  faFloppyDisk,
  faHouse,
  faMagnifyingGlass,
  faRotateLeft,
  faTrash,
} from "@/lib/icons";

interface EditorHeaderV2Props {
  isExportingPdf: boolean;
  shortcutsOpen: boolean;
  onShortcutsOpenChange: (open: boolean) => void;
  onSaveClick: () => void;
  onClearResume: () => void;
  onLoadSample: () => void;
  onExportPdf: () => void;
}

const iconClass = "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4";
const buttonClass = "sm:h-7 sm:w-7 lg:h-8 lg:w-8";

function openCommandPalette() {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "k", metaKey: true })
  );
}

export function EditorHeaderV2({
  isExportingPdf,
  shortcutsOpen,
  onShortcutsOpenChange,
  onSaveClick,
  onClearResume,
  onLoadSample,
  onExportPdf,
}: EditorHeaderV2Props) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
      <span className="text-xs font-semibold text-foreground sm:text-sm">
        Resume Editor
      </span>
      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={() => onExportPdf()}
                disabled={isExportingPdf}
                aria-label="Download PDF"
              />
            }
          >
            {isExportingPdf ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              <Icon icon={faDownload} className={iconClass} />
            )}
          </TooltipTrigger>
          <TooltipContent>Download PDF</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={onSaveClick}
                aria-label="Save as version"
              />
            }
          >
            <Icon icon={faFloppyDisk} className={iconClass} />
          </TooltipTrigger>
          <TooltipContent>Save as version</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={() => navigate("/")}
                aria-label="Back to home"
              />
            }
          >
            <Icon icon={faHouse} className={iconClass} />
          </TooltipTrigger>
          <TooltipContent>Home</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={onClearResume}
                aria-label="Clear resume"
              />
            }
          >
            <Icon icon={faTrash} className={`${iconClass} text-rose-500`} />
          </TooltipTrigger>
          <TooltipContent>Clear resume</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={onLoadSample}
                aria-label="Load sample data"
              />
            }
          >
            <Icon icon={faRotateLeft} className={iconClass} />
          </TooltipTrigger>
          <TooltipContent>Load sample data</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={toggleDarkMode}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              />
            }
          >
            {darkMode ? (
              <SunIcon className={iconClass} />
            ) : (
              <MoonIcon className={iconClass} />
            )}
          </TooltipTrigger>
          <TooltipContent>{darkMode ? "Light mode" : "Dark mode"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={buttonClass}
                onClick={openCommandPalette}
                aria-label="Command palette"
              />
            }
          >
            <Icon icon={faMagnifyingGlass} className={iconClass} />
          </TooltipTrigger>
          <TooltipContent>
            Command palette (
            {navigator.platform.toUpperCase().indexOf("MAC") >= 0
              ? "⌘K"
              : "Ctrl+K"}
            )
          </TooltipContent>
        </Tooltip>

        <KeyboardShortcutsButton
          open={shortcutsOpen}
          onOpenChange={onShortcutsOpenChange}
        />
      </div>
    </div>
  );
}
