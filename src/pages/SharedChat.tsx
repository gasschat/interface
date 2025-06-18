import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { IconGitBranch, IconArrowElbowRight, IconBrandGoogleFilled, IconLoader} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/app/ChatMessage";
import useSWR from "swr";

import { forkChat, getSharedChat } from "@/lib/fetch";
import { api } from "@/lib/baseUrl";
import { Loader } from "@/components/app/Loader";
import { useSession } from "@/lib/auth-client";
import { signIn } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import useSWRMutation from "swr/mutation";



const LoginDialog = ({ open, onOpenChange }: {open:boolean, onOpenChange:(state:boolean)=>void}) => {
    const threadId = useLocation().pathname.split("/")[2]

    const handleGoogleLogin = async () => {
    await signIn.social(
      { provider: "google", callbackURL:`/share/${threadId}` },
      {
        onError: (error) => {
          console.log(error)
          alert("Login failed")
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={()=>onOpenChange(!open)}>
      <DialogContent className="max-w-2xl p-0">
        <div className="grid grid-cols-2">
          {/* Image Side */}
          <div className="block">
            <img
              src="https://pbs.twimg.com/media/GtcQ-_KasAAUBFX?format=jpg&name=4096x4096"
              alt="Login Visual"
              className="h-full w-full object-cover rounded-l-2xl"
            />
          </div>

          {/* Login Side */}
          <div className="flex flex-col justify-center items-center p-6 space-y-4">
            <DialogHeader className="text-center">
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>Login with Google to fork this chat.</DialogDescription>
            </DialogHeader>

            <Button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleGoogleLogin}
            variant="outline" className="flex items-center gap-2">
              <IconBrandGoogleFilled className="w-4 h-4" />
              Login with Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


const ProfileMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-7 h-7 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>Dashboard <IconArrowElbowRight/></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SharedChat = () => {
  const { chatId } = useParams();
  const { data } = useSession();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: sharedChat, isLoading, error } = useSWR(
    `${api}/ai/shared/${chatId}`,
    getSharedChat
  );
  const {data:forkedChatId, trigger:forkTheChat, isMutating} = useSWRMutation(`${api}/ai/fork/${chatId}`, forkChat)

  useEffect(()=>{
    if(!forkedChatId) return 
    void navigate(`/c/${forkedChatId}`)

  },[forkedChatId, navigate])

  const handleDialogState = (state:boolean) => {
    setDialogOpen(state)
  }

  const handleForkSubmi = async() => {
    if(!data?.user) {
        setDialogOpen(true)
        return;
    }
    await forkTheChat()
  }

  if (!chatId) return <div>No Shared Chat</div>;
  if (isLoading) return <Loader />;

  if(error && !dialogOpen) return (
    <div className="space-y-52">
        <nav className="py-2 px-4 md:px-7 border-b flex flex-row justify-between items-center w-full bg-base-900 border-base-950 z-50">
        <span className="">tabs</span>
        </nav>
        <h2 className="text-5xl text-center px-5 md:px-0">404 Not found</h2>
    </div>
  )

  return (
    <div className="flex flex-col w-sceen items-center bg-base-900">
      <nav className="py-1.5 px-4 md:px-7 border-b flex flex-row justify-between items-center fixed w-full bg-base-900 border-base-950 z-50">
        <span className="text-xs">tabs</span>
        <div className="flex flex-row items-center gap-3 md:gap-0">
          <Button
            variant="outline"
            size="sm"
            className="md:mx-5"
            onClick={()=>void handleForkSubmi()}
            disabled={isMutating}
          >
            {!isMutating?(<IconGitBranch />):(<IconLoader className="animate-spin"/>)}
            Fork
          </Button>
          {data?.user&&(
          <ProfileMenu />
          )}
        </div>
      </nav>

      <div className="mt-16 overflow-x-auto w-full ">
        {sharedChat?.map((chat) => (
          <ChatMessage id={chat.id} key={chat.id} message={chat} />
        ))}
      </div>

      {/* Login Dialog */}
      <LoginDialog open={dialogOpen} onOpenChange={handleDialogState} />
    </div>
  );
};

export default SharedChat;
