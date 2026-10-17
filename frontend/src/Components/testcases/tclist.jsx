import { Checkbox } from "@/components/ui/checkbox";
import "./tclist.css";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useState } from "react";
import DialogBox from "../project-settings/dialogbox";

{/* if checked, add it to state, else remove it from the state */}
const handlecheck = (checked, testcase, setSelectedTestCases) => {
  checked
    ? setSelectedTestCases((prev) => [...prev, testcase])
    : setSelectedTestCases((prev) =>
        prev.filter((tc) => tc.id !== testcase.id)
      );

   
    };

function Tclist({ tclist, target_domain, globalInstructions, repositoryId }, ) {
  
   const [selectedTestCases, setSelectedTestCases] = useState([]);
  


    return (

    <>    

    <DialogBox targetDomain={target_domain} globalInstructions={globalInstructions} repositoryId={repositoryId} />
    


    <ul className="testcase-list">
      
      {tclist.map((testCase) => (

        <li key={testCase.id} className="testcase-list__item">
        
          <div className="testcase-list__header">
        
            <Checkbox id={`test-${testCase.id}`} onCheckedChange = { (checked) => handlecheck(checked, testCase, setSelectedTestCases) }/>
        
            <label className="testcase-list__title" htmlFor={`test-${testCase.id}`}>
              {testCase.title}
            </label>

           <Badge variant = "secondary" >{testCase.type}</Badge>
           <Badge variant = "secondary" >{testCase.status}</Badge>
           <Button
             type="button"
             size="icon-sm"
             variant="outline"
             className="testcase-list__settings"
             aria-label="Settings"
           >
             <Settings />
           </Button> 


          </div>
          <p className="testcase-list__description">{testCase.description}</p>
        </li>
      ))}
    </ul>
 
    <Button
      type="button"
      className="testcase-list__action"
      disabled={selectedTestCases.length === 0}
    >
      Get Result
    </Button>
    </>
  );
}

export default Tclist;
