import axios from "axios";

import type { AvailableModels, GetThreads, ThreadOverview } from "./types";



export const getModels = async(url: string): Promise<AvailableModels[]>=>{
    const response = await axios.get<AvailableModels[]>(url, {
        withCredentials:true
    })
    return response.data
}


export const threads = async(url:string): Promise<ThreadOverview[]> =>{
    const response = await axios.get<GetThreads>(url, {
        withCredentials:true,
    })
    return response.data.threads
}

export const deleteThread = async(url:string)=>{
    const response = await axios.delete(url,{
        withCredentials:true,
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data
}