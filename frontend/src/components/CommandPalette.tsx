"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Download,
  FileText,
  Moon,
  Sun,
  RotateCcw,
  LayoutTemplate,
} from "lucide-react"

interface CommandPaletteProps {
  onExportLatex: () => void
  onExportPdf: () => void
  onToggleDarkMode: () => void
  onResetResume: () => void
  onTemplateChange: (id: string) => void
  templateOptions: { id: string; name: string }[]
  isDarkMode: boolean
}

export function CommandPalette({
  onExportLatex,
  onExportPdf,
  onToggleDarkMode,
  onResetResume,
  onTemplateChange,
  templateOptions,
  isDarkMode,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runAction = useCallback((action: () => void) => {
    setOpen(false)
    setTimeout(() => action(), 0)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Export">
            <CommandItem onSelect={() => runAction(onExportPdf)}>
              <Download className="mr-2 h-4 w-4" />
              <span>Export PDF</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runAction(onExportLatex)}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Export LaTeX</span>
              <CommandShortcut>⌘L</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Templates">
            {templateOptions.map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => runAction(() => onTemplateChange(t.id))}
              >
                <LayoutTemplate className="mr-2 h-4 w-4" />
                <span>{t.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runAction(onToggleDarkMode)}>
              {isDarkMode ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>Toggle {isDarkMode ? "Light" : "Dark"} Mode</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runAction(onResetResume)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Reset Resume</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
