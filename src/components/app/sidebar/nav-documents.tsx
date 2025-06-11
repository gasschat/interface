import {
  IconDots,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import useSWR from "swr"

import { Link, useLocation } from "react-router"
import { api } from "@/lib/baseUrl"

import { threads } from "@/lib/fetch"
import type { ThreadOverview } from "@/lib/types"

export function NavDocuments() {
  const {data, isLoading} = useSWR<ThreadOverview[]>(`${api}/ai/threads`, threads)
  const location = useLocation()

  const { isMobile } = useSidebar()


  if(isLoading) return <div className="block w-7 h-6 rounded-full border animate-spin"></div>

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="tracking-wider">Chats</SidebarGroupLabel>
      <SidebarMenu>
        {data?.map((item) => (
          <SidebarMenuItem key={item.id} className="space-y-2">
            <SidebarMenuButton asChild className={`${location.pathname.split("/")[2]===item.id&&'bg-accent'}`}>
              <Link to={`c/${item.id}`}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <IconDots />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <IconShare3 />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconTrash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        
      </SidebarMenu>
    </SidebarGroup>
  )
}
