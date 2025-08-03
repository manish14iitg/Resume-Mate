"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Briefcase, FileText, Eye, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generatePDF } from "@/lib/pdf-generator"

interface FormData {
  name: string
  email: string
  phone: string
  position: string
  description: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
}

export default function FormPage() {
  const router = useRouter()
  

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    description: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingRecord, setLoadingRecord] = useState(false) // New state for loading individual record

  

  

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleViewPDF = () => {
    if (validateForm()) {
      sessionStorage.setItem("pdfFormData", JSON.stringify(formData))
      router.push("/preview")
    }
  }

  const handleDownloadPDF = async () => {
    if (validateForm()) {
      setIsSubmitting(true)
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
        setIsSubmitting(false)
      }
    }
  }

  if (loadingRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading record details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Add Your details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <div className="relative">
                <img src={"/user.svg"} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 h-12 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <img src={"/mail.svg"} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. Johndoe@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 h-12 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <img src={"/phone-call.svg"} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. (220) 222 -20002"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`pl-10 h-12 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                Position
              </Label>
              <div className="relative">
                <img src={"/position.svg"} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="position"
                  type="text"
                  placeholder="e.g. Junior Front end Developer"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <div className="relative">
                <img src={"/file.svg"} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Textarea
                  id="description"
                  placeholder="e.g. Work experiences"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="pl-10 min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleViewPDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
              >
                <img src={"/view.svg"} className="w-5 h-5 mr-2" />
                View PDF
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
              >
                <img src={"/Download.svg"} className="w-5 h-5 mr-2" />
                {isSubmitting ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
