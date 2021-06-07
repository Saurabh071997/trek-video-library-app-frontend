import './App.css'
import {Routes, Route} from 'react-router-dom'
import {useWindowSize} from './context/useWindowSize'
import {Navigation} from './components/Navigation'
import {Home} from './components/Home'
import {Categories} from './components/Categories'
import {LoginPage} from './components/LoginPage'
import {Footer} from './components/Footer'

function App() {
  const[, width] = useWindowSize();
  return (
    <div className="App">
      <Navigation/>
      <div style={{minHeight:"100vh"}}>
        <Routes>
          <Route path="/" element = {<Home/>} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>

      <Footer/>
     {width < 600 && (
        <div style={{ height: "10vh", backgroundColor: "#171717" }}></div>
      )}
    </div>
  );
}

export default App;
