import { lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGate } from "@/hub/layout/AuthGate";
import { HubLayout } from "@/hub/layout/HubLayout";
import NotFound from "./pages/NotFound";
import Voice from "./pages/Voice";

const Conversations = lazy(() => import("./pages/Conversations"));
const GitHubAccount = lazy(() => import("./pages/GitHubAccount"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const Protocol = lazy(() => import("./pages/Protocol"));
const Resources = lazy(() => import("./pages/Resources"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Projects = lazy(() => import("./pages/Projects"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Instructions = lazy(() => import("./pages/Instructions"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false, retry: 1 } },
});

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
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
              <Route path="/" element={<Voice />} />
              <Route path="/conversations/:id?" element={<Conversations />} />
              <Route path="/rooms/:agentId?" element={<Rooms />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/projects/:id?" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/github" element={<Navigate to="/github/GenJess" replace />} />
              <Route path="/github/:login" element={<GitHubAccount />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/protocol" element={<Protocol />} />
              <Route path="/manifesto" element={<Manifesto />} />
              {/* Earlier entry points. */}
              <Route path="/voice" element={<Navigate to="/" replace />} />
              <Route path="/inbox" element={<Navigate to="/conversations" replace />} />
              <Route path="/skills" element={<Navigate to="/resources" replace />} />
              <Route path="/command" element={<Navigate to="/" replace />} />
              <Route path="/gate" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
