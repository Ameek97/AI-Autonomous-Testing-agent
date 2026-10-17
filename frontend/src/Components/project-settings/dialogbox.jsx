import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

const handlechange = (type, val, setsettings )=>{
        
     setsettings( (prev)=>({
        ...prev, [type]:val
     }) )
}





        const handleSave = async (settings, repositoryId, setOpen  ) => {
        try {
            const res = await axios.put(
            `http://localhost:5001/api/repositories/${repositoryId}`,
            settings
            );

            console.log("Settings saved:", res.data);
            setOpen(false);
        } catch (error) {
            console.error(
            "Failed to save settings:",
            error.response?.data || error.message
            );
        }
        };



function DialogBox({ targetDomain, globalInstructions, repositoryId }) {


  const [open, setOpen] = useState(false);
  const [settings, setsettings] = useState({
          target_domain: targetDomain ?? "",
          global_instruction: globalInstructions ?? "" });
  
  
  
          return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button type="button" onClick={() => setOpen(true)}>
        <Settings />
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>

        <Label htmlFor="targetDomain"> Target domain </Label>
        <Input id="targetDomain" value={settings.target_domain}  onChange= { (e)=>{ handlechange("target_domain", e.target.value, setsettings )}  } />

        <Label htmlFor="globalInstructions"> Globsl Instructions </Label>
        <Input id="globalInstructions" value={settings.global_instruction} onChange={(e) =>  handlechange("global_instruction", e.target.value, setsettings) } />

        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>

        <Button onClick={() => handleSave(settings,  repositoryId, setOpen )}>
        Save
        </Button>

      </DialogContent>
    </Dialog>
  );
}

export default DialogBox;
