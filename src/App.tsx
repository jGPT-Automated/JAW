import { lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RealtimeProvider } from "@/hub/data/realtime";
import { AuthGate } from "@/hub/layout/AuthGate";
import { HubLayout } from "@/hub/layout/HubLayout";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";

const Activity = lazy(() => import("./pages/Activity"));
const Agents = lazy(() => import("./pages/Agents"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Memory = lazy(() => import("./pages/Memory"));
const Skills = lazy(() => import("./pages/Skills"));
const Voice = lazy(() => import("./pages/Voice"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const Protocol = lazy(() => import("./pages/Protocol"));
const Roadmap = lazy(() => import("./pages/Roadmap"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false } },
});

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <AuthGate>
                    <HubLayout />
                  </AuthGate>
                }
              >
                <Route path="/" element={<Overview />} />
                <Route path="/voice" element={<Voice />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/memory" element={<Memory />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/protocol" element={<Protocol />} />
                <Route path="/manifesto" element={<Manifesto />} />
                {/* Old entry points of the Command Center now land on the hub. */}
                <Route path="/command" element={<Navigate to="/" replace />} />
                <Route path="/gate" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </RealtimeProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
