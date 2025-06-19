import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { NavbarUser } from "./navbar-user";
import { useSession } from "@/lib/auth-client";

import { Link } from "react-router";

export function SiteHeader() {
  const { data: session } = useSession();
  const { state } = useSidebar();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 py-1 lg:gap-2 lg:px-6">
        <div className="flex flex-row items-center gap-3">
          <SidebarTrigger className="" />
          {state=="collapsed"&&(
            <Link to="/">
            <Plus className="p-0.5" size="25"/>
          </Link>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {session?.user && (
            <NavbarUser
              user={{
                name: session.user.name,
                email: session.user.email,
                avatar: session.user.image || "",
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
