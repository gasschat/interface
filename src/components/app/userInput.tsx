import { useState } from "react";
import type { KeyboardEvent, ChangeEvent, FormEvent } from "react";

import { useLocation, useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Send, } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ModelSelect, ModelSelectBtn } from "./modelSelect";
import { APIKeysDialog} from "./ApiKeyDialog";

import { getSelectedModel } from "@/lib/utils";
import { getApiKey } from "@/lib/utils";



const UserInput = ({handleChatSubmit, handleChatInputChange, chatInput, disable}:{handleChatSubmit?:()=>void, handleChatInputChange?:(e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>)=>void, chatInput?:string, disable?:boolean}) => {
  const [homePageInput, setHomePageInput] = useState<string>("")
  const [isApiDialogueShouldOpen, setIsApiDialogueShouldOpen] = useState(false)
  const [isModelDialogueShouldOpen, setIsModelDialogueShouldOpen] = useState(false)


  const navigate = useNavigate();
  const {pathname } = useLocation()
  const isHomePage = pathname==="/"


  const handleSubmit = async(e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if(disable) return

    const isModelSelected = getSelectedModel()
    if(!isModelSelected){
      toast.error("Please select your model.",{
        position:"top-center"
      })
      setIsModelDialogueShouldOpen(true)
      return;
    }

    const isApiKey = getApiKey(isModelSelected.llm)
    if(!isApiKey){
      toast.error(`Please add your ${isModelSelected.llm} API key`,{
        position:"top-center"
      })
      setIsApiDialogueShouldOpen(true)
      return;
    }


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


  return (
    <>
      <form
        onSubmit={(e:FormEvent<HTMLFormElement>)=>{
          handleSubmit(e).catch(()=>console.log("FormEvent Error"))}
        }
        className="relative flex flex-col items-center"
      >
        <Textarea
          className={`w-full pt-3 pb-16 resize-none rounded-4xl border placeholder:text-base-400 max-h-72 no-scrollbar ${!isHomePage&&"backdrop-blur-3xl"}  ${disable&&'!cursor-not-allowed'}`}
          placeholder="What is meaning is meaning of life...."
          required={true}
          onChange={pathname==="/"?(handleHomePageInputChange):(handleChatInputChange)}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>)=>{
            handleKeyDown(e).catch(()=>console.log("error while submitting"))
          }}
          value={pathname==="/"?(homePageInput):(chatInput)}
          name="userInput"
        />
        <div className="relative flex flex-row items-center justify-center w-full">
          {/* <button type='button' className='text-xs font-medium px-1 hover:bg-accent/60 absolute left-3 bottom-3'>Select model </button> */}
          <div className="absolute left-3 bottom-3">
            <ModelSelectBtn/>
          </div>
          <button
            type="submit"
            className="absolute right-3 bottom-3 bg-accent-foreground text-accent p-1.5 rounded-full cursor-pointer"
          >
            <Send width={18.5} height={18.5} />
          </button>
        </div>
      </form>
      <ModelSelect openWindow={isModelDialogueShouldOpen} handleOpenWindow={()=>setIsModelDialogueShouldOpen(false)}/>
      <APIKeysDialog openWindow={isApiDialogueShouldOpen} windowState={setIsApiDialogueShouldOpen}/>
    </>
  );
};

export { UserInput };
