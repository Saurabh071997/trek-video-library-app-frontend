import './App.css';

import {useWindowSize} from './context/useWindowSize'
import {Navigation} from './components/Navigation'
import {Footer} from './components/Footer'

function App() {
  const[, width] = useWindowSize();
  return (
    <div className="App">
      <Navigation/>
      <div style={{minHeight:"100vh"}}></div>

      <Footer/>
     {width < 600 && (
        <div style={{ height: "10vh", backgroundColor: "#171717" }}></div>
      )}
    </div>
  );
}

export default App;
