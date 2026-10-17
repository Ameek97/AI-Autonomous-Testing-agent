import { Checkbox } from "@/components/ui/checkbox";
import "./tclist.css";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings , ClipboardList,CheckCircle,XCircle,TrendingUp} from "lucide-react"
import { useState } from "react";
import axios from "axios";
import DialogBox from "../project-settings/dialogbox";
import StatusCard from "../workspace/statuscard"

{/* if checked, add it to state, else remove it from the state */}
const handlecheck = (checked, testcase, setSelectedTestCases) => {
  checked
    ? setSelectedTestCases((prev) => [...prev, testcase])
    : setSelectedTestCases((prev) =>
        prev.filter((tc) => tc.id !== testcase.id)
      );

   
    };

const handleGetResult = async (selectedTestCases, target_domain, globalInstructions, setIsExecuting,setStats, setSelectedTestCases) => {

  setIsExecuting(true); 
  const response = await axios.post("http://localhost:5001/api/testcase/execute", {
    testCaseIds: selectedTestCases.map((testcase) => testcase.id),
    target_domain,
    global_instruction: globalInstructions,
  });

  const result = response.data.results;

   const passed = result.filter(
    (test) => test.status === "passed" ).length;

   const failed = result.filter(
    (test) => test.status === "failed" ).length;

  const total = result.length;

  const successRate = total > 0
    ? Math.round((passed / total) * 100)
    : 0;

  setStats({
    passed: passed,
    failed: failed,
    successRate: successRate
})  
  setSelectedTestCases([]);
  setIsExecuting(false);
};

function Tclist({ tclist, target_domain, globalInstructions, repositoryId }, ) {
  
   const [selectedTestCases, setSelectedTestCases] = useState([]);
   const [stats, setStats] = useState({  passed: 0,failed: 0,successRate: 0});  
   const [isExecuting, setIsExecuting] = useState(false);

    return (

    <>    
    
    <div className="status-cards">
    <StatusCard title="TEST CASES" value={tclist.length} icon={<ClipboardList />} bgColor="status-card--cases" />
    <StatusCard title="CASES PASSED" value={stats.passed} icon={<CheckCircle />} bgColor="status-card--passed" />
    <StatusCard title="CASES FAILED" value={stats.failed} icon={<XCircle />} bgColor="status-card--failed" />
    <StatusCard title="SUCCESS RATE" value={stats.successRate} icon={<TrendingUp />} bgColor="status-card--rate" />
    </div>
    
    
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
             aria-label="Settings">
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
      disabled={selectedTestCases.length === 0 || isExecuting}
      onClick={ () => handleGetResult(selectedTestCases, target_domain, globalInstructions, setIsExecuting, setStats, setSelectedTestCases) }

    >
      Get Result
    </Button>
    </>
  );
}

export default Tclist;
