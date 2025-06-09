import { useState } from "react";
import type { KeyboardEvent, ChangeEvent, FormEvent } from "react";
import { Send, ChevronDown } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ModelSelect } from "./modelSelect";

import { useNavigate } from "react-router";
import { useModel } from "@/hooks/use-model";

const UserInput = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [openModelSelectorWindow, setOpenModelSelectorWindow] = useState(false);
  const {currentModel} = useModel()

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", userInput);
    await navigate("/c/new", {
      state: { chat: userInput },
    });
  };

  const handleKeyDown = async(e: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit(e)

    }
  };

  const handleOpenModelSelectorWindowState = () => {
    return setOpenModelSelectorWindow(!openModelSelectorWindow);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSubmit(e).catch((err) => {
            console.error("Form submission failed:", err);
          });
        }}
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
          onKeyDown={(e:KeyboardEvent<HTMLTextAreaElement>)=>{
            handleKeyDown(e).catch((err)=>console.error("Form Submittion Failed", err))
          }}
          value={userInput}
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
