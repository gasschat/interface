import { Routes, Route } from "react-router"

import { ThemeProvider } from "./contexts/theme-provider"

import { Layout } from "./pages/Layout"
import { Home } from "./pages/Home"
import { Chat } from "./pages/Chat"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="gass-theme">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="c/:chatId" element={<Chat/>} />
        </Route>
      </Routes>

    </ThemeProvider>
  )
}

export default App
