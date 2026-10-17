import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import "./repolist.css"

import { useState, useEffect  } from "react"
import axios from "axios"
import Tclist from "../testcases/tclist.jsx"

const formatUpdated = (value) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

const getTestcase = async (repoid, settcload, setTestcase) => {
  console.log("[TestCases] Request sent", { repoid });
  settcload(true);

  try {

    setTestcase([]);
    const response = await axios.get(
      `http://localhost:5001/api/testcase/${repoid}`
    );
    const cases = Array.isArray(response.data) ? response.data : [];
    console.log("[TestCases] Response received", { count: cases.length });
    setTestcase(cases);
    console.log("[TestCases] State updated", { count: cases.length });
  } catch (error) {
    console.error(
      "Failed to fetch test cases:",
      error.response?.data || error.message
    );
    throw error;
  }

  finally{
    settcload(false);
  }
};




function Repolist({ repolist = [] }) {

const [tcloading, settcload] = useState(false);  
const [tclist, setTestcase] = useState([]);

  const [loading, setloading] = useState(false);

  async function handleGenerate(repo) {
            setloading(true);

            try {
              const response = await axios.post(
                "http://localhost:5001/api/github/generate-tests",
                { repo }
              );

              console.log(response.data);
            } catch (error) {
              console.error(
                "Failed to generate test cases:",
                error.response?.data || error.message
              );
            } finally {
              setloading(false);
            }
          }



    return (
        <Accordion type="single" collapsible className="repo-accordion"  onValueChange={(value) => {
          console.log("[TestCases] Accordion changed", { value });
          if (value) {
            getTestcase(value, settcload, setTestcase);
          }
        }} >

          {repolist.map( (repo) => {
 
            const updated = formatUpdated(repo.updated_at)
            const description = repo.description || "No description available."
            const descriptionClass = repo.description
              ? "repo-accordion__description"
              : "repo-accordion__description is-empty"

            return (
              <AccordionItem key={repo.id} value={ String(repo.id) } className="repo-accordion__item">
                
                <AccordionTrigger className="repo-accordion__trigger">
                  <div className="repo-accordion__summary">
                    <p className="repo-accordion__name">{repo.name}</p>
                    <p className="repo-accordion__fullname">{repo.full_name}</p>
                    <p className={descriptionClass}>{description}</p>
                    <div className="repo-accordion__meta">
                      {repo.language ? (
                        <span className="repo-accordion__chip">{repo.language}</span>
                      ) : null}
                      <span className={repo.private ? "repo-accordion__chip repo-accordion__chip--private" : "repo-accordion__chip"}>
                        {repo.private ? "Private" : "Public"}
                      </span>
                      {updated ? (
                        <span className="repo-accordion__updated">Updated {updated}</span>
                      ) : null}
                    </div>
                  </div>
                </AccordionTrigger>






                <AccordionContent className="repo-accordion__content">
                    <div className="repo-accordion__panel">
                      {tcloading ? (<p className="repo-accordion__status">Test cases are still loading...</p>) : tclist.length === 0 ? (
                        <button
                          className="repo-accordion__generate"
                          disabled={loading}
                          onClick={() => handleGenerate(repo)}>
                          Generate
                        </button>
                      ) : (
                        <Tclist tclist={tclist} target_domain={repo.target_domain} globalInstructions={repo.global_instruction} repositoryId={repo.id} />
                      )}
                    </div>
                   
                    
                    

                 
                </AccordionContent>




              </AccordionItem>
            );
          })}
        </Accordion>
      );

    }

    export default Repolist
