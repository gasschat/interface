import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader as Loader, XIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { useCompletion } from "@ai-sdk/react";
import { api } from "@/lib/baseUrl";
import useSWR from "swr";
import { getModels } from "@/lib/fetch";
import type { AvailableModels } from "@/lib/types";

import { saveKeys, getApiKey } from "@/lib/utils";

import { LLMProviderIcons } from "@/lib/utils";


// input API KEY, llm is llm model
//llmname is the unique udentifier of the llm
const ApiInput = ({ llmTitle, llmName}: { llmTitle:string, llmName: string }) => {
  const [isVerified, setIsVerified] = useState(false);
  const { input, handleInputChange, handleSubmit, isLoading, error, setInput } =
    useCompletion({
      streamProtocol: "text",
      api: `${api}/ai/verify-key`,
      credentials: "include",
      body: {
        llm: llmName,
      },
      onFinish: () => {
        saveKeys(llmName, input)
        setIsVerified(true);
      },
    });

  useEffect(()=>{
    const isLLMKeyStored = getApiKey(llmName)
    if(isLLMKeyStored){
      setInput(isLLMKeyStored)
    }
  }, [llmName, setInput])

  return (
    <div>
      <div className="flex items-center py-2">
        <div className="h-7 w-7 flex items-center justify-center mr-3">
          <img src={LLMProviderIcons[llmName]} className="rounded-[16px]" />
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm">{llmTitle}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          onChange={handleInputChange}
          value={input}
          disabled={isLoading}
          autoFocus={false}
          autoComplete="off"
          minLength={10}
          required
          className={error && "border-destructive"}
        />
        <Button type="submit" disabled={isLoading || !input} className="">
          {isLoading && <Loader className="animate-spin" />}{" "}
          {isVerified ? "Saved!" : "Save"}
        </Button>
      </form>
    </div>
  );
};

const APIKeysDialog = ({
  openWindow,
  windowState,
}: {
  openWindow: boolean;
  windowState: (state: boolean) => void;
}) => {
  const { data: llms} = useSWR<AvailableModels[]>(`${api}/ai/models`, getModels)

  if(!llms) return <div>Loading....</div>

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

        <div className="space-y-5 mt-3">
          {llms.map((model) => (
            <ApiInput llmTitle={model.title} llmName={model.name} key={model.id} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ApiKeysDialogBtn = ({ children }: { children: ReactNode }) => {
  const [openDialogWondow, setOpenDialogWindow] = useState(false);

  const handleDialogWindowState = (state: boolean) => {
    setOpenDialogWindow(state);
  };

  return (
    <>
      <div role="button" onClick={() => handleDialogWindowState(true)}>
        {children}
      </div>
      <APIKeysDialog
        openWindow={openDialogWondow}
        windowState={handleDialogWindowState}
      />
    </>
  );
};
