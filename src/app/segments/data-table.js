import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export function DataTable({ data, setSelectedId, selectedId }) {
  const handleCheckboxChange = (clusterId) => {
    console.log(clusterId);
    setSelectedId(clusterId === selectedId ? null : clusterId);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Segment Name</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Total Customers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.clusterId}>
              <TableCell>
                <Checkbox
                  checked={selectedId === item.clusterId}
                  onCheckedChange={() => handleCheckboxChange(item.clusterId)}
                />
              </TableCell>
              <TableCell>{item.clusterName}</TableCell>
              <TableCell>{item.percentage.toFixed(2)}%</TableCell>
              <TableCell>{item.totalCustomers}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
