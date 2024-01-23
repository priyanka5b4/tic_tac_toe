import logo from './logo.svg';
import './App.css';
import GameBoard from './game';
import YourComponent from './test';

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
