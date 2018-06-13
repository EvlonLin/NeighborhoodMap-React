import React from 'react';
import GoogleMap from './components/GoogleMap'
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <GoogleMap/>
      </div>
    );
  }
}

export default App;
