import { Outlet } from 'react-router';

import { AppSidebar } from '@/components/app/sidebar/app-sidebar';
import { SiteHeader } from '@/components/app/sidebar/site-header';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export  function Layout() {
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
