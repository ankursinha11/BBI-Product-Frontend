import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParamsTableProps {
  tableData: {
    parameters_id: string;
    parameter_name: string;
    parameter_value: string;
    parameter_type: string;
    feed_name: string;
    default_or_custom: string;
    batch_id: string;
    timestamp: string;
    override_parameter_value: string;
  }[];
}

const ParamsTable: React.FC<ParamsTableProps> = ({ tableData }) => {
  console.log("Rendering ParamsTable with Data:", tableData);

  if (!tableData || tableData.length === 0) {
    return (
      <div className="text-white text-center p-4">
        ⚠️ No Parameters Available.
      </div>
    );
  }

  return (
    <Table className="border border-white/20 text-white w-full">
      <TableHeader>
        <TableRow className="bg-[#000B2E] border-b border-white/20">
          <TableHead>Parameter ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Feed Name</TableHead>
          <TableHead>Custom/Default</TableHead>
          <TableHead>Batch ID</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Override Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((param) => (
          <TableRow key={param.parameters_id}>
            <TableCell>{param.parameters_id}</TableCell>
            <TableCell>{param.parameter_name}</TableCell>
            <TableCell>{param.parameter_value}</TableCell>
            <TableCell>{param.parameter_type}</TableCell>
            <TableCell>{param.feed_name}</TableCell>
            <TableCell>{param.default_or_custom}</TableCell>
            <TableCell>{param.batch_id}</TableCell>
            <TableCell>{new Date(param.timestamp).toLocaleString()}</TableCell>
            <TableCell>{param.override_parameter_value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ParamsTable;
