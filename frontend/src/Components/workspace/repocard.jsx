import { useEffect, useState } from "react";
import axios from "axios";
import RepoList from "./repolist"
import EmptyRepoList from "./EmptyRepoList"
 
const getRepos = async (setRepo) => {
  try {
    const result = await axios.get( "http://localhost:5001/api/repositories" );
    setRepo(result.data);

  } catch (error) {
    console.error(
      "Failed to fetch repositories:",
      error.response?.data || error.message );  }

    };

function Repocard(){

  const [ repolist ,setRepo] = useState( [{

    id: 123456,
    name: "testpilot-demo",
    full_name: "ameek97/testpilot-demo",
    private: false,
    html_url: "https://github.com/ameek97/testpilot-demo",
    description: "Demo repository for testing with TestPilot",
    updated_at: "2026-10-12T10:30:00Z",
    language: "JavaScript",
    default_branch: "main",

  },
  {
    id: 234567,
    name: "ai-tutor",
    full_name: "ameek97/ai-tutor",
    private: true,
    html_url: "https://github.com/ameek97/ai-tutor",
    description: "AI-powered learning and quiz generation platform",
    updated_at: "2026-10-11T15:45:00Z",
    language: "Python",
    default_branch: "main",
  },
  {
    id: 345678,
    name: "portfolio",
    full_name: "ameek97/portfolio",
    private: false,
    html_url: "https://github.com/ameek97/portfolio",
    description: "Personal developer portfolio",
    updated_at: "2026-10-10T12:00:00Z",
    language: "React",
    default_branch: "main",
  },
  {
    id: 456789,
    name: "backend-api",
    full_name: "ameek97/backend-api",
    private: false,
    html_url: "https://github.com/ameek97/backend-api",
    description: null,
    updated_at: "2026-10-09T09:20:00Z",
    language: "JavaScript",
    default_branch: "develop",
  },
  {
    id: 567890,
    name: "dsa-practice",
    full_name: "ameek97/dsa-practice",
    private: true,
    html_url: "https://github.com/ameek97/dsa-practice",
    description: "Data structures and algorithms practice",
    updated_at: "2026-10-08T18:10:00Z",
    language: "C++",
    default_branch: "main",
  },   ] );

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