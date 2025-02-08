"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"
import { motion } from "framer-motion"

export default function DDLChangesPage() {
  const [step, setStep] = useState("initial")
  const [schemaType, setSchemaType] = useState("")
  const [entryMethod, setEntryMethod] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [manualEntries, setManualEntries] = useState([{ name: "", type: "", is_PK: false }])
  const [file, setFile] = useState<File | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const handleConnect = async () => {
    try {
      const response = await fetch("http://localhost:3001/connect", { method: "GET" })
      if (response.ok) {
        setIsConnected(true)
      } else {
        throw new Error("Failed to connect")
      }
    } catch (error) {
      console.error("Error connecting:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleCloseConnection = async () => {
    try {
      const response = await fetch("http://localhost:3001/close", { method: "POST" })
      if (response.ok) {
        setIsConnected(false)
        setStep("initial")
        setSchemaType("")
        setEntryMethod("")
        setManualEntries([{ name: "", type: "", is_PK: false }])
        setFile(null)
        setSuccessMessage("")
      } else {
        throw new Error("Failed to close connection")
      }
    } catch (error) {
      console.error("Error closing connection:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleManualEntryChange = (index: number, field: string, value: string | boolean) => {
    const newEntries = [...manualEntries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setManualEntries(newEntries)
  }

  const handleAddEntry = () => {
    setManualEntries([...manualEntries, { name: "", type: "", is_PK: false }])
  }

  const handleRemoveEntry = (index: number) => {
    const newEntries = manualEntries.filter((_, i) => i !== index)
    setManualEntries(newEntries)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const endpoint = schemaType === "new" ? "/new_schema" : "/update_schema"
      let data

      if (entryMethod === "file") {
        // Read file content and parse JSON
        const fileContent = await file!.text()
        data = JSON.parse(fileContent)
      } else {
        // Use manual entries
        data = { 
            "table_name": "loan_income",  // Pass the table name
            "columns": manualEntries 
          }
      }

      console.log("Sending data:", data);

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSuccessMessage("Schema changes submitted successfully!")
      } else {
        throw new Error("Failed to submit schema changes")
      }
    } catch (error) {
      console.error("Error submitting schema changes:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 font-display">
        Schema Changes
      </h1>

      {step === "initial" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            onClick={() => {
              setStep("connect")
              setSchemaType("new")
            }}
          >
            <h2 className="text-2xl font-bold text-blue-300 mb-2">Create New Schema</h2>
            <p className="text-white">Set up a new database schema from scratch.</p>
          </Card>
          <Card
            className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            onClick={() => {
              setStep("connect")
              setSchemaType("update")
            }}
          >
            <h2 className="text-2xl font-bold text-purple-300 mb-2">Update Existing Schema</h2>
            <p className="text-white">Modify an existing database schema.</p>
          </Card>
        </div>
      )}

      {step === "connect" && !isConnected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button
            onClick={handleConnect}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Connect to DB
          </Button>
        </motion.div>
      )}

      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <p className="text-green-300 font-bold">Connection Successful</p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => setEntryMethod("manual")}
              >
                <h2 className="text-2xl font-bold text-green-300 mb-2">Manual Entry</h2>
                <p className="text-white">Enter schema details manually.</p>
              </Card>
              <Card
                className="p-6 bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => setEntryMethod("file")}
              >
                <h2 className="text-2xl font-bold text-orange-300 mb-2">Upload JSON File</h2>
                <p className="text-white">Upload a JSON file with schema details.</p>
              </Card>
            </div>

          {entryMethod === "file" && (
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="text-white font-bold">
                Upload JSON File
              </Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".json"
                className="bg-white/5 border-white/10 text-white"
              />
              {file && <p className="text-green-300">File uploaded: {file.name}</p>}
            </div>
          )}

          {entryMethod === "manual" && (
            <div className="space-y-6">
              {manualEntries.map((entry, index) => (
                <Card key={index} className="p-4 bg-white/5 backdrop-blur-lg border-white/10">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`} className="text-white">
                        Name
                      </Label>
                      <Input
                        id={`name-${index}`}
                        value={entry.name}
                        onChange={(e) => handleManualEntryChange(index, "name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`type-${index}`} className="text-white">
                        Type
                      </Label>
                      <Input
                        id={`type-${index}`}
                        value={entry.type}
                        onChange={(e) => handleManualEntryChange(index, "type", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`is_PK-${index}`}
                        checked={entry.is_PK}
                        onCheckedChange={(checked) =>
                          handleManualEntryChange(index, "is_PK", checked as boolean)
                        }
                      />
                      <Label htmlFor={`is_PK-${index}`} className="text-white">
                        Is Primary Key
                      </Label>
                    </div>
                  </div>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-2 text-red-400 hover:text-red-300"
                      onClick={() => handleRemoveEntry(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={handleAddEntry}
                className="w-full border-dashed border-white/20 text-white hover:bg-white/5"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Entry
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center w-full">
            {(file || manualEntries.length > 0) && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Submitting..." : "Submit Changes"}
              </Button>
            )}

            {successMessage && <p className="text-green-300 font-bold">{successMessage}</p>}

            <div className="ml-auto">
              <Button 
                onClick={handleCloseConnection} 
                variant="destructive" 
                className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Close Connection
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

