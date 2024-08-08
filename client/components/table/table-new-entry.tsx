import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Restaurant } from "./table-column";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { usePathname } from "next/navigation";
import { newRestaurant } from "@/lib/table-row-actions";
import { toast } from "sonner";
import { CirclePlus } from "lucide-react";

const defaultResState: Restaurant = {
  id: 0,
  name: "",
  cuisine: "",
  address: "",
  description: "",
  createdAt: "",
  updatedAt: "",
};
export function TableNewEntry() {
  const [resState, setResState] = useState({ ...defaultResState });
  const pathname = usePathname();
  async function handleSubmit() {
    const res = await newRestaurant(resState, pathname);
    if (res) {
      toast.error("submit error. please seek IT support.");
    } else {
      toast.success("submitted");
    }
  }
  return (
    <div className="mx-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <CirclePlus className="mr-2 h-4 w-4" />
            New
          </Button>
        </DialogTrigger>
        <DialogContent
          onCloseAutoFocus={() => setResState({ ...defaultResState })}
        >
          <DialogHeader>
            <DialogTitle>New Restaurant Entry</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="new name">Name</Label>
              <Input
                id="new name"
                value={resState.name}
                onChange={(e) =>
                  setResState({ ...resState, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="new cuisine">Cuisine</Label>
              <Input
                id="new cuisine"
                value={resState.cuisine}
                onChange={(e) =>
                  setResState({ ...resState, cuisine: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="new address">Address</Label>
              <Input
                id="new address"
                value={resState.address}
                onChange={(e) =>
                  setResState({ ...resState, address: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="new description">Description</Label>
              <Textarea
                id="new description"
                value={resState.description}
                onChange={(e) =>
                  setResState({ ...resState, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" onClick={() => handleSubmit()}>
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
