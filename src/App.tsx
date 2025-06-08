import { ThemeProvider } from "./contexts/theme-provider"
import { Button } from "./components/ui/button"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="gass-theme">
      <Button >Hello World, Aditya Pushkar</Button>
    </ThemeProvider>
  )
}

export default App
