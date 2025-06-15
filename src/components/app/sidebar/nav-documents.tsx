import { useState} from "react"
import {
  IconDots,
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

import { DeleteThread } from "../delete-thread"

import useSWR from "swr"

import { Link, useLocation } from "react-router"
import { api } from "@/lib/baseUrl"

import { threads } from "@/lib/fetch"
import type { ThreadOverview } from "@/lib/types"
import { ShareThreadBtn } from "../share-thread"

export function NavDocuments() {
  const [openDeleteThreadWindow, setOpenDeleteThreadWindow] = useState(false)
  const [selectedThread, setSelectedThread ]= useState<ThreadOverview|null>(null)
  const {data, isLoading} = useSWR<ThreadOverview[]>(`${api}/ai/threads`, threads)
  const location = useLocation()

  const { isMobile } = useSidebar()

  const handleOpenWindow = (state:boolean, thread?:ThreadOverview) => {
    if(state===true){
      if(!thread) return;
      setSelectedThread(thread)
      setOpenDeleteThreadWindow(true)
      return;
    }
    setSelectedThread(null)

  }


  if(isLoading) return <div className="block w-7 h-6 rounded-full border animate-spin"></div>

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="tracking-wider">Chats</SidebarGroupLabel>
      <SidebarMenu>
        {data?.map((thread) => (
          <SidebarMenuItem key={thread.id} className="space-y-2">
            <SidebarMenuButton asChild className={`${location.pathname.split("/")[2]===thread.id&&'bg-accent'}`}>
              <Link to={`c/${thread.id}`}>
                <span>{thread.title}</span>
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
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                >
                  <ShareThreadBtn threadId={thread.id}/>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                variant="destructive"
                onClick={()=>handleOpenWindow(true, thread)}
                >
                  <IconTrash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        
      </SidebarMenu>

      {openDeleteThreadWindow&&selectedThread&&(
        <DeleteThread openWindow={openDeleteThreadWindow} handleOpenWindow={handleOpenWindow} thread={selectedThread}/>
      )}
    </SidebarGroup>
  )
}
