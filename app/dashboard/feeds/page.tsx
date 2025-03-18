"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchFeed } from "../../utils/fetchFeed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FeedTable from "@/components/FeedTable"
import Papa from "papaparse"
import { SourceTypeSelector } from "@/components/SourceTypeSelector"
import { SourceSelectionModal } from "@/components/SourceSelectionModal"

// Define SourceConfig type
interface SourceConfig {
  type: string
  config: any
}
import { Upload, Download, Plus, Database, Globe, FileJson } from "lucide-react"

interface NewFeedData {
  feed_id: string
  feed_name: string
  create_date: string
  file_delta_percent_allow: string
  perform_min_max_validations: string
  impose_datatypes: string
  quality_threshold: string
  rename_columns: string
  source_type: string
  raw_dir: string
  workflow_name: string
  feed_description: string
}

export default function FeedPage() {
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false)
  const [sourceConfig, setSourceConfig] = useState<SourceConfig | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState<any[]>([])
  const [newData, setNewData] = useState<NewFeedData>({
    feed_id: "",
    feed_name: "",
    create_date: new Date().toISOString().split("T")[0],
    file_delta_percent_allow: "",
    perform_min_max_validations: "false",
    impose_datatypes: "false",
    quality_threshold: "",
    rename_columns: "false",
    source_type: "",
    raw_dir: "",
    workflow_name: "",
    feed_description: "",
  })

  useEffect(() => {
    const getData = async () => {
      try {
        const apiData = await fetchFeed()
        setTableData(apiData)
      } catch (error) {
        console.error("Error Fetching Data:", error)
      }
    }
    getData()
    
    // Apply 80% zoom to the entire layout
    document.body.style.zoom = "100%"
    // Ensure the background color is consistent
    document.documentElement.style.backgroundColor = "#000B2E"
    document.body.style.backgroundColor = "#000B2E"
    document.body.style.margin = "0"
    document.body.style.padding = "0"
    document.body.style.minHeight = "100vh"
    document.body.style.overflow = "hidden"
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewData({ ...newData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewData({ ...newData, [field]: value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: any }) => {
        setTableData((prev) => [...prev, ...results.data])
      },
    })
  }

  const handleDownloadSample = () => {
    const sampleCsv = `feed_id,feed_name,create_date,file_delta_percent_allow,perform_min_max_validations,impose_datatypes,quality_threshold,rename_columns,source_type,raw_dir,workflow_name,feed_description\n1,customer,${new Date().toISOString().split("T")[0]},10,true,true,95,true,API,/raw,workflow_demo,Sample description`

    const blob = new Blob([sampleCsv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_feed.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleSourceComplete = (config: SourceConfig) => {
    setSourceConfig(config)
    setIsSourceModalOpen(false)
    // Optionally open the main form modal with pre-filled source type
    setNewData((prev) => ({
      ...prev,
      source_type: config.type,
    }))
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your submit logic here
    setTableData([...tableData, newData])
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-[#000B2E] text-white overflow-hidden">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Feed Management
          </motion.h1>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-2">
          <Button
              onClick={() => setIsSourceModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Select Source
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r px-3 py-2 from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Data
            </Button>
            <input type="file" id="fileUpload" className="hidden" accept=".csv" onChange={handleFileUpload} />
            <label
              htmlFor="fileUpload"
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-normal transition-all duration-300 transform hover:scale-105 rounded-md cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2"/>
              Upload CSV
            </label>

            <Button
              onClick={handleDownloadSample}
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all duration-300 transform hover:scale-105 rounded-md"
            >
              <Download className="w-4 h-4" />
              Download Sample
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-md border border-white/10">
        <div className="w-full overflow-x-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FeedTable tableData={tableData} />
          </motion.div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#000B2E] text-white border border-white/10 rounded-lg shadow-xl backdrop-blur-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              Add New Feed
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Type Selection with Icons */}
              <div className="col-span-1 md:col-span-2 relative">
                <label className="block text-sm font-medium mb-2 ">Source Type</label>
                <Select value={newData.source_type} onValueChange={(value) => handleSelectChange("source_type", value)} >
                  <SelectTrigger className="bg-white/10 border-white/20 relative">
                    <SelectValue placeholder="Source Type"/>
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black shadow-md rounded-md border border-red-200 top-16 left-[7.1rem] w-64 absolute">
                    <SelectItem value="API" className="flex items-center">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-400" />
                        API
                      </div>
                    </SelectItem>
                    <SelectItem value="Database">
                      <div className="flex items-center">
                        <Database className="w-4 h-4 mr-2 text-green-400" />
                        Database
                      </div>
                    </SelectItem>
                    <SelectItem value="File">
                      <div className="flex items-center">
                        <FileJson className="w-4 h-4 mr-2 text-purple-400" />
                        File
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Other form fields */}
              {Object.entries(newData).map(([key, value]) => {
                if (key === "source_type") return null // Skip source_type as it's handled above

                if (["perform_min_max_validations"].includes(key)) {
                  return (
                    <div key={key}>
                      <label className="relative bg-white/10 border-white/20">
                        {key
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </label>
                      <Select value={value} onValueChange={(value) => handleSelectChange(key, value)}>
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black shadow-md rounded-md border border-red-200 top-16 left-[7.1rem] w-52 absolute">
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }

                if (["impose_datatypes", "rename_columns"].includes(key)) {
                  return (
                    <div key={key}>
                      <label className="relative bg-white/10 border-white/20">
                        {key
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </label>
                      <Select value={value} onValueChange={(value) => handleSelectChange(key, value)}>
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black shadow-md rounded-md border border-red-200 top-16 left-[10.1rem] w-52 relative">
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2">
                      {key
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </label>
                    <Input
                      type={key === "create_date" ? "date" : "text"}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      placeholder={`Enter ${key.split("_").join(" ")}`}
                    />
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <SourceSelectionModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onComplete={handleSourceComplete}
      />
    </div>
  )
}