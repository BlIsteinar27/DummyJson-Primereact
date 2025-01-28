import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Inicio from "./pages/Inicio"
import Contacto from "./pages/Contacto"
import Inventario from "./pages/Inventario"
import Inventario2 from "./pages/Inventario2"


function App() {
  

  return (
    <>
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/" element={<Inicio/>} />
            <Route path="/inicio" element={<Inicio/>} />
            <Route path="/inventario" element={<Inventario/>} />
            <Route path="/inventario2" element={<Inventario2/>} />
            <Route path="/contacto" element={<Contacto/>} />
            <Route path="*" element={<Inicio/>} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
