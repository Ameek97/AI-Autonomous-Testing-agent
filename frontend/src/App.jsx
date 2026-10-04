import { Routes, Route } from "react-router-dom";
import Workspace from "./Pages/workspace.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={null} />
      <Route path="/workspace" element={<Workspace />} />
    </Routes>
  );
}

export default App;
