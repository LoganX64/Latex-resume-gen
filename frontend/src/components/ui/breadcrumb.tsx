import * as React from "react"
import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.15845 3.15845C6.24435 3.07255 6.36038 3.02454 6.48065 3.02454C6.60091 3.02454 6.71695 3.07255 6.80285 3.15845L10.8028 7.15845C10.8887 7.24435 10.9368 7.36038 10.9368 7.48065C10.9368 7.60091 10.8887 7.71695 10.8028 7.80285L6.80285 11.8028C6.71695 11.8887 6.60091 11.9368 6.48065 11.9368C6.36038 11.9368 6.24435 11.8887 6.15845 11.8028C6.07255 11.7169 6.02454 11.6009 6.02454 11.4806C6.02454 11.3604 6.07255 11.2443 6.15845 11.1584L9.71685 7.48065L6.15845 3.80285C6.07255 3.71695 6.02454 3.60091 6.02454 3.48065C6.02454 3.36038 6.07255 3.24435 6.15845 3.15845Z" fill="currentColor" />
        </svg>
      )}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
        <path d="M3.625 7.5C3.625 8.19036 3.06536 8.75 2.375 8.75C1.68464 8.75 1.125 8.19036 1.125 7.5C1.125 6.80964 1.68464 6.25 2.375 6.25C3.06536 6.25 3.625 6.80964 3.625 7.5ZM9.375 7.5C9.375 8.19036 8.81536 8.75 8.125 8.75C7.43464 8.75 6.875 8.19036 6.875 7.5C6.875 6.80964 7.43464 6.25 8.125 6.25C8.81536 6.25 9.375 6.80964 9.375 7.5ZM15 7.5C15 8.19036 14.4404 8.75 13.75 8.75C13.0596 8.75 12.5 8.19036 12.5 7.5C12.5 6.80964 13.0596 6.25 13.75 6.25C14.4404 6.25 15 6.80964 15 7.5Z" fill="currentColor" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
