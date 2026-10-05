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

  return <div>
    <WorkspaceHeader />
    <h1>Workspace</h1>
    
    <Workspacecard githubConnected={githubConnected} /> 
    </div> ;

}

export default Workspace;
