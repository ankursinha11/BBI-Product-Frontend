"use client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

const databaseFields: Record<string, Field[]> = {
  Snowflake: [
    { name: "account", label: "Account Name", type: "text", required: true },
    { name: "userName", label: "User Name", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "database", label: "Database", type: "text" },
    { name: "warehouse", label: "Warehouse", type: "text" },
  ],
  "Ab Initio": [
    { name: "gde_version", label: "GDE Version", type: "text" },
    { name: "license", label: "License Key", type: "text" },
  ],
  PostgreSQL: [
    { name: "host", label: "Host", type: "text", required: true },
    { name: "port", label: "Port", type: "number", required: true },
    { name: "userName", label: "User Name", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "database", label: "Database", type: "text" },
  ],
  MySQL: [
    { name: "host", label: "Host", type: "text", required: true },
    { name: "port", label: "Port", type: "number", required: true },
    { name: "userName", label: "User Name", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "database", label: "Database", type: "text" },
  ],
};

export default function ConfigureABCPage() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected Database:", selectedOption);
    console.log("Form Data Submitted:", formData);
  };

  const fields = databaseFields[selectedOption] || [];

  return (
    <div className="min-h-screen  from-[#000B2E] via-[#001959] to-[#000B2E] p-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
        Configure ABC
      </h1>
      <div className="container mx-auto  bg-white/5 backdrop-blur-lg border-white/10  transition-all duration-300 shadow-lg rounded py-3">
        {!selectedOption ? (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-white mb-6">
              Select a Database
            </h1>
            <Select onValueChange={setSelectedOption}>
              <SelectTrigger className="w-1/3 bg-white/10 border border-white/20 text-white">
                <SelectValue placeholder="Choose a database" />
              </SelectTrigger>
              <SelectContent className="bg-[#000B2E] border border-white/20 text-white">
                <SelectItem value="Snowflake">Snowflake</SelectItem>
                <SelectItem value="Ab Initio">Ab Initio</SelectItem>
                <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                <SelectItem value="MySQL">MySQL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Selected Database: {selectedOption}
            </h1>
            <form onSubmit={handleSubmit}>
              <Table className="border border-white/20 text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Input</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.name}>
                      <TableCell>{field.label}</TableCell>
                      <TableCell>
                        <Input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label}`}
                          className="bg-white/10 border border-white/20 text-white"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  Submit
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white bg-white/5 hover:bg-white hover:text-black"
                  onClick={() => setSelectedOption("")}
                >
                  Go Back
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
