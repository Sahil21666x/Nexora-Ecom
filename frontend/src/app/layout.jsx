import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center">
        {/* Sidebar trigger (optional button) */}
        <div className="self-start mb-4">
          <SidebarTrigger />
        </div>

        {/* Page content (like Cart) */}
        <div className="w-full max-w-7xl">{children}</div>
      </main>
    </SidebarProvider>
  );
}
