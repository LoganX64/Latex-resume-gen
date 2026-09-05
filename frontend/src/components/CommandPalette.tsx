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
import { Icon } from "@/components/Icon"
import { faTableColumns, faArrowDown, faFileLines, faMoon, faSun, faRotateLeft } from "@/lib/icons"

interface CommandPaletteProps {
  onExportLatex: () => void
  onExportPdf: () => void
  onToggleDarkMode: () => void
  onResetResume: () => void
  onClearResume: () => void
  onTemplateChange: (id: string) => void
  templateOptions: { id: string; name: string }[]
  isDarkMode: boolean
}

export function CommandPalette({
  onExportLatex,
  onExportPdf,
  onToggleDarkMode,
  onResetResume,
  onClearResume,
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
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Export">
            <CommandItem onSelect={() => runAction(onExportPdf)}>
              <Icon icon={faArrowDown} className="mr-2 h-4 w-4" />
              <span>Export PDF</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runAction(onExportLatex)}>
              <Icon icon={faFileLines} className="mr-2 h-4 w-4" />
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
                <Icon icon={faTableColumns} className="mr-2 h-4 w-4" />
                <span>{t.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runAction(onToggleDarkMode)}>
              {isDarkMode ? (
                <Icon icon={faSun} className="mr-2 h-4 w-4" />
              ) : (
                <Icon icon={faMoon} className="mr-2 h-4 w-4" />
              )}
              <span>Toggle {isDarkMode ? "Light" : "Dark"} Mode</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runAction(onResetResume)}>
              <Icon icon={faRotateLeft} className="mr-2 h-4 w-4" />
              <span>Load Sample Data</span>
            </CommandItem>
            <CommandItem onSelect={() => runAction(onClearResume)}>
              <Icon icon={faRotateLeft} className="mr-2 h-4 w-4" />
              <span>Clear Resume</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
