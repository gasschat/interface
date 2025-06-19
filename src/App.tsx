import { Routes, Route } from "react-router"
import { Toaster } from "@/components/ui/sonner"


import { ThemeProvider } from "./contexts/theme-provider"

import { Layout } from "./pages/Layout"
import { Home } from "./pages/Home"
import Login from "./pages/Login"
import SharedChat from "./pages/SharedChat"
import { Chat } from "./pages/Chat"

function App() {

  return (
    <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="c/:chatId" element={<Chat/>} />
        </Route>
        <Route path="/share/:chatId" element={<SharedChat/>}/> 
      </Routes>
      <Toaster richColors/>
    </ThemeProvider>
  )
}

export default App
