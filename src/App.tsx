import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfettiProvider } from "@/contexts/ConfettiContext";
import { LanguageProvider } from "@/i18n";
import Index from "./pages/Index";
import GlobalSchools from "./pages/GlobalSchools";
import InstitutionDetail from "./pages/InstitutionDetail";
import SocialFeed from "./pages/SocialFeed";
import VideoLibrary from "./pages/VideoLibrary";
import VideoDetail from "./pages/VideoDetail";
import LiveClasses from "./pages/LiveClasses";
import Library from "./pages/Library";
import LibraryDetail from "./pages/LibraryDetail";
import Whitepaper from "./pages/Whitepaper";
import Profile from "./pages/Profile";
import LightLaw from "./pages/LightLaw";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfettiProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/global-schools" element={<GlobalSchools />} />
              <Route path="/institution/:id" element={<InstitutionDetail />} />
              <Route path="/light-law" element={<LightLaw />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/social-feed" element={<SocialFeed />} />
              <Route path="/video-library" element={<VideoLibrary />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/live-classes" element={<LiveClasses />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:id" element={<LibraryDetail />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ConfettiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
