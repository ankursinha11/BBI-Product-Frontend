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

export interface EnvironmentData {
  environment_name: string;
  platform: string;
  intermediate_file_type?: string;
  intermediate_storage_type?: string;
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
}

interface EnvironmentSelectionProps {
  selectedEnvironment: EnvironmentData;
  setSelectedEnvironment: React.Dispatch<React.SetStateAction<EnvironmentData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

/** Required fields for each platform */
const platformConfigs: Record<string, (keyof EnvironmentData)[]> = {
  azure: [
    "account_url",
    "account_key",
    "sas_token",
    "connection_string",
    "role_based_auth",
    "service_principal_tenant_id",
    "service_principal_client_id",
    "service_principal_client_secret",
  ],
  aws: [
    "aws_access_key_id",
    "aws_secret_access_key",
    "region_name",
    "profile_name",
    "role_based_auth",
  ],
  snowflake: ["account", "user_name", "password", "database", "schema"],
  gcp: ["account"],
};

const EnvironmentSelectionComponent: React.FC<EnvironmentSelectionProps> = ({
  selectedEnvironment,
  setSelectedEnvironment,
  handleChange,
  handleSubmit,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handlePlatformChange = (platform: string) => {
    // Reset only platform-specific fields
    const newPlatformFields = platformConfigs[platform]?.reduce(
      (acc, field) => ({ ...acc, [field]: "" }),
      {}
    ) as Partial<EnvironmentData>;

    setSelectedEnvironment((prev) => ({
      environment_name: prev.environment_name,
      platform,
      ...newPlatformFields,
    }));
  };

  return (
    <div className="container mx-auto bg-white/5 backdrop-blur-lg border-white/10 shadow-lg rounded py-3 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Environment Selection
      </h2>

      {/* Environment Name Input */}
      <div className="mb-4">
        <label className="text-white font-semibold">Environment Name</label>
        <Input
          type="text"
          name="environment_name"
          value={selectedEnvironment.environment_name}
          onChange={handleChange}
          placeholder="Enter environment name"
          className="bg-white/10 border border-white/20 text-white"
        />
      </div>

      {/* Intermediate File Type Selection */}
      <div className="mb-4">
        <label className="text-white font-semibold">
          Intermediate File Type
        </label>
        <Select
          onValueChange={(value) =>
            setSelectedEnvironment((prev) => ({
              ...prev,
              intermediate_file_type: value,
            }))
          }
        >
          <SelectTrigger className="w-full bg-white/10 border border-white/20 text-white">
            <SelectValue placeholder="Select File Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#000B2E] border border-white/20 text-white">
            <SelectItem value="parquet">Parquet</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Intermediate Storage Type Selection */}
      <div className="mb-4">
        <label className="text-white font-semibold">
          Intermediate Storage Type
        </label>
        <Select
          onValueChange={(value) =>
            setSelectedEnvironment((prev) => ({
              ...prev,
              intermediate_storage_type: value,
            }))
          }
        >
          <SelectTrigger className="w-full bg-white/10 border border-white/20 text-white">
            <SelectValue placeholder="Select Storage Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#000B2E] border border-white/20 text-white">
            <SelectItem value="blob_storage">Blob Storage</SelectItem>
            <SelectItem value="s3">S3</SelectItem>
            <SelectItem value="gcs">GCS</SelectItem>
            <SelectItem value="linux">Linux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform Selection Dropdown */}
      <label className="text-white font-semibold">Enviornment Type</label>
      <Select onValueChange={handlePlatformChange}>
        <SelectTrigger className="w-full bg-white/10 border border-white/20 text-white">
          <SelectValue placeholder="Choose a platform" />
        </SelectTrigger>
        <SelectContent className="bg-[#000B2E] border border-white/20 text-white">
          {Object.keys(platformConfigs).map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedEnvironment.platform && (
        <>
          <h3 className="text-xl font-bold text-white mt-6">
            Selected Platform: {selectedEnvironment.platform}
          </h3>

          {/* Dynamically Render Form Fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsConfirmOpen(true);
            }}
          >
            <Table className="border border-white/20 text-white mt-4">
              <TableBody>
                {platformConfigs[selectedEnvironment.platform]?.map((key) => (
                  <TableRow key={key}>
                    <TableCell className="capitalize">
                      {key.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      {key === "role_based_auth" ? (
                        <input
                          type="checkbox"
                          name={key}
                          checked={!!selectedEnvironment[key]}
                          onChange={(e) =>
                            setSelectedEnvironment((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 accent-blue-500"
                        />
                      ) : (
                        <Input
                          type={
                            key.includes("password") ||
                            key.includes("key") ||
                            key.includes("secret")
                              ? "password"
                              : "text"
                          }
                          name={key}
                          value={selectedEnvironment[key] ?? ""}
                          onChange={handleChange}
                          placeholder={`Enter ${key.replace(/_/g, " ")}`}
                          className="bg-white/10 border border-white/20 text-white"
                        />
                      )}
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
                Submit Environment Configuration
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
            Are you sure you want to submit this environment configuration?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
              onClick={() => handleSubmit()}
            >
              Submit Environment Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnvironmentSelectionComponent;
