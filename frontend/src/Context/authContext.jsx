
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

function AuthState(props) {
  const [isloggedin, setlogedin] = useState(false);
  const [loading, setloading] = useState(true);

  return (
    <AuthContext.Provider
      value={{ isloggedin, setlogedin, loading, setloading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthState;
