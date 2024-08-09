import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Restaurant } from "./table-column";
import { usePathname } from "next/navigation";
import { handleDeleteRow } from "@/lib/table-row-actions";
import { toast } from "sonner";
import { useState } from "react";
import { TableRowDialog } from "./table-row-dialog";
import { Dialog } from "../ui/dialog";

type Props = {
  restaurant: Restaurant;
};

export function TableRowAction({ restaurant }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function handleDelete(id: number) {
    const res = await handleDeleteRow(id, pathname);
    if (res) {
      toast.error("can't delete. please contact IT support.");
    } else {
      toast.success("deleted");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(restaurant.name)}
          >
            Copy restaurant name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(restaurant.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && <TableRowDialog setOpen={setOpen} restaurant={restaurant} />}
    </Dialog>
  );
}
