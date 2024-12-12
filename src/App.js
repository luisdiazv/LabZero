import './App.css';
import { Routes, Route } from 'react-router-dom';

// Vistas
import Home from "./Pages/Home";
import Personas from "./Pages/Personas";
import CrearPersona from "./Pages/CreatePersona"; // Cambio de nombre a mayúscula
import ModificarPersona from './Pages/UpdatePersona';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personas" element={<Personas />} />
        <Route path="/crear-persona" element={<CrearPersona />} />
        <Route path="/modificar-persona/:id" element={<ModificarPersona />} />
      </Routes>
    </div>
  );
}

export default App;
