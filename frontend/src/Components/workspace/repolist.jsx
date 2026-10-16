import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import "./repolist.css"

import { useState, useEffect  } from "react"

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


function handleGenerate ( {repo} ){
   
   
}


function Repolist(  ){

const [repolist, setrepolist] = useState([
  {
    id: 1,
    name: "TestPilot",
    full_name: "Ameek97/TestPilot",
    description: "AI-powered testing agent",
    language: "JavaScript",
    private: false,
    html_url: "https://github.com",
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

    return (
        <Accordion type="single" collapsible className="repo-accordion">

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






                <AccordionContent>       {/* the content inside */}
                  <p className={repo.description ? "repo-accordion__body" : "repo-accordion__body is-empty"}>
                    
                    {description}

                   </p>
                    <button disabled={loading} onClick= {()=> handleGenerate(repo) } > Generate </button>


                 
                </AccordionContent>




              </AccordionItem>
            );
          })}
        </Accordion>
      );

    }

    export default Repolist
