import { SidebarTrigger } from "@/components/ui/sidebar";

import { NavbarUser } from "./navbar-user";
import { useSession } from "@/lib/auth-client";


export function SiteHeader() {
  const { data: session } = useSession();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 py-1 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="ml-auto flex items-center gap-2">
          {session?.user && (
            <NavbarUser user={{
              name: session.user.name,
              email: session.user.email,
              avatar: session.user.image || "",
            }} />
          )}
        </div>
      </div>
    </header>
  );
}
