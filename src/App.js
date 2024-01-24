import logo from './logo.svg';
import './App.css';
import GameBoard from './game';


function App() {
  return (
    <div className="App">
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
  <header className="App-header">
        <GameBoard/> 
       {/* <YourComponent></YourComponent> */}
      </header>
    </div>
  );
}

export default App;
