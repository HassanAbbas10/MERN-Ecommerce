import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = "Select"

const SelectContent = ({ children, ...props }) => (
  <React.Fragment {...props}>
    {children}
  </React.Fragment>
)

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <option
    ref={ref}
    value={value}
    className={cn("py-1.5 px-2", className)}
    {...props}
  >
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"

const SelectTrigger = Select
const SelectValue = ({ placeholder, ...props }) => (
  <option value="" disabled hidden {...props}>
    {placeholder}
  </option>
)

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
