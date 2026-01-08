import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfettiProvider } from "@/contexts/ConfettiContext";
import Index from "./pages/Index";
import SocialFeed from "./pages/SocialFeed";
import VideoLibrary from "./pages/VideoLibrary";
import LiveClasses from "./pages/LiveClasses";
import Library from "./pages/Library";
import Whitepaper from "./pages/Whitepaper";
import Profile from "./pages/Profile";
import LightLaw from "./pages/LightLaw";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ConfettiProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/light-law" element={<LightLaw />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/social-feed" element={<SocialFeed />} />
            <Route path="/video-library" element={<VideoLibrary />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/library" element={<Library />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfettiProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
