import { useState, useEffect } from "react";
import { XIcon, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import useSWR from "swr";

import { api } from "@/lib/baseUrl";
import { getModels } from "@/lib/fetch";

import type { AvailableModels, CurrentModel } from "@/lib/types";
import { getSelectedModel } from "@/lib/utils";
import { LLMProviderIcons } from "@/lib/utils";


export const ModelSelect = ({
  openWindow,
  handleOpenWindow,
}: {
  openWindow: boolean;
  handleOpenWindow: (state: boolean) => void;
}) => {
  const [currentModel, setCurrentModel] = useState<CurrentModel | null>(null);
  const { data: models } = useSWR<AvailableModels[]>(
    `${api}/ai/models`,
    getModels
  );

  useEffect(() => {
    const getCurrentModel = localStorage.getItem("selected-model");
    if (getCurrentModel) {
      const selectedModel = JSON.parse(getCurrentModel) as CurrentModel;
      setCurrentModel(selectedModel);
    }
  }, []);

  const updateCurrentModel = (model: CurrentModel) => {
    const selectedModel = JSON.stringify(model);
    localStorage.setItem("selected-model", selectedModel);
    setCurrentModel(model);
  };


  if (!models) return null;

  return (
    <Dialog open={openWindow} onOpenChange={handleOpenWindow}>
      <DialogContent className="max-h-[80vh] overflow-y-auto" tabIndex={-1}>
        <button
          onClick={() => handleOpenWindow(false)}
          type="button"
          className="cursor-pointer w-fit absolute right-0 m-4"
        >
          <XIcon />
        </button>

        <div className="mt-6">
          <Tabs defaultValue={models[0]?.name} className="w-full">
            <TabsList className="w-full mb-4 overflow-x-auto">
              {models.map((llm) => (
                <TabsTrigger
                  key={llm.id}
                  value={llm.name}
                  className="text-xs px-2 py-1 truncate"
                >
                  {llm.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="h-[400px] block overflow-y-visible">
              {models.map((llm) => (
                <TabsContent key={llm.id} value={llm.name}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 space-y-3">
                    {llm.models.map((model) => (
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
                        className={`flex flex-col gap-2 sm:gap-4 items-center py-3 sm:py-5 cursor-pointer text-sm w-24 h-24 sm:w-32 sm:h-32 border rounded-4xl ${
                          currentModel?.model === model.name
                            ? "border-primary"
                            : ""
                        }`}
                      >
                        <img
                          src={LLMProviderIcons[llm.name] as ""}
                          className="w-6 h-6 sm:w-9 sm:h-9 rounded-[17px] flex-shrink-0"
                          alt={`${llm.title} icon`}
                        />
                        <h3 className="px-1 sm:px-2 text-center text-xs leading-tight line-clamp-2 overflow-hidden">
                          {model.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
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
  const currentSelectedModel: CurrentModel | null = getSelectedModel()

  const handleOpenWindow = (state: boolean) => {
    setOpenWindow(state);
  };

  return (
    <>
      <div role="button" onClick={() => handleOpenWindow(true)}>
        {!children ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs font-light"
          >
            {currentSelectedModel
              ? currentSelectedModel.modelTitle
              : "Select model"}
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
