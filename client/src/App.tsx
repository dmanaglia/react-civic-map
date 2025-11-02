import React from 'react';
import './App.css';

function App() {

  async function getData() {
    const url = "http://127.0.0.1:8000/api/health";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  getData();

  return (
    <div className="App">

    </div>
  );
}

export default App;
