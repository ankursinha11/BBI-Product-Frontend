import React from "react";
import { Card } from "@/components/ui/card";

interface FeedData {
  feed_id: string;
  feed_name: string;
  create_date: string;
  file_delta_percent_allow: string;
  quality_threshold: string;
  land_filename_pattern_compressed: string;
  land_filename_pattern_uncompressed: string;
  land_file_extension_pattern_compressed: string;
  land_file_extension_pattern_uncompressed: string;
  land_dir: string;
  raw_dir: string;
  glue_workflow_name: string;
  feed_description: string;
}

interface FeedTableProps {
  tableData: FeedData[];
}

const FeedTable: React.FC<FeedTableProps> = ({ tableData }) => {
  console.log("📊 Table Rendering with Data:", tableData);

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10  transition-all duration-300 shadow-lg ">
      <div className="overflow-x-auto max-w-full">
        <table className="table w-full border table-auto text-white">
          <thead className="bg-[#000B2E] sticky top-0 border-b border-white/20">
            <tr>
              <th className="border px-4 py-2 text-left">Feed ID</th>
              <th className="border px-4 py-2 text-left">Feed Name</th>
              <th className="border px-4 py-2 text-left">Create Date</th>
              <th className="border px-4 py-2 text-left">File Delta %</th>
              <th className="border px-4 py-2 text-left">Quality Threshold</th>
              <th className="border px-4 py-2 text-left">
                Compressed Filename
              </th>
              <th className="border px-4 py-2 text-left">
                Uncompressed Filename
              </th>
              <th className="border px-4 py-2 text-left">
                Compressed Extension
              </th>
              <th className="border px-4 py-2 text-left">
                Uncompressed Extension
              </th>
              <th className="border px-4 py-2 text-left">Land Directory</th>
              <th className="border px-4 py-2 text-left">Raw Directory</th>
              <th className="border px-4 py-2 text-left">Glue Workflow</th>
              <th className="border px-4 py-2 text-left">Feed Description</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr key={index} className="align-top hover:bg-white/10">
                  <td className="border px-4 py-2">{row.feed_id}</td>
                  <td className="border px-4 py-2">{row.feed_name}</td>
                  <td className="border px-4 py-2">{row.create_date}</td>
                  <td className="border px-4 py-2">
                    {row.file_delta_percent_allow}
                  </td>
                  <td className="border px-4 py-2">{row.quality_threshold}</td>
                  <td className="border px-4 py-2">
                    {row.land_filename_pattern_compressed}
                  </td>
                  <td className="border px-4 py-2">
                    {row.land_filename_pattern_uncompressed}
                  </td>
                  <td className="border px-4 py-2">
                    {row.land_file_extension_pattern_compressed}
                  </td>
                  <td className="border px-4 py-2">
                    {row.land_file_extension_pattern_uncompressed}
                  </td>
                  <td className="border px-4 py-2">{row.land_dir}</td>
                  <td className="border px-4 py-2">{row.raw_dir}</td>
                  <td className="border px-4 py-2">{row.glue_workflow_name}</td>
                  <td className="border px-4 py-2">{row.feed_description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="text-center p-4 text-gray-400">
                  ⚠️ No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default FeedTable;
