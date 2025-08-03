"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"

interface FormData {
  name: string
  email: string
  phone: string
  position: string
  description: string
}

export default function PreviewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState<string | null>(null) 

  

  

  const handleBack = () => {
    router.push("/form")
  }

  const handleDownload = async () => {
    if (!formData) return

    setIsDownloading(true)
    try {
        // Save the form data to the database
        const response = await fetch("https://resume-mate.onrender.com/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to save record to database")
        }

        const savedRecord = await response.json()
        console.log("Record saved to database:", savedRecord);

        // Generate and download the PDF
        await generatePDF(formData)
        alert("PDF generated and details saved!")
        router.push("/") // Optionally redirect to home page after saving and downloading
      } catch (error) {
        console.error("Error saving record or generating PDF:", error)
        alert("Failed to generate PDF and save details. Please try again.")
      } finally {
        setIsDownloading(false);
      }
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={handleBack} variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <Card className="border-2 border-gray-300">
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Name:</div>
                <div className="md:col-span-2 text-gray-600">{formData.name}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Email:</div>
                <div className="md:col-span-2 text-gray-600">{formData.email}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Phone Number:</div>
                <div className="md:col-span-2 text-gray-600">{formData.phone}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Position:</div>
                <div className="md:col-span-2 text-gray-600">{formData.position}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Description:</div>
                <div className="md:col-span-2 text-gray-600 whitespace-pre-wrap">{formData.description}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium min-w-[200px]"
          >
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </div>
  )
}
