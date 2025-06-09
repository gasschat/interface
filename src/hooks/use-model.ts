import { use } from "react";

import { ModelContextProvider } from "@/contexts/model-provider";

export const useModel = () => {
    const context = use(ModelContextProvider)
    
    if(context===undefined){
        throw new Error("useModel must be used inside the ModelProvide")
    }
    return context
}