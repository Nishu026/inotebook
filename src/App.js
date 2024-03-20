import './App.css';
import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
function App() {
  return (
    <Router>
    <div className="App">
      <Navbar/>
     <h1> Welcome to inotebook</h1>
     
            <Routes>
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/about" element={<About/>}/>
            </Routes>
       
    </div>
    </Router>
  );
}

export default App;
