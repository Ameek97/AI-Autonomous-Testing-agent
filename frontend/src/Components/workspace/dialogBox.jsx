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



function DialogBox({ isOpen, onClose, children }) {

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