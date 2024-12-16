'use client'

import React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, HTMLButtonElement<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
