"use client";

import React, { useState, useEffect } from "react";
import { fetchAbcVault } from "@/app/utils/fetchAbcVault";
import { updateAbcVault } from "@/app/utils/updateAbcVault";
import { fetchAbcCreds } from "@/app/utils/fetchAbcCreds";
import { updateAbcCreds } from "@/app/utils/updateAbcCreds";
import VaultComponent from "@/components/VaultComponent";
import DatabaseSelectionComponent from "@/components/DatabaseSelectionComponent";

/** VaultData Interface */
export interface VaultData {
  url: string;
  user_name?: string;
  password?: string;
  token?: string;
  data_mount_point?: string;
  schema?: string;
  port?: string;
}

export default function ConfigureABCPage() {
  /** Vault & Database States */
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [vaultFormData, setVaultFormData] = useState<VaultData>({
    url: "",
    user_name: "",
    password: "",
    token: "",
    data_mount_point: "",
  });

  const [databaseFormData, setDatabaseFormData] = useState<VaultData>({
    url: "",
    user_name: "",
    password: "",
    schema: "",
    port: "",
  });

  const [vaultStatus, setVaultStatus] = useState<string>("Disabled");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isVaultSubmitted, setIsVaultSubmitted] = useState<boolean>(false);
  const [isDatabaseSubmitted, setIsDatabaseSubmitted] =
    useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(true);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(true);

  /** Fetch Vault Credentials ONLY on Mount */
  useEffect(() => {
    console.log("📡 Fetching Vault Configuration...");

    fetchAbcVault("default").then((response) => {
      if (response?.data) {
        console.log("✅ Vault Data Found:", response.data);
        setVaultFormData(response.data);
        setVaultStatus(response.data.enabled ? "Enabled" : "Disabled");
      } else {
        console.log("⚠️ No Vault Data Found. Resetting fields.");
        setVaultFormData({
          url: "",
          user_name: "",
          password: "",
          token: "",
          data_mount_point: "",
        });
        setVaultStatus("Disabled");
      }
    });
  }, []);

  /**  Handle Vault Status Change */
  const handleVaultStatusChange = (value: string) => {
    setVaultStatus(value);
    setIsUpdatingStatus(true);

    const updatedData =
      value === "Enabled"
        ? { ...vaultFormData }
        : {
            url: "",
            user_name: "",
            password: "",
            token: "",
            data_mount_point: "",
          };

    setVaultFormData(updatedData);
    setIsUpdatingStatus(false);
  };

  /**Handle Vault Form Input Changes */
  const handleVaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVaultFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle Vault Submission (AFTER Validation) */
  const handleVaultSubmit = async () => {
    console.log("🚀 Submitting Vault Configuration:", vaultFormData);

    // Validate before submission
    if (!vaultFormData.url?.trim()) {
      alert("⚠️ URL is required.");
      return;
    }

    if (
      !(vaultFormData.user_name?.trim() && vaultFormData.password?.trim()) &&
      !vaultFormData.token?.trim()
    ) {
      alert("⚠️ Enter either Username & Password OR a Token.");
      return;
    }

    setValidationMessage("");

    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(vaultFormData).map(([key, value]) => [key, String(value)])
    );

    const success = await updateAbcVault("default", formattedData);
    if (success) {
      console.log("Vault Configuration updated successfully");
      setIsVaultSubmitted(true);
      setTimeout(() => setIsVaultSubmitted(false), 2000);
    } else {
      console.error("Failed to update Vault Configuration");
    }
  };

  /** Handle Database Fetch & Selection */
  const handleDatabaseSelect = async (dbName: string) => {
    console.log(`📡 Fetching Database Credentials for: ${dbName}`);

    //Store selected database separately (DO NOT fetch Vault data here)
    setSelectedOption(dbName);

    try {
      const dbCreds = await fetchAbcCreds(dbName);
      if (dbCreds?.data) {
        console.log("Database Credentials Found:", dbCreds.data);

        // Ensure ONLY databaseFormData is updated (not vaultFormData)
        setDatabaseFormData(dbCreds.data);
      } else {
        console.log("No Database Credentials Found. Resetting fields.");
        setDatabaseFormData({
          url: "",
          user_name: "",
          password: "",
          schema: "",
          port: "",
        });
      }
    } catch (error) {
      console.error("Error fetching Database Credentials:", error);
    }
  };

  /** Handle Database Submission */
  const handleDatabaseSubmit = async () => {
    console.log("Submitting Database Configuration:", databaseFormData);

    // Ensure data is properly formatted before submission
    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(databaseFormData).map(([key, value]) => [
        key,
        String(value),
      ])
    );

    const success =
      (await updateAbcVault(selectedOption, formattedData)) &&
      (await updateAbcCreds(selectedOption, formattedData));

    if (success) {
      console.log("Database Configuration updated successfully");
      setIsDatabaseSubmitted(true);
      setTimeout(() => setIsDatabaseSubmitted(false), 2000);
    } else {
      console.error("Failed to update Database Configuration");
    }
  };

  return (
    <div className="min-h-screen from-[#000B2E] via-[#001959] to-[#000B2E] p-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
        Configure ABC
      </h1>

      {/*Display Validation Message */}
      {validationMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-md shadow-lg text-lg font-semibold">
            {validationMessage}
          </div>
        </div>
      )}

      {/* Vault Component */}
      <VaultComponent
        status={vaultStatus}
        handleStatusChange={handleVaultStatusChange}
        isUpdatingStatus={isUpdatingStatus}
        formData={vaultFormData}
        handleChange={handleVaultChange}
        handleVaultSubmit={handleVaultSubmit}
        validationMessage={validationMessage}
        isSubmitted={isVaultSubmitted}
        setIsSubmitted={setIsVaultSubmitted}
        isVaultOpen={isVaultOpen}
        setIsVaultOpen={setIsVaultOpen}
      />

      {/* Database Selection Component */}
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
        handleDatabaseSubmit={handleDatabaseSubmit}
        isDatabaseOpen={isDatabaseOpen}
        setIsDatabaseOpen={setIsDatabaseOpen}
      />
    </div>
  );
}
