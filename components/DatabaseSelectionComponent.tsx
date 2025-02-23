import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DatabaseData {
  url: string;
  user_name?: string;
  password?: string;
  token?: string;
  data_mount_point?: string;
  schema?: string;
  port?: string;
}

interface DatabaseSelectionProps {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  fetchAbcCreds: (value: string) => Promise<Partial<DatabaseData> | null>;
  formData: DatabaseData;
  setFormData: React.Dispatch<React.SetStateAction<DatabaseData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDatabaseSubmit: () => void;
  isDatabaseOpen: boolean;
  setIsDatabaseOpen: (value: boolean) => void;
}

/** Required fields for each database */
const databaseConfigs: Record<string, (keyof DatabaseData)[]> = {
  Snowflake: ["url", "user_name", "password", "data_mount_point"],
  "Ab Initio": ["url", "token", "data_mount_point"],
  PostgreSQL: ["url", "user_name", "password", "schema", "port"],
  MySQL: ["url", "user_name", "password", "port"],
};

const DatabaseSelectionComponent: React.FC<DatabaseSelectionProps> = ({
  selectedOption,
  setSelectedOption,

  fetchAbcCreds,
  formData,
  setFormData,
  handleChange,
  handleDatabaseSubmit,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDatabaseChange = async (value: string) => {
    setSelectedOption(value);

    try {
      console.log(`Fetching Database Credentials for: ${value}`);

      //Fetch only database credentials
      const credsData = await fetchAbcCreds(value);

      if (credsData) {
        console.log("✅ Database Credentials Found:", credsData);
        setFormData((prev) => ({
          ...prev,
          ...credsData, //Only update with database credentials
        }));
      } else {
        console.log("⚠️ No Database Credentials Found. Resetting fields.");
        const defaultValues = databaseConfigs[value]?.reduce(
          (acc, field) => ({ ...acc, [field]: "" }),
          {} as DatabaseData
        );
        setFormData(defaultValues);
      }
    } catch (error) {
      console.error("🚨 Error fetching database credentials:", error);
    }
  };

  return (
    <div className="container mx-auto bg-white/5 backdrop-blur-lg border-white/10 shadow-lg rounded py-3 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Database Selection
      </h2>

      {/* Database Selection Dropdown */}
      <Select onValueChange={handleDatabaseChange}>
        <SelectTrigger className="w-full bg-white/10 border border-white/20 text-white">
          <SelectValue placeholder="Choose a database" />
        </SelectTrigger>
        <SelectContent className="bg-[#000B2E] border border-white/20 text-white">
          {Object.keys(databaseConfigs).map((db) => (
            <SelectItem key={db} value={db}>
              {db}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedOption && (
        <>
          <h3 className="text-xl font-bold text-white mt-6">
            Selected Database: {selectedOption}
          </h3>

          {/* Dynamically Render Form Fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsConfirmOpen(true); //Open Confirmation Dialog
            }}
          >
            <Table className="border border-white/20 text-white mt-4">
              <TableBody>
                {databaseConfigs[selectedOption]?.map((key) => (
                  <TableRow key={key}>
                    <TableCell className="capitalize">
                      {key.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Input
                        type={key === "password" ? "password" : "text"}
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        placeholder={`Enter ${key.replace(/_/g, " ")}`}
                        className="bg-white/10 border border-white/20 text-white"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md"
              >
                Submit Database Configuration
              </Button>
            </div>
          </form>
        </>
      )}

      {/*Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-[#1E1E1E] text-white border border-white/20 rounded-lg p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <p className="text-white text-center">
            Are you sure all prior ABC Config will be lost for ever.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={() => {
                handleDatabaseSubmit(); //Submit on confirmation
                setIsConfirmOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseSelectionComponent;
