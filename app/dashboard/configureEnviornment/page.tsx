"use client";

import React, { useState, useEffect } from "react";
import { fetchAbcVault } from "@/app/utils/fetchAbcVault";
import { updateAbcVault } from "@/app/utils/updateAbcVault";
import { fetchEnvironment } from "@/app/utils/fetchEnvironment";
import { updateEnvironment } from "@/app/utils/updateEnvironment";
import VaultComponent from "@/components/VaultComponent";
import EnvironmentSelectionComponent from "@/components/EnvironmentSelectionComponent";

/**VaultData Interface */
export interface VaultData {
  url: string;
  user_name?: string;
  password?: string;
  token?: string;
  data_mount_point?: string;
}

/**EnvironmentData Interface */
export interface EnvironmentData {
  environment_name: string;
  platform: string;
  account_url?: string;
  account_key?: string;
  sas_token?: string;
  connection_string?: string;
  role_based_auth?: boolean;
  service_principal_tenant_id?: string;
  service_principal_client_id?: string;
  service_principal_client_secret?: string;
  aws_access_key_id?: string;
  aws_secret_access_key?: string;
  region_name?: string;
  profile_name?: string;
  account?: string;
  user_name?: string;
  password?: string;
  database?: string;
  schema?: string;
  host?: string;
  port?: string;
}

export default function ConfigureEnvironmentPage() {
  /** ✅ Vault States */
  const [vaultFormData, setVaultFormData] = useState<VaultData>({
    url: "",
    user_name: "",
    password: "",
    token: "",
    data_mount_point: "",
  });

  const [vaultStatus, setVaultStatus] = useState<string>("Disabled");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isVaultSubmitted, setIsVaultSubmitted] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(true);

  /** Environment States */
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<EnvironmentData>({
      environment_name: "",
      platform: "",
    });

  /** Fetch Vault Credentials ONLY on Mount */
  useEffect(() => {
    console.log("Fetching Vault Configuration...");
    fetchAbcVault("default").then((response) => {
      if (response?.data) {
        console.log("Vault Data Found:", response.data);
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

    console.log("Fetching Environment Configuration...");
    fetchEnvironment("default").then((response) => {
      if (response?.data) {
        console.log("Environment Data Found:", response.data);
        setSelectedEnvironment(response.data);
      } else {
        console.log("⚠️ No Environment Data Found. Prompting for entry.");
        setSelectedEnvironment({
          environment_name: "",
          platform: "",
        });
      }
    });
  }, []);

  /** Handle Vault Status Change */
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

  /** Handle Vault Form Input Changes */
  const handleVaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVaultFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle Vault Submission */
  const handleVaultSubmit = async () => {
    console.log("Submitting Vault Configuration:", vaultFormData);
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

  /** Handle Environment Input Changes */
  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSelectedEnvironment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /** Handle Environment Submission */
  const handleEnvironmentSubmit = async () => {
    console.log("Submitting Environment Configuration:", selectedEnvironment);

    const { platform } = selectedEnvironment;

    /** Validation Rules for Different Platforms */
    if (platform === "azure") {
      const hasConnectionString = !!selectedEnvironment.connection_string;
      const hasAccountKey =
        !!selectedEnvironment.account_url && !!selectedEnvironment.account_key;
      const hasSasToken =
        !!selectedEnvironment.account_url && !!selectedEnvironment.sas_token;
      const hasRoleBasedAuth = !!selectedEnvironment.role_based_auth;
      const hasServicePrincipal =
        !!selectedEnvironment.service_principal_tenant_id &&
        !!selectedEnvironment.service_principal_client_id &&
        !!selectedEnvironment.service_principal_client_secret &&
        !!selectedEnvironment.account_url;

      if (
        !hasConnectionString &&
        !hasAccountKey &&
        !hasSasToken &&
        !hasRoleBasedAuth &&
        !hasServicePrincipal
      ) {
        alert(
          "⚠️ Provide either:\n- connection_string\n- (account_url & account_key)\n- (account_url & sas_token)\n- Enable role based access\n- (service_principal_tenant_id, service_principal_client_id, service_principal_client_secret, account_url)"
        );
        return;
      }
    }

    if (platform === "aws") {
      const hasRoleBasedAuth = !!selectedEnvironment.role_based_auth;
      const hasKeys =
        !!selectedEnvironment.aws_access_key_id &&
        !!selectedEnvironment.aws_secret_access_key;
      const hasProfileName = !!selectedEnvironment.profile_name;

      if (!hasRoleBasedAuth && !hasKeys && !hasProfileName) {
        alert(
          "⚠️ Provide either:\n- Enable role based authentication\n- (aws_access_key_id & aws_secret_access_key)\n- profile_name"
        );
        return;
      }
    }

    if (platform === "snowflake") {
      const hasRequiredFields =
        !!selectedEnvironment.account &&
        !!selectedEnvironment.user_name &&
        !!selectedEnvironment.password &&
        !!selectedEnvironment.database &&
        !!selectedEnvironment.schema;

      if (!hasRequiredFields) {
        alert(
          "⚠️ Provide all required Snowflake fields:\n- account\n- user_name\n- password\n- database\n- schema"
        );
        return;
      }
    }

    /** Format and Submit Data */
    const formattedData: Record<string, string> = Object.fromEntries(
      Object.entries(selectedEnvironment).map(([key, value]) => [
        key,
        typeof value === "boolean" ? String(value) : value ?? "Enter X",
      ])
    );

    const success = await updateEnvironment(
      selectedEnvironment.environment_name,
      formattedData
    );

    if (success) {
      console.log("Environment Configuration updated successfully");
      alert("Environment configuration saved!");
    } else {
      console.error("Failed to update Environment Configuration");
    }
  };

  return (
    <div className="min-h-screen from-[#000B2E] via-[#001959] to-[#000B2E] p-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 font-display">
        Configure Environment
      </h1>

      {/* Environment Selection Component */}
      <EnvironmentSelectionComponent
        selectedEnvironment={selectedEnvironment}
        setSelectedEnvironment={setSelectedEnvironment}
        handleChange={handleEnvironmentChange}
        handleSubmit={handleEnvironmentSubmit}
      />

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
    </div>
  );
}
