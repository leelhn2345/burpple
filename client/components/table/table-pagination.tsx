import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { TableQuery } from "@/lib/query-params/table";
import Link from "next/link";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createLimitQueryString = useCallback(
    (name: string, value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(TableQuery.OFFSET);
      params.set(name, value.toString());

      return params.toString();
    },
    [searchParams],
  );
  const createQueryString = useCallback(
    (name: string, value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value.toString());

      return params.toString();
    },
    [searchParams],
  );

  // function paginationChange(name: string, value: number) {
  //   router.push(pathname + `?` + createLimitQueryString(name, value));
  // }

  return (
    <div className="my-2 flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {`Total: ${table.getRowCount()} restaurants`}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={searchParams.get("limit") ?? "10"}
            onValueChange={(value) => {
              router.push(
                pathname +
                  "?" +
                  createLimitQueryString(TableQuery.LIMIT, Number(value)),
              );
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`${pathname}?${createQueryString(TableQuery.OFFSET, 0)}`}>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() => paginationChange(TableQuery.OFFSET, 0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`${pathname}?${createQueryString(TableQuery.OFFSET, table.getState().pagination.pageIndex - 1)}`}
          >
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() =>
              //   paginationChange(
              //     TableQuery.OFFSET,
              //     table.getState().pagination.pageIndex - 1,
              //   )
              // }
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`${pathname}?${createQueryString(TableQuery.OFFSET, table.getState().pagination.pageIndex + 1)}`}
          >
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() =>
              //   paginationChange(
              //     TableQuery.OFFSET,
              //     table.getState().pagination.pageIndex + 1,
              //   )
              // }
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`${pathname}?${createQueryString(TableQuery.OFFSET, table.getPageCount() - 1)}`}
          >
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() =>
              //   router.push(
              //     pathname +
              //       "?" +
              //       createQueryString(
              //         TableQuery.OFFSET,
              //         table.getPageCount() - 1,
              //       ),
              //   )
              // }
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
