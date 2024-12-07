import './App.css';
import {Routes, Route } from 'react-router-dom';

//Vistas
import Home from "./Pages/Home";
import Personas from "./Pages/Personas";

function App() {
  return (

    <div className='App'>
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path='/personas' element={<Personas/>} />
      </Routes>
    </div>

  );
}

export default App;
