import React from 'react';

const Home = () => {
  return (
    <div className="container">
      <img src="/mi-imagen.jpg" alt="CRUD" style={{ width: '300px', height: 'auto' }} />
      <div className="header text-center">
        <h2>Laboratorio 0</h2>
        <h1 style={{ color: '#fb923c' }}>CRUD</h1>
        <p>Presentado por <b>PlanifiKlub</b>:</p>
        <ul className="list">
          <li>Jonathan Steven Ochoa Celis</li>
          <li>Luis Alfonso Diaz Vergel</li>
          <li>Maria Jose Jara Herrera</li>
          <li>Sergio Alexander Parada Amarillo</li>
        </ul>

        {/* Agregando la imagen desde la carpeta public */}

      </div>
    </div>
  );
}

export default Home;