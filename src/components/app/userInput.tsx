import { useState } from "react";
import type { KeyboardEvent, ChangeEvent, FormEvent } from "react";

import { useLocation, useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Send, } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ModelSelectBtn } from "./modelSelect";
import { ApiKeysDialogBtn } from "./ApiKeyDialog";

import { getOrAPIKey, getUserSelectedModel } from "@/lib/utils";


const ApiKeyToast = ({ t }: { t: string | number }) => (
  <div className="relative bg-destructive/35 border-destructive text-destructive p-1.5 rounded-lg shadow-lg border">
    <button 
    type="button"
      onClick={() => toast.dismiss(t)}
      className="absolute top-2 right-2 "
    >
      ✕
    </button>
    
    <div className="flex flex-row mt-2">
      <h3 className="text-xs font-medium mb-4 pr-6">
      Add your Open Router API Key
    </h3>
    
    <ApiKeysDialogBtn>
<button type="button" className="bg-accent-foreground text-accent ">
      Add
    </button>
    </ApiKeysDialogBtn>
    </div>
  </div>
);

const SelectedModelToast = ({ t }: { t: string | number }) => (
  <div className="relative bg-destructive/35 border-destructive text-destructive p-1.5 rounded-lg shadow-lg border">
    <button 
    type="button"
      onClick={() => toast.dismiss(t)}
      className="absolute top-2 right-2 "
    >
      ✕
    </button>
    
    <div className="flex flex-row mt-2">
      <h3 className="text-xs font-medium mb-4 pr-6">
      Select Your Model
    </h3>
    
    <ModelSelectBtn>
<button type="button" className="bg-accent-foreground text-accent ">
      Select
    </button>
    </ModelSelectBtn>
    </div>
  </div>
);

const UserInput = ({handleChatSubmit, handleChatInputChange, chatInput, disable}:{handleChatSubmit?:()=>void, handleChatInputChange?:(e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>)=>void, chatInput?:string, disable?:boolean}) => {
  const [homePageInput, setHomePageInput] = useState<string>("")


  const navigate = useNavigate();
  const {pathname } = useLocation()
  const isHomePage = pathname==="/"


  const handleSubmit = async(e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const kk = getOrAPIKey()
    if(!kk) {
      toast.custom((t) => (
      <ApiKeyToast t={t} />
    ), {position:"top-center", duration:6000})
    return;
  }

    const isUserModelSelected = getUserSelectedModel()
    if(!isUserModelSelected){
      toast.custom((t) => (
      <SelectedModelToast t={t} />
    ), {position:"top-center", duration:6000})
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
    </>
  );
};

export { UserInput };
