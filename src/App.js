import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Agent from "./components/Agent";
import Mint from "./components/Mint";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Mint />} />
            <Route path="/agent" element={<Agent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
