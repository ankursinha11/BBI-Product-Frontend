import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export interface VaultData {
  url: string;
  user_name?: string;
  password?: string;
  token?: string;
  data_mount_point?: string;
}

interface VaultComponentProps {
  status: string;
  handleStatusChange: (value: string) => void;
  isUpdatingStatus: boolean;
  formData: VaultData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVaultSubmit: () => void;
  validationMessage: string;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
  isVaultOpen: boolean; // ✅ Added
  setIsVaultOpen: (value: boolean) => void; // ✅ Added
}

const VaultComponent: React.FC<VaultComponentProps> = ({
  status,
  handleStatusChange,
  isUpdatingStatus,
  formData,
  handleChange,
  handleVaultSubmit,
  validationMessage,
  isSubmitted,
}) => {
  return (
    <div className="container mx-auto bg-white/5 backdrop-blur-lg border-white/10 shadow-lg rounded py-3 mb-6 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Vault Configuration
      </h2>

      {/* ✅ Status Selection */}
      <div className="mb-4">
        <h3 className="text-xl text-white mb-2">Select Status</h3>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full bg-white/10 border border-white/20 text-white p-2 rounded"
        >
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </select>
        {isUpdatingStatus && (
          <p className="text-gray-400 mt-2 text-center">Updating status...</p>
        )}
      </div>

      {/* ✅ Vault Configuration Form */}
      {status === "Enabled" && (
        <>
          <Table className="border border-white/20 text-white">
            <TableBody>
              {Object.entries(formData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="capitalize">
                    {key.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>
                    <Input
                      type={key === "password" ? "password" : "text"}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      className="bg-white/10 border border-white/20 text-white"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* ✅ Submit Button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleVaultSubmit}
              className="bg-green-500 text-white px-6 py-2 rounded-md"
            >
              Submit Vault Configuration
            </Button>
          </div>

          {/* ✅ Error Validation Popup */}
          {validationMessage && (
            <div className="text-red-500 text-center mt-2 font-semibold">
              ⚠️ {validationMessage}
            </div>
          )}

          {/* ✅ Success Confirmation Message */}
          {isSubmitted && (
            <div className="text-green-500 text-center mt-2 font-semibold">
              ✅ Submitted Successfully!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VaultComponent;
