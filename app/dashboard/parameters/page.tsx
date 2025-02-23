"use client";

import { useState, useEffect } from "react";
import { fetchParams } from "../../utils/fetchParams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ParamsTable from "@/components/ParamsTable";
import Papa from "papaparse";

interface ParamsData {
  parameters_id: string;
  parameter_name: string;
  parameter_value: string;
  parameter_type: string;
  feed_name: string;
  default_or_custom: string;
  batch_id: string;
  timestamp: string;
  override_parameter_value: string;
}

export default function ParamsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<ParamsData[]>([]);
  const [newParam, setNewParam] = useState<Omit<ParamsData, "parameters_id">>({
    parameter_name: "",
    parameter_value: "",
    parameter_type: "",
    feed_name: "",
    default_or_custom: "",
    batch_id: "",
    timestamp: "",
    override_parameter_value: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const apiData = await fetchParams();
        console.log("Params Data Received:", apiData);

        // ✅ Ensure the API response is an array
        if (!Array.isArray(apiData)) {
          console.error("🚨 API did not return an array. Response:", apiData);
          return;
        }

        setTableData(apiData);
      } catch (error) {
        console.error("Error Fetching Params Data:", error);
      }
    };

    getData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewParam({ ...newParam, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<ParamsData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed CSV Data:", results.data);
        if (Array.isArray(results.data)) {
          setTableData((prev) => [
            ...prev,
            ...results.data.filter((row) => row.parameters_id),
          ]);
        }
      },
    });
  };

  const handleDownloadSample = () => {
    const sampleCsv = `parameter_name,parameter_value,parameter_type,feed_name,default_or_custom,batch_id,timestamp,override_parameter_value\n sample_param,100,integer,feed1,default,001,2025-01-27T12:00:00Z,200`;

    const blob = new Blob([sampleCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_params.csv";
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
            ➕ Add Parameter
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
        <ParamsTable tableData={tableData} />
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#000B2E] text-white border border-white/10 rounded-lg shadow-xl p-6 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Add New Parameter
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            {Object.keys(newParam).map((field) => (
              <div className="mb-4" key={field}>
                <label className="block font-semibold text-white mb-1">
                  {field.replace(/_/g, " ")}
                </label>
                <Input
                  type="text"
                  name={field}
                  value={newParam[field as keyof typeof newParam]}
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
