import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SlotMachine from "./pages/SlotMachine/SlotMachine";
import ThunderEffect from "./pages/ThunderEffect/ThunderEffect";
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/slot-machine" element={<SlotMachine />} />
        <Route path="/thunder" element={<ThunderEffect />} />
      </Routes>
    </Router>
  );
}

export default App;
