import axios from "axios";

import type { AvailableModels } from "./types";


export const getModels = async(url: string): Promise<AvailableModels[]>=>{
    const response = await axios.get<AvailableModels[]>(url, {
        withCredentials:true
    })
    return response.data
}