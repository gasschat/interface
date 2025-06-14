import axios from "axios";

import type { AvailableModels, GetThreads, ThreadOverview, ChatHostory, ConnectedClients} from "./types";



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

// Refactor this 
export const deleteThread = async(url:string)=>{
    const response = await axios.delete(url,{
        withCredentials:true,
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data
}

export const getChatHistory = async(url:string)=>{
    const response = await axios.get<ChatHostory>(url,{
        withCredentials:true
    })
    const chats = response.data.chats
    return chats
}

export const getConnectedClients = async(url:string)=>{
    const response = await axios.get<ConnectedClients>(url,{
        withCredentials:true
    })
    const cc = response.data.connectedClients
    console.log("~~~~Connected client~~~~~~~~~~", cc)
    return cc
}