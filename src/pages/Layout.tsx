import { Outlet } from 'react-router';
import { AppSidebar } from '@/components/app/sidebar/app-sidebar';
import { SiteHeader } from '@/components/app/sidebar/site-header';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export  function Layout() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate("/login");
    }
  }, [isPending, session, navigate]);

  if (!session?.user) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <Loader className="animate-spin w-10 h-10 text-primary" />
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col ">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col ">
              <Outlet/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
