import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function parseMonthValue(value?: string): Date | undefined {
  if (!value) return undefined
  const [year, month] = value.split('-').map(Number)
  if (isNaN(year) || isNaN(month)) return undefined
  return new Date(year, month - 1, 1)
}

function formatMonthValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatDisplay(value?: string): string {
  if (!value) return ''
  const date = parseMonthValue(value)
  if (!date) return value
  return date.toLocaleDateString('default', { month: 'short', year: 'numeric' })
}

interface MonthPickerProps {
  value?: string
  onValueChange: (value: string) => void
  className?: string
  disabled?: boolean
  id?: string
  'aria-label'?: string
}

export function MonthPicker({
  value,
  onValueChange,
  className,
  disabled,
  id,
  'aria-label': ariaLabel,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseMonthValue(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        id={id}
        aria-label={ariaLabel}
        className={`flex h-7 w-full items-center gap-1 rounded-md border border-input bg-background px-2 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
      >
        <span className="flex-1 text-left truncate">
          {selectedDate ? formatDisplay(value) : 'Pick a month'}
        </span>
        <CalendarIcon className="size-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onValueChange(formatMonthValue(date))
              setOpen(false)
            }
          }}
          captionLayout="dropdown"
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
