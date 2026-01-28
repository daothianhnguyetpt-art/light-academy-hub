import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { FloatingActionButton } from "./FloatingActionButton";
import { CreatePostDialog } from "./CreatePostDialog";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Pages that don't need bottom padding for navigation
  const noPaddingPaths = ["/", "/auth", "/admin", "/light-law"];
  const needsBottomPadding = !noPaddingPaths.some(path => location.pathname === path);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content with conditional bottom padding for mobile nav */}
      <main className={needsBottomPadding ? "pb-20 lg:pb-0" : ""}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button for Social Feed */}
      <FloatingActionButton onClick={() => setIsCreatePostOpen(true)} />

      {/* Create Post Dialog */}
      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen} 
      />
    </div>
  );
}
