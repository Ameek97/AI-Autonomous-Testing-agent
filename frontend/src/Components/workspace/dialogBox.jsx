import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import "./dialogBox.css";

const handleAddRepository = async (repo) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/repositories",
      repo
    );

    console.log("Repository saved:", response.data);
  } catch (error) {
    console.error(
      "Failed to save repository:",
      error.response?.data || error.message
    );
  }
};

const getRepos = async (setRepos) => {
  try {
    const result = await axios.get(
      "http://localhost:5001/api/github/repos"
    );

    const repos = result.data.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        html_url: repo.html_url,
        description: repo.description,
        updated_at: repo.updated_at,
        language: repo.language,
        default_branch: repo.default_branch,
      };
    });

    console.log("Repositories:", repos);

    setRepos(repos);
  } catch (err) {
    console.log("Failed to fetch repositories:", err);
  }
};

function DialogBox() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  
  useEffect(() => {
    console.log("useEffect called");
    getRepos(setRepos);
  }, []);

  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Repository</DialogTitle>
          <DialogDescription>
            Select a GitHub repository for your workspace.
          </DialogDescription>
        </DialogHeader>

        <div>
          <ul>
            {repos.map((repo) => {


              return (
                <li key={repo.id}>
                 <button type="button" 
                         onClick={() => setSelectedRepo(repo)} 
                         className={ selectedRepo?.id === repo.id ? "repo-button selected" : "repo-button" } > 
                         
                         {repo.name}
                 </button>
                
                </li>
              );


            })}
          </ul>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" disabled={!selectedRepo} onClick={() => handleAddRepository(selectedRepo)} >Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogBox;

