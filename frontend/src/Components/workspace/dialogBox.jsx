import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"

const getRepos = async()=>{
    
    try{
        
        const result  = await axios.get("http://localhost:5001/api/github/repos", {})
        console.log(result)
    } catch(err){
        console.log(err)
    }
}

function DialogBox({ isOpen, onClose, children }) {
    
    const {repos, setrepos} = useState([])
    useEffect(() => {
        
        getRepos();  
        console.log( repos )
    
    }, [])

    return (
      <>


        <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>


            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </DialogDescription>
            </DialogHeader>

        <DialogFooter>
        <DialogClose >
            <Button type="button">Close</Button>
        </DialogClose>
        </DialogFooter>


        </DialogContent>
        </Dialog>
      
      
      </>

    ) }

export default DialogBox