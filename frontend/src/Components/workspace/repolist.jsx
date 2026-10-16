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
  
  settcload(true);

  try {

    setTestcase([]);
    const response = await axios.get(
      `http://localhost:5001/api/testcase/${repoid}`
    );
    
    console.log("Fetched test cases:", response.data);
    setTestcase(response.data);
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




function Repolist(  ){

const [tcloading, settcload] = useState(false);  
const [tclist, setTestcase] = useState([]);

const [repolist, setrepolist] = useState([
{
  id: 1,
  name: "demo-app",
  full_name: "testpilot_demo/demo-app",
  description: "Demo repository for TestPilot",
  language: "JavaScript",
  private: false,
  html_url: "https://github.com/testpilot-demo/demo-app",
},
  {
    id: 2,
    name: "ai_tutor",
    full_name: "Ameek97/ai_tutor",
    description: "AI-powered study platform",
    language: "JavaScript",
    private: false,
    html_url: "https://github.com",
  },
  {
    id: 3,
    name: "ecommerce-api",
    full_name: "Ameek97/ecommerce-api",
    description: "REST API for an ecommerce application",
    language: "JavaScript",
    private: true,
    html_url: "https://github.com",
  },
]);

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
        <Accordion type="single" collapsible className="repo-accordion"  onValueChange={(value) => {getTestcase(value, settcload, setTestcase);}} >

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
                        <Tclist tclist={tclist} />
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
