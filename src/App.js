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
import Departamentos from './Pages/Departamentos/Departamento';
import CrearDepartamento from './Pages/Departamentos/CreateDepartameto';
import ModificarDepartamento from './Pages/Departamentos/UpdateDepartamento';
import Municipios from './Pages/Municipio/Municipios';
import CrearMunicipio from './Pages/Municipio/CreateMunicipio';
import ModificarMunicipio from './Pages/Municipio/UpdateMunicipio';
import CrearVivienda from './Pages/Vivienda/CreateVivienda';
import PropiedadVivienda from './Pages/PropiedadVivienda/PropiedadVivienda';
import CrearPropiedadVivienda from './Pages/PropiedadVivienda/CreatePropiedadVivienda';
import ModificarPropiedadVivienda from './Pages/PropiedadVivienda/UpdatePropiedadVivienda';

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
        <Route path="/departamentos/" element={<Departamentos />} />
        <Route path="/departamentos/crear-departamento" element={<CrearDepartamento />} />
        <Route path="/departamentos/modificar-departamento/:id" element={<ModificarDepartamento />} />
        <Route path="/municipios/" element={<Municipios />} />
        <Route path="/municipios/crear-municipio" element={<CrearMunicipio />} />
        <Route path="/municipios/modificar-municipio/:id" element={<ModificarMunicipio />} />
        <Route path="/viviendas/crear-vivienda" element={<CrearVivienda />} />
        <Route path="/propiedad-vivienda/" element={<PropiedadVivienda />} />
        <Route path="/propiedad-vivienda/crear-propiedad-vivienda" element={<CrearPropiedadVivienda />} />
        <Route path="/propiedad-vivienda/modificar-propiedad-vivienda/:id" element={<ModificarPropiedadVivienda />} />
      </Routes>
    </div>
  );
}

export default App;
