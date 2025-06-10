import { XIcon} from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { useModel } from "@/hooks/use-model";


const ModelSelect = ({openWindow, handleOpenWindow}:{openWindow:boolean, handleOpenWindow:(state:boolean)=>void}) => {
  const {currentModel, models, updateCurrentModel} = useModel()


  const LLMProviderIcons: Record<string, string> = {
    "openai": "/chatgpt-icon.svg",
    "anthropic": "/anthropic-icon.svg",
    "gemini": "/gemini-icon.svg"
  };

  console.log("MODEL", models)

  if(!models) return <span>Loading...</span>

  return (
    <Dialog open={openWindow}>
      <DialogContent className="max-h-[80vh] overflow-y-auto" tabIndex={-1}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal">Select your model</DialogTitle>
        </DialogHeader>
         <button
          onClick={() => handleOpenWindow(false)}
          type="button"
          className="cursor-pointer w-fit absolute right-0 m-4"
        >
          <XIcon />
        </button>

        <div className="mt-6">
          <div className="grid grid-cols-3 gap-2 space-y-3">
            {models.map((llm)=>(
              llm.models.map((model)=>(
                <div
                  key={`${model.id}`}
                  onClick={()=>updateCurrentModel({'llm': llm.name, 'model':model.name})}
                  className={`flex flex-col gap-4 items-center py-5 cursor-pointer text-sm w-full max-w-32 border rounded-4xl ${
                    currentModel?.model === model.name ? "border-primary" : ""
                  }`}
                >
                  <img
                    src={LLMProviderIcons[llm.name] as ""}
                    className="w-9 rounded-[17px]"
                    alt={`${llm.title} icon`}
                  />
                  <h3 className="px-2 text-center">{model.title}</h3>
              </div>
              ))
              ))
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ModelSelect };