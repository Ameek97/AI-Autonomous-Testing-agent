import { useState, useEffect } from "react";
import  WorkspaceHeader  from "../Components/workspace/WorkspaceHeader.jsx";
import Workspacecard from "../Components/workspace/Workspacecard.jsx";


function Workspace() {

  const [githubConnected, setGithubConnected] = useState(false);
  useEffect(() => {
    const cookies = document.cookie.split("; ");

    const githubCookie = cookies.find((cookie) =>
      cookie.startsWith("github_access_token=")
    );

    if (githubCookie) {
      const token = githubCookie.split("=")[1];
      setGithubConnected(true);
    }

  }, []);

  const handleDisconnectGithub = () => {
    document.cookie =
      "github_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    setGithubConnected(false);
  };

  return <div>
    <WorkspaceHeader />
    <h1>Workspace</h1>
    
    <Workspacecard
      githubConnected={githubConnected}
      onDisconnectGithub={handleDisconnectGithub}
    /> 
    </div> ;

}

export default Workspace;
