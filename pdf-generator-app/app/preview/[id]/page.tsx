"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams  } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"

interface UserRecord {
  id: string
  name: string
  email: string
  phone: string
  position: string
  description: string
  createdAt: string
}

export default function PreviewByIdPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recordId = searchParams.get('id')
  const [record, setRecord] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (recordId) {
      console.log("record id", recordId);
      fetchRecord(recordId as string)
    }
  }, [recordId, router])

  useEffect(() => {
  const timeout = setTimeout(() => {
    if (loading) {
      setLoading(false)
      setError("Request timed out.")
    }
  }, 10000)

  return () => clearTimeout(timeout)
}, [loading])

  const fetchRecord = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://resume-mate.onrender.com/api/records/${id}`)
      if (!response.ok) {
        throw new Error("Record not found")
      }
      const data = await response.json()
      setRecord(data)
    } catch (err) {
      setError("Failed to load record")
      console.error("Error fetching record:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const handleDownload = async () => {
    if (!record) return

    setIsDownloading(true)
    try {
      await generatePDF({
        name: record.name,
        email: record.email,
        phone: record.phone,
        position: record.position,
        description: record.description,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading record...</p>
        </div>
      </div>
    )
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Record Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
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
                <div className="md:col-span-2 text-gray-600">{record.name}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Email:</div>
                <div className="md:col-span-2 text-gray-600">{record.email}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Phone Number:</div>
                <div className="md:col-span-2 text-gray-600">{record.phone}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Position:</div>
                <div className="md:col-span-2 text-gray-600">{record.position}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="font-semibold text-gray-900">Description:</div>
                <div className="md:col-span-2 text-gray-600 whitespace-pre-wrap">{record.description}</div>
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
