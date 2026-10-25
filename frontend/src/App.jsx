import { Routes, Route } from "react-router-dom";
import Workspace from "./Pages/workspace.jsx";
import { useContext } from "react";
import AuthState from "./Context"

function App() {



  return (

    <AuthState>
  
    <Routes>

      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={null} />
      <Route path="/workspace" element={<Workspace />} />
    
    </Route>
    
    </Routes>
    </AuthState>
  );
}

export default App;
