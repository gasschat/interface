import React, { createContext, useEffect, useState } from "react"
import useSWR from 'swr'

import { api } from "@/lib/baseUrl";
import { getModels } from "@/lib/fetch";


import type { AvailableModels, CurrentModel } from "@/lib/types"

type ModelProviderProps = {
    children: React.ReactNode
}

type ModelProviderState = {
    currentModel:CurrentModel|null;
    models:AvailableModels[];
    updateCurrentModel:(model:CurrentModel)=>void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ModelContextProvider = createContext<ModelProviderState|undefined>(undefined)

export function ModelProvider({children}:ModelProviderProps){
    const [currentModel, setCurrentModel] = useState<CurrentModel | null>(null)
      const { data } = useSWR<AvailableModels[]>(`${api}/ai/models`, getModels)


    useEffect(()=>{
        const getCurrentModel = localStorage.getItem('selected-model')
        if(getCurrentModel){
            const selectedModel = JSON.parse(getCurrentModel) as CurrentModel
            setCurrentModel(selectedModel)
        }
    },[])

    const updateCurrentModel = (model:CurrentModel)=>{
        const selectedModel = JSON.stringify(model)
        localStorage.setItem('selected-model', selectedModel)
        setCurrentModel(model)
    }

    const value =  {  
         currentModel,
         models:data||[],
         updateCurrentModel
    }

    console.log("MODELS", data)

    return (
        <ModelContextProvider value={value}>
            {children}
        </ModelContextProvider>
    )
}

