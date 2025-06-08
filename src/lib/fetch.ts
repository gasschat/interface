import axios from "axios";


export const getModels = async(url:string)=>{
    console.log("URL", url)
    const response = await axios.get(url)
    return response.data
}