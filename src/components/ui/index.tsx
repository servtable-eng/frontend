import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export type ButtonSize = "default" | "sm" | "md" | "lg" | "icon"
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const buttonStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground border border-primary-border",
  primary: "bg-primary text-primary-foreground border border-primary-border",
  secondary: "border bg-secondary text-secondary-foreground border-secondary-border",
  destructive: "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
  outline: "border [border-color:var(--button-outline)] shadow-xs active:shadow-none",
  ghost: "border border-transparent",
  link: "text-primary underline-offset-4 hover:underline",
}

const buttonSizes: Record<ButtonSize, string> = {
  default: "min-h-9 px-4 py-2",
  sm: "min-h-8 rounded-md px-3 text-xs",
  md: "min-h-9 px-4 py-2",
  lg: "min-h-10 rounded-md px-8",
  icon: "h-9 w-9",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonStyles[variant], buttonSizes[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  error?: string
}

function Input({ className, error, ...props }: InputProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <input
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  )
}

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  error?: string
}

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  )
}

type Option = { value: string; label: string }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
  error?: string
}

function Select({ className, options, error, ...props }: SelectProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  )
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  dot?: boolean
  size?: "sm" | "md" | "lg"
}

function Badge({ className, variant = "default", dot, size = "md", ...props }: BadgeProps) {
  const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-primary text-primary-foreground border border-primary-border",
    secondary: "bg-secondary text-secondary-foreground border border-secondary-border",
    destructive: "bg-destructive text-destructive-foreground border border-destructive-border",
    outline: "border [border-color:var(--badge-outline)] text-foreground",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-slate-900",
  }
  const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-semibold",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-2.5 w-2.5 rounded-full bg-current" />}
      {props.children}
    </div>
  )
}

const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <div className={cn("relative", className)}>
    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <input
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
))
SearchInput.displayName = "SearchInput"

export { Button, Input, Textarea, Badge, SearchInput, Select }
