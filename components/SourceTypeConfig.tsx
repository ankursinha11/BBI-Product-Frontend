"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Database, FileJson, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SourceTypeConfigProps {
  onSourceTypeChange: (type: string) => void
  sourceType: string
}

export function SourceTypeConfig({ onSourceTypeChange, sourceType }: SourceTypeConfigProps) {
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiMethod, setApiMethod] = useState("GET")
  const [dbConnection, setDbConnection] = useState("")
  const [dbQuery, setDbQuery] = useState("")
  const [filePath, setFilePath] = useState("")

  const sourceTypes = [
    { id: "api", label: "API", icon: Globe },
    { id: "database", label: "Database", icon: Database },
    { id: "file", label: "File", icon: FileJson },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {sourceTypes.map((type) => {
          const Icon = type.icon
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSourceTypeChange(type.id)}
            //   className={`relative cursor-pointer rounded-xl p-4 ${
            //     sourceType === type.id
            //       ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50"
            //       : "bg-white/5 border-white/10 hover:bg-white/10"
            //   } border backdrop-blur-sm transition-all duration-300`}
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-2">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <span className="font-semibold text-white">{type.label}</span>
                {sourceType === type.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4">
                    <Check className="h-5 w-5 text-green-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {sourceType === "api" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/data"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={apiMethod} onValueChange={setApiMethod}>
                <SelectTrigger className="bg-white/10 border-white/20">
                  <SelectValue placeholder="Select HTTP method" />
                </SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "DELETE"].map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {sourceType === "database" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="space-y-2">
              <Label htmlFor="connection">Connection String</Label>
              <Input
                id="connection"
                value={dbConnection}
                onChange={(e) => setDbConnection(e.target.value)}
                placeholder="postgresql://user:password@localhost:5432/db"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="query">SQL Query</Label>
              <textarea
                id="query"
                value={dbQuery}
                onChange={(e) => setDbQuery(e.target.value)}
                placeholder="SELECT * FROM table"
                className="w-full rounded-md border border-white/20 bg-white/10 p-2 text-white placeholder-white/50"
                rows={3}
              />
            </div>
          </motion.div>
        )}

        {sourceType === "file" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="space-y-2">
              <Label htmlFor="filepath">File Path</Label>
              <Input
                id="filepath"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="/path/to/data/file.csv"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6">
              <div className="text-center">
                <FileJson className="mx-auto h-12 w-12 text-white/50" />
                <div className="mt-4">
                  <Button variant="outline" className="border-white/20 text-white">
                    Choose File
                  </Button>
                </div>
                <p className="mt-2 text-sm text-white/50">Drag and drop or click to select a file</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

