import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  EyeOffIcon,
} from "lucide-react";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HTMLAttributes } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TableQuery } from "@/lib/query-params/table";

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  accessor: string;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  accessor,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryColumn = searchParams.get(TableQuery.COLUMN);
  const sortDirection = searchParams.get(TableQuery.SORT);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  function resetSorting() {
    const params = new URLSearchParams(searchParams);
    params.delete("column");
    params.delete("sort");
    router.push(pathname + "?" + params.toString());
  }

  function sortColumn(column: string, sortDirection: "asc" | "desc") {
    const params = new URLSearchParams(searchParams);
    params.set(TableQuery.COLUMN, column);
    params.set(TableQuery.SORT, sortDirection);
    router.push(pathname + "?" + params.toString());
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {queryColumn === accessor && sortDirection ? (
              sortDirection === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => sortColumn(accessor, "asc")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => sortColumn(accessor, "desc")}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => resetSorting()}>
            <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            None
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              resetSorting();
              column.toggleVisibility(false);
            }}
          >
            <EyeOffIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
