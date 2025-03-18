"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Database, FileJson, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SourceTypeConfig {
  type: string
  config: {
    // API
    endpoint?: string
    method?: string
    // Database
    connectionString?: string
    query?: string
    // File
    path?: string
    format?: string
  }
}

interface SourceTypeSelectorProps {
  value: SourceTypeConfig
  onChange: (config: SourceTypeConfig) => void
  onNext: () => void
}

export function SourceTypeSelector({ value, onChange, onNext }: SourceTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState(value.type)
  const [config, setConfig] = useState(value.config)

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    onChange({ type, config: {} })
  }

  const handleConfigChange = (updates: any) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onChange({ type: selectedType, config: newConfig })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: "API", icon: Globe },
          { id: "Database", icon: Database },
          { id: "File", icon: FileJson },
        ].map(({ id, icon: Icon }) => (
          <motion.div
            key={id}
            onClick={() => handleTypeSelect(id)}
            className={`relative cursor-pointer rounded-xl p-6 ${
              selectedType === id
                ? "bg-[#1a2b66] border-blue-500/50"
                : "bg-[#0f1b4d] border-white/10 hover:bg-[#162252]"
            } border backdrop-blur-sm transition-all duration-300`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Icon className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-lg font-semibold text-white">{id}</span>
              {selectedType === id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4">
                  <Check className="h-5 w-5 text-green-400" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-white/10 bg-[#0f1b4d] p-6 space-y-4"
          >
            {selectedType === "API" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">API Endpoint</label>
                  <Input
                    value={config.endpoint || ""}
                    onChange={(e) => handleConfigChange({ endpoint: e.target.value })}
                    placeholder="https://api.example.com/data"
                    className="bg-[#162252] border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">HTTP Method</label>
                  <Select
                    value={config.method || "GET"}
                    onValueChange={(value) => handleConfigChange({ method: value })}
                  >
                    <SelectTrigger className="bg-[#162252] border-white/20">
                      <SelectValue placeholder="Select method" />
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
              </>
            )}

            {selectedType === "Database" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Connection String</label>
                  <Input
                    value={config.connectionString || ""}
                    onChange={(e) => handleConfigChange({ connectionString: e.target.value })}
                    placeholder="postgresql://user:password@localhost:5432/db"
                    className="bg-[#162252] border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">SQL Query</label>
                  <textarea
                    value={config.query || ""}
                    onChange={(e) => handleConfigChange({ query: e.target.value })}
                    placeholder="SELECT * FROM table"
                    className="w-full rounded-md border border-white/20 bg-[#162252] p-2 text-white placeholder-white/50"
                    rows={3}
                  />
                </div>
              </>
            )}

            {selectedType === "File" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">File Path</label>
                  <Input
                    value={config.path || ""}
                    onChange={(e) => handleConfigChange({ path: e.target.value })}
                    placeholder="/path/to/data/file.csv"
                    className="bg-[#162252] border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">File Format</label>
                  <Select
                    value={config.format || "CSV"}
                    onValueChange={(value) => handleConfigChange({ format: value })}
                  >
                    <SelectTrigger className="bg-[#162252] border-white/20">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {["CSV", "JSON", "XML", "PARQUET"].map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

