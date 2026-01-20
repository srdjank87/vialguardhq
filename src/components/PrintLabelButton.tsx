"use client";

import { Printer } from "lucide-react";
import { format, addHours } from "date-fns";

interface VialLabelData {
  id: string;
  productName: string;
  productBrand: string;
  lotNumber: string;
  expirationDate: Date;
  openedDate?: Date | null;
  beyondUseHours?: number | null;
  remainingQuantity: string;
  initialQuantity: string;
  unitType: string;
}

interface PrintLabelButtonProps {
  vial: VialLabelData;
  size?: "sm" | "md";
  variant?: "ghost" | "outline";
}

export function PrintLabelButton({ vial, size = "sm", variant = "ghost" }: PrintLabelButtonProps) {
  const handlePrint = () => {
    // Calculate BUD expiry if applicable
    let budExpiry: Date | null = null;
    if (vial.openedDate && vial.beyondUseHours) {
      budExpiry = addHours(new Date(vial.openedDate), vial.beyondUseHours);
    }

    // Create print window
    const printWindow = window.open("", "_blank", "width=400,height=300");
    if (!printWindow) {
      alert("Please allow popups to print labels");
      return;
    }

    const labelHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vial Label - ${vial.lotNumber}</title>
          <style>
            @page {
              size: 2in 1in;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 9pt;
              padding: 4px;
              width: 2in;
              height: 1in;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1px solid #333;
              padding-bottom: 2px;
              margin-bottom: 2px;
            }
            .product-name {
              font-weight: bold;
              font-size: 10pt;
              line-height: 1.1;
            }
            .brand {
              font-size: 7pt;
              color: #666;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 8pt;
              line-height: 1.3;
            }
            .label {
              color: #666;
            }
            .value {
              font-weight: 600;
            }
            .lot {
              font-family: monospace;
              font-size: 9pt;
              font-weight: bold;
            }
            .expiry-warning {
              background: #000;
              color: #fff;
              padding: 1px 3px;
              font-size: 7pt;
              font-weight: bold;
            }
            .bud-section {
              background: #f0f0f0;
              padding: 2px 4px;
              margin-top: 2px;
              border: 1px solid #ccc;
            }
            .bud-title {
              font-size: 7pt;
              font-weight: bold;
              color: #c00;
            }
            .bud-time {
              font-size: 9pt;
              font-weight: bold;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="product-name">${vial.productName}</div>
              <div class="brand">${vial.productBrand}</div>
            </div>
          </div>

          <div class="info-row">
            <span class="label">LOT:</span>
            <span class="lot">${vial.lotNumber}</span>
          </div>

          <div class="info-row">
            <span class="label">EXP:</span>
            <span class="value">${format(new Date(vial.expirationDate), "MM/dd/yyyy")}</span>
          </div>

          <div class="info-row">
            <span class="label">QTY:</span>
            <span class="value">${vial.remainingQuantity}/${vial.initialQuantity} ${vial.unitType.toLowerCase()}</span>
          </div>

          ${budExpiry ? `
            <div class="bud-section">
              <div class="bud-title">USE BY (BUD):</div>
              <div class="bud-time">${format(budExpiry, "MM/dd/yyyy h:mm a")}</div>
            </div>
          ` : vial.openedDate ? `
            <div class="info-row">
              <span class="label">OPENED:</span>
              <span class="value">${format(new Date(vial.openedDate), "MM/dd/yyyy")}</span>
            </div>
          ` : ""}
        </body>
      </html>
    `;

    printWindow.document.write(labelHTML);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <button
      onClick={handlePrint}
      className={`btn btn-${size} ${variant === "ghost" ? "btn-ghost" : "btn-outline"}`}
      title="Print label"
    >
      <Printer className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      {size === "md" && <span>Print Label</span>}
    </button>
  );
}
