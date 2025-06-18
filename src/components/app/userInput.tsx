import { useState } from "react";
import type { KeyboardEvent, ChangeEvent, FormEvent } from "react";
import { Send, ChevronDown } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ModelSelect } from "./modelSelect";

import { useLocation, useNavigate } from "react-router";
import { useModel } from "@/hooks/use-model";

import { v4 as uuidv4 } from "uuid";

const UserInput = ({handleChatSubmit, handleChatInputChange, chatInput, disable}:{handleChatSubmit?:()=>void, handleChatInputChange?:(e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>)=>void, chatInput?:string, disable:boolean}) => {
  const [openModelSelectorWindow, setOpenModelSelectorWindow] = useState(false);
  const [homePageInput, setHomePageInput] = useState<string>("")
  const {currentModel} = useModel()

  const navigate = useNavigate();
  const {pathname } = useLocation()
  const isHomePage = pathname==="/"


  const handleSubmit = async(e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if(pathname==="/"){
      const getUUID = (uuidv4 as () => string)()
      await navigate(`c/${getUUID}`, {
        state: {chat: homePageInput}
      })
    }
    handleChatSubmit?.()
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>)=> {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
     await handleSubmit()

    }
  };

  const handleHomePageInputChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
    setHomePageInput(e.target.value)
  }

  const handleOpenModelSelectorWindowState = () => {
    return setOpenModelSelectorWindow(!openModelSelectorWindow);
  };


  return (
    <>
      <form
        onSubmit={(e:FormEvent<HTMLFormElement>)=>{
          handleSubmit(e).catch(()=>console.log("FormEvent Error"))}
        }
        className="relative flex flex-col items-center"
      >
        <Textarea
          className={`w-full pt-3 pb-16 resize-none rounded-4xl border placeholder:text-base-400 max-h-72 no-scrollbar ${!isHomePage&&"backdrop-blur-3xl disabled:bg-accent-foreground"} disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
          placeholder="What is meaning is meaning of life...."
          required={true}
          onChange={pathname==="/"?(handleHomePageInputChange):(handleChatInputChange)}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>)=>{
            handleKeyDown(e).catch(()=>console.log("error while submitting"))
          }}
          value={pathname==="/"?(homePageInput):(chatInput)}
          name="userInput"
          disabled={disable}
        />
        <div className="relative flex flex-row items-center justify-center w-full">
          {/* <button type='button' className='text-xs font-medium px-1 hover:bg-accent/60 absolute left-3 bottom-3'>Select model </button> */}
          <div className="absolute left-3 bottom-3">
            <button
              type="button"
              onClick={handleOpenModelSelectorWindowState}
              className="text-xs p-1 hover:gray-200 dark:hover:bg-neutral-800 cursor-pointer rounded-[13px] flex flex-row items-center gap-1"
            >
              {!currentModel?"Select model":currentModel.model} <ChevronDown width="18" />
            </button>
            {openModelSelectorWindow && (
              <ModelSelect
                openWindow={openModelSelectorWindow}
                handleOpenWindow={handleOpenModelSelectorWindowState}
              />
            )}
          </div>
          <button
            type="submit"
            className="absolute right-3 bottom-3 bg-accent-foreground text-accent p-1.5 rounded-full cursor-pointer"
          >
            <Send width={18.5} height={18.5} />
          </button>
        </div>
      </form>
    </>
  );
};

export { UserInput };
