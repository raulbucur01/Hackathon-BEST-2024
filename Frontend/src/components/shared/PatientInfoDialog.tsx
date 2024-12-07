import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientInfoDialogProps {
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>; // Pass setter function as prop
}

const PatientInfoDialog: React.FC<PatientInfoDialogProps> = ({
  setPatientInfo,
}) => {
  const handleSave = () => {
    // Get data from input fields and update the parent component's state
    const allergies = (document.getElementById("allergies") as HTMLInputElement)
      .value;
    const medicalConditions = (
      document.getElementById("medicalConditions") as HTMLInputElement
    ).value;
    const medications = (
      document.getElementById("medications") as HTMLInputElement
    ).value;

    setPatientInfo({ allergies, medicalConditions, medications }); // Update parent state
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-black">
          Tell us about your allergies, conditions etc.
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="text-white">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-white">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right text-white">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientInfoDialog;
