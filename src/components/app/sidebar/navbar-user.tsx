import {
    IconCreditCard,
    IconLogout,
    IconNotification,
    IconUserCircle,
  } from "@tabler/icons-react"
  
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  import {
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"

  import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
  } from "@/components/ui/menubar"
  
  import { signOut } from "@/lib/auth-client";
  import { useNavigate, useLocation } from "react-router";

  import { ShareThreadBtn } from "../share-thread";
  
  export function NavbarUser({
    user,
  }: {
    user: {
      name: string
      email: string
      avatar: string
    }
  }) {
    const navigate = useNavigate();
    const location = useLocation()
    const currentLocation = location.pathname.split("/")
    const isChatPage = currentLocation.length===3

    const handleLogout = async () => {
      await signOut({
        onSuccess: () => navigate("/login"),
        onError: () => navigate("/login"),
      });
    };
    return (
      <Menubar className="border-0 bg-transparent p-0">
        <MenubarMenu>
          {isChatPage&&(
            <ShareThreadBtn threadId={currentLocation[2]}/>
          )}
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger asChild className="rounded-full bg-transparent">
            <button
            type="button"
              className="data-[state=open]:bg-transparent data-[state=open]:text-gray-100 flex h-8 w-fit items-center gap-2 text-left"
            >
              <Avatar className="h-7 w-7 rounded-[13px] ">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">HM</AvatarFallback>
              </Avatar>
            </button>
          </MenubarTrigger>
          <MenubarContent
            className="min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <div className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-[14px]">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-[13px]">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  {/* <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span> */}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <MenubarItem className="flex items-center gap-2">
              <IconUserCircle className="size-4" />
              Account
            </MenubarItem>
            <MenubarItem className="flex items-center gap-2">
              <IconCreditCard className="size-4" />
              Billing
            </MenubarItem>
            <MenubarItem className="flex items-center gap-2">
              <IconNotification className="size-4" />
              Notifications
            </MenubarItem>
            <DropdownMenuSeparator />
            <MenubarItem onClick={handleLogout} className="flex items-center gap-2" variant="destructive">
              <IconLogout className="size-4" />
              Log out
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
  }