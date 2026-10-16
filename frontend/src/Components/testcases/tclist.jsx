import { Checkbox } from "@/components/ui/checkbox";
import "./tclist.css";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react";


{/* if checked, add it to state, else remove it from the state */}
const handlecheck = (checked, testcase, setSelectedTestCases) => {
  checked
    ? setSelectedTestCases((prev) => [...prev, testcase])
    : setSelectedTestCases((prev) =>
        prev.filter((tc) => tc.id !== testcase.id)
      );

   
    };

function Tclist({ tclist = [] }) {
  
   const [selectedTestCases, setSelectedTestCases] = useState([]);

   

    return (

    <>    
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
           <Button size = "icon"  variant="outline"> setting </Button> 


          </div>
          <p className="testcase-list__description">{testCase.description}</p>
        </li>
      ))}
    </ul>
 
    <button disabled={selectedTestCases.length === 0}> Test </button>
    </>
  );
}

export default Tclist;
