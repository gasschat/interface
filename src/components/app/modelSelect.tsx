import { useState, useEffect } from "react";
import { XIcon, ChevronDown } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

import useSWR from "swr";

import { api } from "@/lib/baseUrl";
import { getModels } from "@/lib/fetch";

import type { AvailableModels, CurrentModel } from "@/lib/types";
import { getUserSelectedModel } from "@/lib/utils";

const ModelSelect = ({
  openWindow,
  handleOpenWindow,
}: {
  openWindow: boolean;
  handleOpenWindow: (state: boolean) => void;
}) => {
  const [currentModel, setCurrentModel] = useState<CurrentModel | null>(null);
  const { data:models } = useSWR<AvailableModels[]>(`${api}/ai/models`, getModels);

  useEffect(() => {
    const getCurrentModel = localStorage.getItem("selected-model");
    if (getCurrentModel) {
      const selectedModel = JSON.parse(getCurrentModel) as CurrentModel;
      setCurrentModel(selectedModel);
    }
  }, []);

  const updateCurrentModel = (model:CurrentModel)=>{
    const selectedModel = JSON.stringify(model)
    localStorage.setItem('selected-model', selectedModel)
    setCurrentModel(model)
  }

  const LLMProviderIcons: Record<string, string> = {
    openai: "/chatgpt-icon.svg",
    anthropic: "/anthropic-icon.svg",
    gemini: "/gemini-icon.svg",
  };

  if (!models) return <span>Loading...</span>;

  return (
    <Dialog open={openWindow} onOpenChange={handleOpenWindow}>
      <DialogContent className="max-h-[80vh] overflow-y-auto" tabIndex={-1}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal">
            Select your model
          </DialogTitle>
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
            {models.map((llm) =>
              llm.models.map((model) => (
                <div
                  key={`${model.id}`}
                  onClick={() => {
                    updateCurrentModel({
                      llm: llm.name,
                      model: model.name,
                      modelTitle: model.title,
                    });
                    handleOpenWindow(false);
                  }}
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ModelSelectBtn = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [openWindow, setOpenWindow] = useState(false);
  const currentSelectedModel:CurrentModel|undefined = getUserSelectedModel()

  const handleOpenWindow = (state: boolean) => {
    setOpenWindow(state);
  };

  return (
    <>
      <div role="button" onClick={() => handleOpenWindow(true)}>
        {!children ? (
          <Button variant="ghost" size="sm" className="text-xs font-light">
            {currentSelectedModel? currentSelectedModel.modelTitle: "Select model"}
            <ChevronDown />
          </Button>
        ) : (
          children
        )}
      </div>
      <ModelSelect
        openWindow={openWindow}
        handleOpenWindow={handleOpenWindow}
      />
    </>
  );
};
