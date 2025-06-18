import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader as Loader, XIcon } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";

import { useCompletion } from "@ai-sdk/react";
import { api } from "@/lib/baseUrl";

const APIKeysDialog = ({
  openWindow,
  windowState,
}: {
  openWindow: boolean;
  windowState: (state: boolean) => void;
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [localORKey, setLocalORKey] = useState<string|null>(null)
  const { input, handleInputChange, handleSubmit, isLoading, error,setInput } =
    useCompletion({
      streamProtocol: "text",
      api: `${api}/ai/verify-key`,
      credentials: "include",
      onFinish: ()=>{
        setIsVerified(true)
      },
    });

    const saveAPIKey = () => {
        if(!isVerified) {
            alert("Please verify your API key first")
            return;
        }
        localStorage.setItem('openrouter-key', JSON.stringify(input))
        setLocalORKey(input)
        setInput("")
    }

    const getKey = ()=> {
        const hasKey = localStorage.getItem("openrouter-key")
        if(hasKey){
            const orKey = JSON.parse(hasKey) as string
            setLocalORKey(orKey)
        }
    }

    useEffect(()=>{
        getKey()
    },[])

  return (
    <Dialog open={openWindow}>
      <DialogContent className="sm:max-w-md" tabIndex={-1}>
        <button
          type="button"
          onClick={() => windowState(false)}
          className="cursor-pointer w-fit absolute right-0 m-4"
        >
          <XIcon />
        </button>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-normal">
            Enter Your API Keys
          </DialogTitle>
          <DialogDescription>
            We never keep your API keys in our database. Instead, they are kept
            locally on your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-3">
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center mr-3">
              <img src="/openrouter.jpeg" className="rounded-[16px]" />
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-sm">Open Router</span>
              <a href="#" className="text-xs text-blue-400">
                ( Get your key here )
              </a>
            </div>
          </div>
          <form
          onSubmit={handleSubmit}
           className="flex gap-3">
            <Input 
            onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                handleInputChange(e)
                if(isVerified){
                    setIsVerified(false)
                }
            }}
            value={input}
            disabled={isLoading}
            autoFocus={false}
            autoComplete="off" 
            required
            />
            <Button 
            type="submit"
            disabled={!input}
            className="">
                {isLoading&&<Loader className="animate-spin"/>} Verify
            </Button>
          </form>
        </div>

        <DialogFooter>
          <div className="w-full flex flex-col gap-3">
            <Button
              type="button"
              variant={error!==undefined?"destructive":"secondary"}
              className="px-8 mt-5 opacity-75 disabled:bg-transparent disabled:border disabled:text-foreground disabled:opacity-80"
              disabled={!isVerified || error!==undefined || !input}
              onClick={saveAPIKey}
            >
            {error!==undefined?"Invalid API Key":"Save"}
            </Button>
            {localORKey&&(
                <span className="text-xs text-base-400 font-semibold">
              Saved: <span className="tracking-tighter font-light">{localORKey}</span>
            </span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ApiKeysDialogBtn = () => {
  const [openDialogWondow, setOpenDialogWindow] = useState(false);

  const handleDialogWindowState = (state: boolean) => {
    setOpenDialogWindow(state);
  };

  return (
    <>
      <Button
        onClick={() => handleDialogWindowState(true)}
        variant="outline"
        className="rounded-2xl"
      >
        API Key
      </Button>
      <APIKeysDialog
        openWindow={openDialogWondow}
        windowState={handleDialogWindowState}
      />
    </>
  );
};
