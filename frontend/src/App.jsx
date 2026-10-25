import { Routes, Route, Outlet } from "react-router-dom";
import Workspace from "./Pages/workspace.jsx";
import Login from "./Pages/loginPage.jsx";
import Signup from "./Pages/Signup.jsx";
import AuthState from "./Context/authContext.jsx";
function ProtectedRoute() {
  return <Outlet />;
}

function App() {



  return (

    <AuthState>
  
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element = { <Signup /> } />
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={null} />
      <Route path="/workspace" element={<Workspace />} />
    
    </Route>
    
    </Routes>
    </AuthState>
  );
}

export default App;
