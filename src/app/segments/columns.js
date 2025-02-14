"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns = [
  {
    id: "select",
    header: () => null,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Cluster_ID",
    header: "ID",
    cell: ({ row }) => {
      return <div>{row.getValue("Cluster_ID")}</div>;
    },
  },
  {
    accessorKey: "Cluster_Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Segment Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Percentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const percentage = parseFloat(row.getValue("Percentage"));
      return <div className="text-right">{percentage.toFixed(2)}%</div>;
    },
  },
  {
    accessorKey: "Total_Customers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Customers
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("Total_Customers"));
      return <div className="text-right">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "Emails",
    header: "Email Count",
    cell: ({ row }) => {
      const emails = row.getValue("Emails");
      return <div className="text-right">{emails.length}</div>;
    },
  },
];
