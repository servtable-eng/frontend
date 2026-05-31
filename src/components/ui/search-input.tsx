import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        ref={ref}
        className={cn("pl-10", className)}
        {...props}
      />
    </div>
  )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }
