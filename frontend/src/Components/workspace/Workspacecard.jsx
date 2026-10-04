import axios from "axios";

const handleAddClick = async () => {

window.location.href = "http://localhost:5000/api/github";

}

function Workspacecard() {

  return (

   <>
    <p> Connect github and repo</p>
    <button onClick={handleAddClick}> +add </button>
    
   
   </>)

}

export default Workspacecard;