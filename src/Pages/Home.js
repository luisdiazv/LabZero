import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <img src="/CRUD.png" alt="CRUD" style={{ width: '100%', height: 'auto' }} />
      <div className="home-header">
        <h1>Presentado por <b>PlanifiKlub</b>:</h1>
        <ul className="list">
          <div className='person-container'>
            <img className="person-img" src="/jonhatan.png" alt="CRUD" style={{ width: '80%', height: 'auto' }} />
            <h3><strong>Jonathan Steven Ochoa Celis</strong></h3>
          </div>
          <div className='person-container'>
            <img className="person-img" src="/luis.png" alt="CRUD" style={{ width: '80%', height: 'auto' }} />
            <h3><strong>Luis Alfonso Diaz Vergel</strong></h3>
          </div>
          <div className='person-container'>
            <img className="person-img" src="/chara.png" alt="CRUD" style={{ width: '80%', height: 'auto' }} />
            <h3><strong>Maria Jose Jara Herrera</strong></h3>
          </div>

          <div className='person-container'>
            <img className="person-img" src="/sergio.png" alt="CRUD" style={{ width: '80%', height: 'auto' }} />
            <h3><strong>Sergio Alexander Parada Amarillo</strong></h3>
          </div>

        </ul>

      </div>
    </div>
  );
}

export default Home;