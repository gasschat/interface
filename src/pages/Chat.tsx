import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserInput } from "@/components/app/userInput";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect} from "react";
import { useLocation } from "react-router";

interface Msg {
  role: "assistant" | "user";
  content: {
    haveCode?: boolean;
    content: string;
  };
}

// Message component for chat
const Message = ({ role, content}: Msg ) => {
  return (
    <div className={`px-4 py-3`}>
      <div className="max-w-lg mx-auto flex gap-4">
        <div
          className={`h-6 w-6 rounded-[13px] flex items-center justify-center shrink-0 ${
            role === "user"
              ? "bg-gray-200"
              : "bg-gradient-to-br from-pink-400 to-yellow-400"
          }`}
        >
          {role === "user" ? "U" : "A"}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-md font-light">{content.content}</p>
        </div>
      </div>
    </div>
  );
};

// Main content component
const PageContent = () => {
  const messages: Msg[] = [
    {
      role: "assistant",
      content: {
        content: "Hi there! I'm a chat assistant that can help you with your questions. How can I help you today?",
      }
    },
    {
      role: "user",
      content: {
        content: "I need help creating a page with a sidebar and content component using shadcn/ui.",
      }
    },
    {
      role: "assistant",
      content: {
        haveCode: true,
        content: "I'll create a page with a sidebar and content component using shadcn/ui. I'll structure it with a separate sidebar component that we'll import into the main page."
      },
    }
  ];


  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-[26rem] w-full">
        {messages.map((message, index) => (
          <Message 
            key={index} 
            role={message.role} 
            content={message.content} 
          />
        ))}

        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="py-2 px-3">
        <div className="w-full max-w-xl place-self-center">
          <UserInput />
        </div>
      </div>
    </div>
  );
};

// Main layout component
export const Chat = () => {
  const { setOpen } = useSidebar();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log("----CHAT------", location.state?.chat)

  useEffect(() => {
    setOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);


  return (
    <div className="flex items-stretch h-[calc(100vh-76px)]">
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 max-w-full`}>
        <PageContent />
      </div>
    </div>
  );
};