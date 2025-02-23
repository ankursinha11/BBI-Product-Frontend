"use client";

import React, { useState, useEffect } from "react";
import { fetchAbcVault } from "@/app/utils/fetchAbcVault";
import { updateAbcVault } from "@/app/utils/updateAbcVault";
import { fetchAbcCreds } from "@/app/utils/fetchAbcCreds";
import { updateAbcCreds } from "@/app/utils/updateAbcCreds";
import VaultComponent from "@/components/VaultComponent";
import DatabaseSelectionComponent from "@/components/DatabaseSelectionComponent";

/** ✅ VaultData Interface */
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
  /** ✅ Vault & Database States */
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [formData, setFormData] = useState<VaultData>({
    url: "",
    user_name: "",
    password: "",
    token: "",
    data_mount_point: "",
  });
  const [status, setStatus] = useState<string>("Disabled");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(true); // ✅ Ensure Vault is Open
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(true); // ✅ Ensure Database is Open

  /** ✅ Fetch Vault & Credentials When Database is Selected */
  useEffect(() => {
    if (!selectedOption) return;

    fetchAbcVault(selectedOption).then((data) => {
      if (data && data.url) {
        setFormData(data);
        setStatus("Enabled");
      } else {
        setFormData({
          url: "",
          user_name: "",
          password: "",
          token: "",
          data_mount_point: "",
        });
        setStatus("Disabled");
      }
    });

    fetchAbcCreds(selectedOption).then((data) => {
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      }
    });
  }, [selectedOption]);

  /** ✅ Handle Vault Status Change */
  const handleStatusChange = async (value: string) => {
    setStatus(value);
    setIsUpdatingStatus(true);

    const updatedData =
      value === "Enabled"
        ? { ...formData }
        : {
            url: "",
            user_name: "",
            password: "",
            token: "",
            data_mount_point: "",
          };

    const success = await updateAbcVault(selectedOption, updatedData);
    setIsUpdatingStatus(false);

    if (success) {
      console.log(`Vault status updated to: ${value}`);
      setFormData(updatedData);
    } else {
      console.error("Failed to update vault status");
    }
  };

  /** ✅ Handle Form Input Changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Handle Vault Submission */
  const handleVaultSubmit = async () => {
    console.log("Submitting Vault Configuration:", formData);

    if (!formData.url?.trim()) {
      alert("⚠️ URL is required.");
      return;
    }

    if (
      !(formData.user_name?.trim() && formData.password?.trim()) &&
      !formData.token?.trim()
    ) {
      alert("⚠️ Enter either Username & Password OR a Token.");
      return;
    }

    setValidationMessage("");

    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, String(value)])
    );

    const success = await updateAbcVault(selectedOption, formattedData);
    if (success) {
      console.log("Vault Configuration updated successfully");
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 2000);
    } else {
      console.error("Failed to update Vault Configuration");
    }
  };

  /** ✅ Handle Database Submission */
  const handleDatabaseSubmit = async () => {
    console.log("Submitting Database Configuration:", formData);

    setIsWarningOpen(false);

    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, String(value)])
    );

    const success =
      (await updateAbcVault(selectedOption, formattedData)) &&
      (await updateAbcCreds(selectedOption, formattedData));

    if (success) {
      console.log("Database Configuration updated successfully");
    } else {
      console.error("Failed to update Database Configuration");
    }
  };

  return (
    <div className="min-h-screen from-[#000B2E] via-[#001959] to-[#000B2E] p-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
        Configure ABC
      </h1>

      {/* ✅ Vault Component */}
      <VaultComponent
        status={status}
        handleStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
        formData={formData}
        handleChange={handleChange}
        handleVaultSubmit={handleVaultSubmit}
        validationMessage={validationMessage}
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        isVaultOpen={isVaultOpen}
        setIsVaultOpen={setIsVaultOpen}
      />

      <DatabaseSelectionComponent
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        fetchAbcVault={fetchAbcVault}
        fetchAbcCreds={fetchAbcCreds}
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleDatabaseSubmit={handleDatabaseSubmit}
        isDatabaseOpen={isDatabaseOpen}
        setIsDatabaseOpen={setIsDatabaseOpen}
      />
    </div>
  );
}
