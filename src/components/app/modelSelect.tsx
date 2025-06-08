import { XIcon} from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { useUserProvider } from "@/context/user-provider";
import { LLMSvg } from "@/lib/types";


const ModelSelect = ({openWindow, handleOpenWindow}:{openWindow:boolean, handleOpenWindow:(state:boolean)=>void}) => {
  const { modelList, modelListLoading, selectedModel, handleSelectModel } = useUserProvider();

  return (
    <Dialog open={openWindow}>
      <DialogContent className="max-h-[80vh] overflow-y-auto" tabIndex={-1}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal">Select your model</DialogTitle>
        </DialogHeader>
         <button
          onClick={() => handleOpenWindow(false)}
          className="cursor-pointer w-fit absolute right-0 m-4"
        >
          <XIcon />
        </button>

        <div className="mt-6">
          <div className="grid grid-cols-3 gap-2 space-y-3">
            {!modelListLoading && modelList?.map((provider) =>
              provider.models.map((model) => (
                <div
                  key={`${provider.id}-${model.id}`}
                  onClick={() => handleSelectModel(provider, model)}
                  className={`flex flex-col gap-4 items-center py-5 cursor-pointer text-sm w-full max-w-32 border rounded-4xl ${
                    selectedModel?.model === model.name ? "border-primary" : ""
                  }`}
                >
                  <img
                    src={LLMSvg[model.name] || LLMSvg[provider.name] || "/default-icon.svg"}
                    className="w-9 rounded-[17px]"
                    alt={`${provider.name} icon`}
                  />
                  <h3 className="px-2 text-center">{model.title}</h3>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ModelSelect };