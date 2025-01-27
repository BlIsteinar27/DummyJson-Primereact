import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Inicio from "./pages/Inicio"
import Contacto from "./pages/Contacto"


function App() {
  

  return (
    <>
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/" element={<Inicio/>} />
            <Route path="/inicio" element={<Inicio/>} />
            <Route path="/contacto" element={<Contacto/>} />
            <Route path="*" element={<Inicio/>} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
