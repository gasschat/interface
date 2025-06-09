import { IconCirclePlusFilled } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"

import { Link } from "react-router"

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
            asChild
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link to="/c/new" className="flex items-center gap-2.5"> <IconCirclePlusFilled/> New Chat</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>


      </SidebarGroupContent>
    </SidebarGroup>
  )
}
