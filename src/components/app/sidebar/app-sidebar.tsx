import * as React from "react"
import {
  IconInnerShadowTop,
  IconCirclePlusFilled
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/app/sidebar/nav-documents"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


import { Link } from "react-router"

import { ApiKeysDialogBtn } from "../ApiKeyDialog"
import { Button } from "@/components/ui/button"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Tabs </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
            asChild
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link to="/" className="flex items-center gap-2.5"> <IconCirclePlusFilled/> New Chat</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain/> */}
        <NavDocuments />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <ApiKeysDialogBtn>
          <Button variant="outline" className="w-full">Api Key</Button>
        </ApiKeysDialogBtn>
      </SidebarFooter>
    </Sidebar>
  )
}
