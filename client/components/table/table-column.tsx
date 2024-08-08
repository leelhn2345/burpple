"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./table-column-header";
import { TableRowAction } from "./table-row-actions";
import { humanReadableDateTime } from "@/lib/datetime";

// This type is used to define the shape of our data.
export type Restaurant = {
  id: number;
  name: string;
  address: string;
  cuisine: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Restaurant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" accessor="name" />
    ),
  },
  {
    accessorKey: "cuisine",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Cuisine"
        accessor="cuisine"
      />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Address"
        accessor="address"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        accessor="created_at"
      />
    ),
    cell: ({ row }) => {
      const formatted = humanReadableDateTime(row.getValue("createdAt"));
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last Updated"
        accessor="updated_at"
      />
    ),
    cell: ({ row }) => {
      const formatted = humanReadableDateTime(row.getValue("updatedAt"));
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const restaurant = row.original;

      return <TableRowAction restaurant={restaurant} />;
    },
  },
];
