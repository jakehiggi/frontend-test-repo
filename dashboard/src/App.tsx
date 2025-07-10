import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Dashboard from "./pages/Dashboard"
import "./App.css"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dashboard-theme">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<div className="p-8">Messages Page</div>} />
        <Route path="/analytics" element={<div className="p-8">Analytics Page</div>} />
        <Route path="/users" element={<div className="p-8">Users Page</div>} />
        <Route path="/documents" element={<div className="p-8">Documents Page</div>} />
        <Route path="/settings" element={<div className="p-8">Settings Page</div>} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
