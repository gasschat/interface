export interface Model{
  title:string;
  name:string
}

export interface LLM{
  id:string
  title:string
  name:string
}

export interface AvailableModels{
   id:string
  title:string
  name:string
  models:Model[]
}

export interface CurrentModel{
  llm:string
  model:string
}

export interface LLMProviderImg{
[key:string]: string
}