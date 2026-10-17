import { useEffect, useState } from "react";
import axios from "axios";
import RepoList from "./repolist"
import EmptyRepoList from "./EmptyRepoList"
 
const getRepos = async (setRepo) => {
  try {
    const result = await axios.get("http://localhost:5001/api/github/repos");
    setRepo(result.data);

  } catch (error) {
    console.error(
      "Failed to fetch repositories:",
      error.response?.data || error.message );  }

    };

function Repocard(){


  const [repolist, setRepo] = useState([]);
  
  useEffect( ()=>{
   getRepos(setRepo);     
  },[])


   return (
    <>
    {repolist.length > 0 ? (
      <RepoList repolist={repolist} />
    ) : (
      <EmptyRepoList />
    )}
   </>
      )

}

export default Repocard