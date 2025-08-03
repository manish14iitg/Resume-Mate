interface FormData {
  name: string
  email: string
  phone: string
  position: string
  description: string
}

export const generatePDF = async (data: FormData): Promise<void> => {
  try {
    // Create a new window for PDF generation
    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      throw new Error("Unable to open print window. Please allow popups.")
    }

    // HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>User Details - ${data.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #ccc;
              padding: 40px;
              border-radius: 8px;
            }
            .field {
              margin-bottom: 20px;
              display: flex;
              align-items: flex-start;
            }
            .label {
              font-weight: bold;
              min-width: 150px;
              margin-right: 20px;
              color: #000;
            }
            .value {
              flex: 1;
              color: #666;
              word-wrap: break-word;
            }
            .description .value {
              white-space: pre-wrap;
            }
            h1 {
              text-align: center;
              color: #333;
              margin-bottom: 40px;
              border-bottom: 2px solid #eee;
              padding-bottom: 20px;
            }
            @media print {
              body { margin: 20px; }
              .container { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>User Details</h1>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            
            <div class="field">
              <div class="label">Phone Number:</div>
              <div class="value">${data.phone}</div>
            </div>
            
            <div class="field">
              <div class="label">Position:</div>
              <div class="value">${data.position}</div>
            </div>
            
            <div class="field description">
              <div class="label">Description:</div>
              <div class="value">${data.description}</div>
            </div>
          </div>
        </body>
      </html>
    `

    // Write content to the new window
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
