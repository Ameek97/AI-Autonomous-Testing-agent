import axios from "axios";
import "./Workspacecard.css";
import DialogBox from "./dialogBox.jsx";

const handleAddClick = async () => {
  window.location.href = "http://localhost:5001/api/github";
};

function Workspacecard( { githubConnected } ) {
  return (
    <div className="workspace-card">
      <p className="workspace-card__label">Add to GitHub</p>

      {githubConnected ? (
        <p className="workspace-card__status">Connected to GitHub</p>
      ) : (
        <p className="workspace-card__status">Not connected to GitHub</p>
      )}
   
    { !githubConnected ? (
       
      <button className="workspace-card__button" type="button" onClick={handleAddClick}>
        + Add
      </button>) : (
      <DialogBox />
    )}

    


    </div>
  );
}

export default Workspacecard;
