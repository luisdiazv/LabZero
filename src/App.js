import './App.css';
import { Routes, Route } from 'react-router-dom';

// Vistas
import Home from "./Pages/Home";
import Personas from "./Pages/Persona/Personas";
import CrearPersona from "./Pages/Persona/CreatePersona";
import ModificarPersona from './Pages/Persona/UpdatePersona';
import Paises from './Pages/Pais/Paises'; 
import CrearPais from './Pages/Pais/CreatePais';
import ModificarPais from './Pages/Pais/UpdatePais';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personas/" element={<Personas />} />
        <Route path="/personas/crear-persona" element={<CrearPersona />} />
        <Route path="/personas/modificar-persona/:id" element={<ModificarPersona />} />
        <Route path="/paises/" element={<Paises />} />
        <Route path="/paises/crear-pais" element={<CrearPais />} />
        <Route path="/paises/modificar-pais/:id" element={<ModificarPais />} />
      </Routes>
    </div>
  );
}

export default App;
