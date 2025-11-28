import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SlotMachine from "./components/SlotMachine";
import ThunderEffect from "./components/ThunderEffect/ThunderEffect";

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
