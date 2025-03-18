"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FeedData {
  feed_id: string
  feed_name: string
  create_date: string
  file_delta_percent_allow: string
  quality_threshold: string
  land_filename_pattern_compressed?: string
  land_filename_pattern_uncompressed?: string
  land_file_extension_pattern_compressed?: string
  land_file_extension_pattern_uncompressed?: string
  land_dir?: string
  raw_dir: string
  glue_workflow_name?: string
  workflow_name?: string
  feed_description: string
  perform_min_max_validations?: string
  impose_datatypes?: string
  rename_columns?: string
  source_type?: string
}

// Default column headers to show when no data is available
const DEFAULT_COLUMNS = [
  "feed_id",
  "feed_name",
  "create_date",
  "file_delta_percent_allow",
  "quality_threshold",
  "raw_dir",
  "workflow_name",
  "feed_description",
  "source_type"
];

interface FeedTableProps {
  tableData: FeedData[]
}

export default function FeedTable({ tableData }: FeedTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof FeedData>("feed_id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof FeedData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get column headers - use data if available, otherwise use defaults
  const columnHeaders = tableData.length > 0 
    ? Object.keys(tableData[0]) 
    : DEFAULT_COLUMNS;

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) => 
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    ),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input
            placeholder="Search feeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white/50"
          />
        </div>
      </div>

      {/* Main table container with horizontal scroll */}
      <div className="rounded-lg border border-white/10">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Table>
            <TableHeader className="bg-white/5 sticky top-0">
              <TableRow>
                {columnHeaders.map((key) => (
                  <TableHead
                    key={key}
                    className="text-white font-semibold cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap px-4 py-3"
                    onClick={() => handleSort(key as keyof FeedData)}
                    style={{ 
                      minWidth: getColumnWidth(key),
                      maxWidth: key === 'feed_description' ? '300px' : 'auto'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{key.replace(/_/g, " ").toUpperCase()}</span>
                      {sortField === key && (
                        sortDirection === "asc" 
                          ? <SortAsc className="h-4 w-4 ml-2" /> 
                          : <SortDesc className="h-4 w-4 ml-2" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnHeaders.length} className="text-center py-8 text-white/50">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      No feed data available. Add data using the buttons above.
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {sortedData.map((row, index) => (
                    <motion.tr
                      key={row.feed_id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group"
                    >
                      {columnHeaders.map((key, i) => (
                        <TableCell
                          key={i}
                          className="border-b border-white/10 bg-white/5 group-hover:bg-white/10 transition-colors px-4 py-3"
                          style={{ 
                            minWidth: getColumnWidth(key),
                            maxWidth: key === 'feed_description' ? '300px' : 'auto'
                          }}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {row[key as keyof FeedData] || '-'}
                          </div>
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Helper message for scrolling if needed */}
      <div className="text-white/40 text-xs italic text-right">
        Scroll horizontally to view all columns
      </div>
    </div>
  )
}

// Helper function to determine appropriate column widths
function getColumnWidth(columnName: string): string {
  switch(columnName) {
    case 'feed_id':
      return '100px';
    case 'feed_name':
      return '150px';
    case 'create_date':
      return '150px';
    case 'feed_description':
      return '250px';
    case 'file_delta_percent_allow':
      return '180px';
    case 'quality_threshold':
      return '160px';
    case 'raw_dir':
      return '150px';
    case 'workflow_name':
    case 'glue_workflow_name':
      return '180px';
    case 'source_type':
      return '120px';
    case 'perform_min_max_validations':
    case 'impose_datatypes':
    case 'rename_columns':
      return '200px';
    default:
      return '150px';
  }
}