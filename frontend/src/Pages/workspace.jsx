import { useState, useEffect } from "react";
import axios from "axios";
import  WorkspaceHeader  from "../Components/workspace/WorkspaceHeader.jsx";
import Workspacecard from "../Components/workspace/Workspacecard.jsx";
import Repocard from "../Components/workspace/repocard.jsx";

function Workspace() {



  const [githubConnected, setGithubConnected] = useState(false);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    const cookies = document.cookie.split("; ");

    const githubCookie = cookies.find((cookie) =>
      cookie.startsWith("github_access_token=")
    );

    if (githubCookie) {
      const token = githubCookie.split("=")[1];
      setGithubConnected(true);
    }

    const getSavedRepositories = async () => {
      try {
        const result = await axios.get("http://localhost:5001/api/repositories");
        setRepositories(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error(
          "Failed to fetch repositories:",
          error.response?.data || error.message
        );
      }
    };

    getSavedRepositories();
  }, []);

  const handleDisconnectGithub = () => {
    document.cookie =
      "github_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    setGithubConnected(false);
  };


  return (
  <div className="workspace-page">
    <WorkspaceHeader />
    <h1>Workspace</h1>
    
    <Workspacecard
      githubConnected={githubConnected}
      onDisconnectGithub={handleDisconnectGithub}
    /> 



    <h1 className="text-[2em] font-bold"> Repositories </h1> 
   
    <Repocard repolist={repositories} />

    </div>) 

}

export default Workspace;
