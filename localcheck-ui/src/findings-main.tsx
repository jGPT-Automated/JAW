import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { FindingsApp } from "./FindingsApp.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <FindingsApp />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
