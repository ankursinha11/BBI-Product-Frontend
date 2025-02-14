"use client";

import { useState, useEffect } from "react";
import { fetchFeed } from "../../utils/fetchFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedTable from "@/components/FeedTable";
import Papa from "papaparse";

interface NewFeedData {
  feed_id: string;
  feed_name: string;
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

export default function FeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<FeedData[]>([]);
  const [newData, setNewData] = useState<NewFeedData>({
    feed_id: "",
    feed_name: "",
    file_delta_percent_allow: "",
    quality_threshold: "",
    land_filename_pattern_compressed: "",
    land_filename_pattern_uncompressed: "",
    land_file_extension_pattern_compressed: "",
    land_file_extension_pattern_uncompressed: "",
    land_dir: "",
    raw_dir: "",
    glue_workflow_name: "",
    feed_description: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const apiData = await fetchFeed();
        console.log(" Data received in FeedPage:", apiData);
        setTableData(apiData);
      } catch (error) {
        console.error(" Error Fetching Data:", error);
      }
    };
    getData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: { data: any }) {
        console.log("Parsed CSV Data:", results.data);
        setTableData((prev) => [...prev, ...results.data]);
      },
    });
  };

  const handleDownloadSample = () => {
    const sampleCsv = `feed_id,feed_name,create_date,file_delta_percent_allow,quality_threshold,land_filename_pattern_compressed,land_filename_pattern_uncompressed,land_file_extension_pattern_compressed,land_file_extension_pattern_uncompressed,land_dir,raw_dir,glue_workflow_name,feed_description\n1,customer,2025-01-27,0,95,compressed_pattern,uncompressed_pattern,.csv,.txt,/land,/raw,glue_demo,Sample description`;

    const blob = new Blob([sampleCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_feed.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10 transition-all duration-300 shadow-lg">
        <div className="flex justify-end space-x-4 mb-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            ➕ Add Data
          </Button>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="fileUpload"
            className="border-white/20 text-white bg-white/5 hover:bg-white hover:text-black transition-all duration-300 px-4 py-2 rounded-md cursor-pointer"
          >
            📂 Upload CSV
          </label>
          <Button
            variant="outline"
            onClick={handleDownloadSample}
            className="border-white/20 text-white bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
          >
            ⬇️ Download Sample
          </Button>
        </div>
        <FeedTable tableData={tableData} />
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#000B2E] text-white border border-white/10 rounded-lg shadow-xl p-6 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Add New Feed
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            {Object.keys(newData).map((field) => (
              <div className="mb-4" key={field}>
                <label className="block font-semibold text-white mb-1">
                  {field.replace(/_/g, " ")}
                </label>
                <Input
                  type="text"
                  name={field}
                  value={newData[field as keyof NewFeedData]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  className="bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-white/20 text-white bg-white/10 hover:bg-white hover:text-black transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
