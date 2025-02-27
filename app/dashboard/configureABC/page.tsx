"use client";

import React, { useState } from "react";
import { fetchAbcCreds } from "@/app/utils/fetchAbcCreds";
import { updateAbcCreds } from "@/app/utils/updateAbcCreds";
import DatabaseSelectionComponent from "@/components/DatabaseSelectionComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**Define Database Data Interface */
export interface DatabaseData {
  account?: string;
  user_name?: string;
  password?: string;
  database?: string;
  schema?: string;
  host?: string;
  port?: string;
}

export default function ConfigureABCPage() {
  /**State for Database Selection and Credentials */
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [databaseFormData, setDatabaseFormData] = useState<DatabaseData>({
    account: "",
    user_name: "",
    password: "",
    database: "",
    schema: "",
    host: "",
    port: "",
  });

  const [isDatabaseSubmitted, setIsDatabaseSubmitted] =
    useState<boolean>(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  /** Handle Database Fetch & Selection */
  const handleDatabaseSelect = async (dbName: string) => {
    console.log(`Fetching Database Credentials for: ${dbName}`);

    setSelectedOption(dbName); //Store selected database name

    //Fetch database credentials
    const dbCreds = await fetchAbcCreds(dbName);
    if (dbCreds?.data) {
      console.log("Database Credentials Found:", dbCreds.data);
      setDatabaseFormData(dbCreds.data);
    } else {
      console.log("No Database Credentials Found. Resetting fields.");
      resetDatabaseFields(dbName);
    }
  };

  /**Reset Fields Based on Selected Database */
  const resetDatabaseFields = (dbName: string) => {
    const defaultValues: DatabaseData = {
      account: "",
      user_name: "",
      password: "",
      database: "",
      schema: "",
      host: "",
      port: "",
    };

    if (dbName === "Snowflake") {
      setDatabaseFormData({
        account: "",
        user_name: "",
        password: "",
        database: "",
        schema: "",
      });
    } else if (dbName === "PostgreSQL" || dbName === "MySQL") {
      setDatabaseFormData({
        host: "",
        port: "",
        database: "",
        user_name: "",
        password: "",
      });
    } else {
      setDatabaseFormData(defaultValues);
    }
  };

  /**Handle Database Submission */
  const handleDatabaseSubmit = async () => {
    console.log("Submitting Database Configuration:", databaseFormData);

    // Ensure data is properly formatted before submission
    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(databaseFormData).map(([key, value]) => [
        key,
        String(value),
      ])
    );

    const success = await updateAbcCreds(selectedOption, formattedData);

    if (success) {
      console.log("Database Configuration updated successfully");
      setIsDatabaseSubmitted(true);
      setTimeout(() => setIsDatabaseSubmitted(false), 2000);
      setIsConfirmOpen(false);
    } else {
      console.error("Failed to update Database Configuration");
    }
  };

  return (
    <div className="min-h-screen from-[#000B2E] via-[#001959] to-[#000B2E] p-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
        Configure ABC
      </h1>

      {/* Display Validation Message */}
      {validationMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-md shadow-lg text-lg font-semibold">
            {validationMessage}
          </div>
        </div>
      )}

      {/*atabase Selection Component */}
      <DatabaseSelectionComponent
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        fetchAbcCreds={fetchAbcCreds}
        formData={databaseFormData}
        setFormData={setDatabaseFormData}
        handleChange={(e) =>
          setDatabaseFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        handleDatabaseSubmit={() => setIsConfirmOpen(true)}
        isDatabaseOpen={isDatabaseOpen}
        setIsDatabaseOpen={setIsDatabaseOpen}
      />

      {/*Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-[#1E1E1E] text-white border border-white/20 rounded-lg p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirm Database Configuration</DialogTitle>
          </DialogHeader>
          <p className="text-white text-center">
            Are you sure? This will overwrite the existing ABC configuration for{" "}
            <strong>{selectedOption}</strong>.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={handleDatabaseSubmit}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
