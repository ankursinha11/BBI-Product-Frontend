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

/** Define Interface for Database Data */
export interface DatabaseData {
  account?: string;
  user_name?: string;
  password?: string;
  database?: string;
  schema?: string;
  host?: string;
  port?: string;
}

interface DatabaseSelectionProps {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  fetchAbcCreds: (dbName: string) => Promise<{ data: DatabaseData } | null>;
  formData: DatabaseData;
  setFormData: React.Dispatch<React.SetStateAction<DatabaseData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDatabaseSubmit: () => void;
  isDatabaseOpen: boolean;
  setIsDatabaseOpen: (value: boolean) => void;
}

/**Required Fields for Each Database */
const databaseConfigs: Record<string, (keyof DatabaseData)[]> = {
  Snowflake: ["account", "user_name", "password", "database", "schema"],
  PostgreSQL: ["host", "port", "database", "user_name", "password"],
  MySQL: ["host", "port", "database", "user_name", "password"],
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

  /**Fetch Database Credentials on Selection */
  const handleDatabaseChange = async (dbName: string) => {
    console.log(`📡 Fetching Database Credentials for: ${dbName}`);
    setSelectedOption(dbName);

    try {
      //Fetch database credentials only
      const credsData = await fetchAbcCreds(dbName);

      if (credsData?.data) {
        console.log("✅ Database Credentials Found:", credsData.data);
        setFormData((prev) => ({
          ...prev,
          ...credsData.data, // Update only database-specific fields
        }));
      } else {
        console.log("⚠️ No Database Credentials Found. Resetting fields.");
        const defaultValues = databaseConfigs[dbName]?.reduce(
          (acc, field) => ({ ...acc, [field]: "" }),
          {} as DatabaseData
        );
        setFormData(defaultValues);
      }
    } catch (error) {
      console.error("Error fetching database credentials:", error);
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

          {/* Render Dynamic Form Fields Based on Database Type */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsConfirmOpen(true); // Open Confirmation Dialog
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
            Are you sure? All prior ABC Config will be lost forever.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={() => {
                handleDatabaseSubmit(); // ubmit on confirmation
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
