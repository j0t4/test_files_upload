"use client"
import * as React from "react"
import { Check, ChevronsUpDown, Upload, Store, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"

const stores = [
  { value: "store1", label: "Store 1" },
  { value: "store2", label: "Store 2" },
  { value: "store3", label: "Store 3" },
  { value: "store4", label: "Store 4" },
  { value: "store5", label: "Store 5" },
]

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

function formatFileSize(bytes: number): string {
  console.log(bytes)
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface FileWithCustomName extends File {
  customName: string;
  size: number;
}

export default function FileUploadForm() {
  const [step, setStep] = React.useState(1)
  const [selectedStore, setSelectedStore] = React.useState("")
  const [selectedOption, setSelectedOption] = React.useState("")
  const [files, setFiles] = React.useState<FileWithCustomName[]>([])
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [packFiles, setPackFiles] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)


  const { toast } = useToast()

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      ...file,
      customName: file.name,
      size: file.size,
    })) as FileWithCustomName[]
    setFiles(prevFiles => [...prevFiles, ...droppedFiles])
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        ...file,
        customName: file.name,
        size: file.size,

      })) as FileWithCustomName[]
      setFiles(prevFiles => [...prevFiles, ...selectedFiles])
    }
  }

  const handleManualUpload = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFiles = [...files]
    newFiles[index].customName = e.target.value,
    // newfiles[index].size = files[index].size,
    setFiles(newFiles)
  }

  const finishEditing = () => {
    setEditingIndex(null)
  }

  const handleSubmit = () => {
    const selectedStoreLabel = stores.find(store => store.value === selectedStore)?.label
    const selectedOptionLabel = options.find(option => option.value === selectedOption)?.label
    console.log(">>>>on submit")
    toast({
      title: "Form Submitted",
      description: (  
        <div className="mt-2 space-y-2">
          <p>Selected Store: {selectedStoreLabel || "None"}</p>
          <p>Selected Option: {selectedOptionLabel || "None"}</p>
          <p>Files: {files.length} selected</p>
          {files.length > 1 && <p>Pack files: {packFiles ? "Yes" : "No"}</p>}
        </div>
      ),
      action: (
        <Button
          variant="outline"
          onClick={() => {
            setStep(1)
            setSelectedStore("")
            setSelectedOption("")
            setFiles([])
            setPackFiles(false)
          }}
        >
          OK
        </Button>
      ),
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Progress value={(step / 3) * 100} className="w-full" />
      
      <div className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Step 1: Select a Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <Card
                  key={store.value}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    selectedStore === store.value ? "border-primary bg-primary/5" : ""
                  )}
                  onClick={() => setSelectedStore(store.value)}
                >
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <Store className="w-6 h-6" />
                      <span className="font-medium">{store.label}</span>
                    </div>
                    {selectedStore === store.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Step 2: Choose an Option</h2>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Step 3: Upload Files</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files here, or use the button below to select files
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              multiple
            />
            <Button onClick={handleManualUpload} className="w-full">
              Select Files
            </Button>
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Selected Files:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex items-center space-x-2 overflow-hidden flex-grow">
                        {editingIndex === index ? (
                          <Input
                            value={file.customName}
                            onChange={(e) => handleNameChange(e, index)}
                            onBlur={finishEditing}
                            onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
                            className="text-sm"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="text-sm text-gray-600 truncate cursor-pointer"
                            onDoubleClick={() => startEditing(index)}
                            title="Double-click to edit filename"
                          >
                            {file.customName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          
                          {formatFileSize(file.size)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                {files.length > 1 && (
                  <div className="mt-4 flex items-center space-x-2">
                    <Checkbox
                      id="pack-files"
                      checked={packFiles}
                      onCheckedChange={(checked) => setPackFiles(checked as boolean)}
                    />
                    <label
                      htmlFor="pack-files"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pack files
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">Selected Store: {selectedStore ? stores.find(store => store.value === selectedStore)?.label : "None"}</p>
          <p className="text-sm font-medium">Selected Option: {selectedOption ? options.find(option => option.value === selectedOption)?.label : "None"}</p>
          <p className="text-sm font-medium">Files: {files.length} selected</p>
          {files.length > 1 && (
            <p className="text-sm font-medium">Pack files: {packFiles ? "Yes" : "No"}</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button onClick={prevStep} disabled={step === 1}>
            Previous
          </Button>
          <Button 
            onClick={step === 3 ? handleSubmit : nextStep} 
            disabled={(step === 1 && !selectedStore) || (step === 2 && !selectedOption)}
          >
            {step === 3 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
     
    </div>
  )
}