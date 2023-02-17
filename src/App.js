import logo from "./SOAPNotes.png";
import "./App.css";
import Speaky from "./speaky.js";

function App() {
  return (
    <div className="App">
      <header className="tester" style={{textAlign:"center"}}>
        <img src={logo} className="App-logo" alt="logo" width="400"
     height="200" />
        <Speaky />
      </header>
    </div>
  );
}

export default App;
