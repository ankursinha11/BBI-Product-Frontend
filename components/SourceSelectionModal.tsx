"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Database, FileJson, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export interface SourceConfig {
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

interface SourceSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (config: SourceConfig) => void
}

export function SourceSelectionModal({ isOpen, onClose, onComplete }: SourceSelectionModalProps) {
  const [selectedType, setSelectedType] = useState("")
  const [config, setConfig] = useState<SourceConfig["config"]>({})

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setConfig({})
  }

  const handleComplete = () => {
    if (!selectedType) return

    const sourceConfig: SourceConfig = {
      type: selectedType,
      config: config,
    }
    onComplete(sourceConfig)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#000B2E] border-0 p-0 rounded-xl max-w-3xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Select Source Type</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
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
                className="space-y-6"
              >
                {selectedType === "API" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-white">API Endpoint</label>
                      <Input
                        value={config.endpoint || ""}
                        onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                        placeholder="https://api.example.com/data"
                        className="bg-[#162252] border-white/20 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-white">HTTP Method</label>
                      <Select
                        value={config.method || "GET"}
                        onValueChange={(value) => setConfig({ ...config, method: value })}
                      >
                        <SelectTrigger className="bg-[#162252] border-white/20 h-12 text-white">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent className="top-16 left-[10.1rem]  bg-white w-52 relative">
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
                      <label className="text-lg font-semibold text-white">Connection String</label>
                      <Input
                        value={config.connectionString || ""}
                        onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
                        placeholder="postgresql://user:password@localhost:5432/db"
                        className="bg-[#162252] border-white/20 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-white">SQL Query</label>
                      <textarea
                        value={config.query || ""}
                        onChange={(e) => setConfig({ ...config, query: e.target.value })}
                        placeholder="SELECT * FROM Table"
                        className="w-full rounded-md border border-white/20 bg-[#162252] p-3 text-white placeholder-white/50 h-24 resize-none"
                      />
                    </div>
                  </>
                )}

                {selectedType === "File" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-white">File Path</label>
                      <Input
                        value={config.path || ""}
                        onChange={(e) => setConfig({ ...config, path: e.target.value })}
                        placeholder="/path/to/data/file.csv"
                        className="bg-[#162252] border-white/20 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-white">File Format</label>
                      <Select
                        value={config.format || "CSV"}
                        onValueChange={(value) => setConfig({ ...config, format: value })}
                      >
                        <SelectTrigger className="bg-[#162252] border-white/20 h-12 text-white relative">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent className="top-16 bg-white left-[10.1rem] w-52 relative">
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

                <div className="pt-4">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-12"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

