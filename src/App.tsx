import { Routes, Route } from "react-router"

import { ThemeProvider } from "./contexts/theme-provider"
import { ModelProvider } from "./contexts/model-provider"

import { Layout } from "./pages/Layout"
import { Home } from "./pages/Home"
import { Chat } from "./pages/Chat"

function App() {

  return (
    <ThemeProvider>
      <ModelProvider>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="c/:chatId" element={<Chat/>} />
        </Route>
      </Routes>
      </ModelProvider>

    </ThemeProvider>
  )
}

export default App
