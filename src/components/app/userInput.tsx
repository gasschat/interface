import { useState, KeyboardEvent, ChangeEvent, FormEvent } from "react";
import { Send, ChevronDown } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
// import { ModelSelect } from "./modelSelect";

// import { useUserProvider } from "@/context/user-provider";

// import { APIKeysDialog } from "./apiKeysDialog";
// import { LocalAIKeys } from "@/lib/types";

import { useNavigate } from "react-router";

const UserInput = () => {
  const [userInput, setUserInput] = useState<string>("");

  // const {selectedModel, openSelectedModelWindow, selectedModelWindowState, apiKeys, apiKeysWindowState, openAPIKeysWindow} = useUserProvider()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", userInput);
    await navigate("/c/new",{
      state: {chat: userInput},
    })
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // if(!selectedModel) {
      //   return selectedModelWindowState(true)
      // }
      // if(!apiKeys["anthropic"]&&!apiKeys["gemini"]&&!apiKeys["openai"]){
      //   return apiKeysWindowState(true)
      // }

      // if(!apiKeys[selectedModel.llm as keyof LocalAIKeys]){
      //   return apiKeysWindowState(true)
      // }

      // handleSubmit(e);
      // console.log(selectedModel, apiKeys[selectedModel.llm as keyof LocalAIKeys])
    }
  };

  return (
    <>
     <form
      // onSubmit={handleSubmit}
      className="relative flex flex-col items-center"
    >
      <Textarea
        className="w-full pt-3 pb-16  resize-none rounded-4xl border placeholder:text-base-400"
        placeholder="Build me a..."
        required={true}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setUserInput(e.target.value)
        }
        maxLength={510}
        onKeyDown={handleKeyDown}
        value={userInput}
      />
      <div className="relative flex flex-row items-center justify-center w-full">
        {/* <button type='button' className='text-xs font-medium px-1 hover:bg-accent/60 absolute left-3 bottom-3'>Select model </button> */}
        <div className="absolute left-3 bottom-3">
          <button
            type="button"
            // onClick={()=>selectedModelWindowState(true)}
            className="text-xs p-1 hover:gray-200 dark:hover:bg-neutral-800 cursor-pointer rounded-[13px] flex flex-row items-center gap-1"
          >
            {"Select model"} <ChevronDown width="18" />
          </button>
          {/* {openSelectedModelWindow && (
            <ModelSelect
              openWindow={openSelectedModelWindow}
              handleOpenWindow={selectedModelWindowState}
            />
          )} */}
        </div>
        <button
          type="submit"
          className="absolute right-3 bottom-3 bg-accent-foreground text-accent p-1.5 rounded-full cursor-pointer"
        >
          <Send width={18.5} height={18.5} />
        </button>
      </div>
    </form>

    {/* APIKEY WINDOW DIALOGe */}
    {/* <APIKeysDialog openWindow={openAPIKeysWindow} windowState={apiKeysWindowState}/> */}
    </>
  );
};

export { UserInput };
