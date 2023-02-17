import logo from './SOAPNotes.png';
import './App.css';
import Speaky from './speaky.js'

function App() {
  return (
    <div className="App">
      <header className="tester">
        <img src={logo} className="App-logo" alt="logo" />
        <Speaky />
      </header>
    </div>
  );
}

export default App;
