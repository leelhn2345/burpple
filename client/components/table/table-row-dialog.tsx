import { Dispatch, SetStateAction, useState, useTransition } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Restaurant } from "./table-column";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { humanReadableDateTime } from "@/lib/datetime";
import { updateRestaurant } from "@/lib/table-row-actions";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../spinner";

type Props = {
  restaurant: Restaurant;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export function TableRowDialog({ restaurant, setOpen }: Props) {
  const [resState, setResState] = useState({ ...restaurant });
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  async function handleUpdate() {
    startTransition(async () => {
      const loading = toast("updating restaurant...");
      const res = await updateRestaurant(restaurant.id, resState, pathname);
      toast.dismiss(loading);
      if (res) {
        toast.error("can't update. please contact IT support");
      } else {
        setOpen(false);
        toast.success("updated");
      }
    });
  }
  return (
    <DialogContent onCloseAutoFocus={() => setResState({ ...restaurant })}>
      <DialogHeader>
        <DialogTitle>{restaurant.name}&apos;s details</DialogTitle>
        <DialogDescription>Edit & Save changes if needed</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor={`${restaurant.name} name`}>Name</Label>
          <Input
            id={`${restaurant.name} name`}
            value={resState.name}
            onChange={(e) => setResState({ ...resState, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor={`${restaurant.name} cuisine`}>Cuisine</Label>
          <Input
            id={`${restaurant.name} cuisine`}
            value={resState.cuisine}
            onChange={(e) =>
              setResState({ ...resState, cuisine: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor={`${restaurant.name} address`}>Address</Label>
          <Input
            id={`${restaurant.name} address`}
            value={resState.address}
            onChange={(e) =>
              setResState({ ...resState, address: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor={`${restaurant.name} description`}>Description</Label>
          <Textarea
            id={`${restaurant.name} description`}
            value={resState.description}
            onChange={(e) =>
              setResState({ ...resState, description: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Created At</Label>
          <Input
            defaultValue={humanReadableDateTime(restaurant.createdAt)}
            disabled={true}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Last Updated</Label>
          <Input
            defaultValue={humanReadableDateTime(restaurant.updatedAt)}
            disabled={true}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={isPending}
          onClick={() => handleUpdate()}
        >
          {isPending ? <Spinner /> : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
