import { ethers } from "ethers";

/**
 * Generate CSV string from invoice data
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 * @returns {string} CSV formatted string
 */
const generateCSVContent = (invoice, fee = 0) => {
  if (!invoice) {
    throw new Error("Invoice is required");
  }

  const tokenSymbol = invoice.paymentToken?.symbol || "ETH";
  const invoiceId = invoice.id.toString().padStart(6, "0");
  const status = invoice.isCancelled
    ? "CANCELLED"
    : invoice.isPaid
    ? "PAID"
    : "UNPAID";

  const fromName =
    `${invoice.user?.fname || ""} ${invoice.user?.lname || ""}`.trim() || "N/A";
  const fromEmail = invoice.user?.email || "N/A";
  const fromAddress = invoice.user?.address || "N/A";
  const fromCity = invoice.user?.city || "";
  const fromCountry = invoice.user?.country || "";
  const fromPostal = invoice.user?.postalcode || "";

  const toName =
    `${invoice.client?.fname || ""} ${invoice.client?.lname || ""}`.trim() ||
    "N/A";
  const toEmail = invoice.client?.email || "N/A";
  const toAddress = invoice.client?.address || "N/A";
  const toCity = invoice.client?.city || "";
  const toCountry = invoice.client?.country || "";
  const toPostal = invoice.client?.postalcode || "";

  const issueDate = new Date(invoice.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const dueDate = new Date(invoice.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let networkFee;
  try {
    networkFee = ethers.formatUnits(fee);
  } catch {
    networkFee = "0";
  }

  const escapeCSV = (value) => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [];

  // Header row for items
  rows.push(
    [
      "InvoiceID",
      "Status",
      "IssueDate",
      "DueDate",
      "FromName",
      "FromEmail",
      "FromAddress",
      "FromCity",
      "FromCountry",
      "FromPostalCode",
      "ToName",
      "ToEmail",
      "ToAddress",
      "ToCity",
      "ToCountry",
      "ToPostalCode",
      "PaymentToken",
      "Item",
      "Quantity",
      "UnitPrice",
      "Discount",
      "Tax",
      "Amount",
      "Subtotal",
      "NetworkFee",
      "Currency",
    ].join(",")
  );

  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [];

  if (items.length === 0) {
    rows.push(
      [
        escapeCSV(invoiceId),
        escapeCSV(status),
        escapeCSV(issueDate),
        escapeCSV(dueDate),
        escapeCSV(fromName),
        escapeCSV(fromEmail),
        escapeCSV(fromAddress),
        escapeCSV(fromCity),
        escapeCSV(fromCountry),
        escapeCSV(fromPostal),
        escapeCSV(toName),
        escapeCSV(toEmail),
        escapeCSV(toAddress),
        escapeCSV(toCity),
        escapeCSV(toCountry),
        escapeCSV(toPostal),
        escapeCSV(tokenSymbol),
        "",
        "",
        "",
        "",
        "",
        "",
        escapeCSV(invoice.amountDue),
        escapeCSV(networkFee),
        escapeCSV(tokenSymbol),
      ].join(",")
    );
  } else {
    items.forEach((item) => {
      rows.push(
        [
          escapeCSV(invoiceId),
          escapeCSV(status),
          escapeCSV(issueDate),
          escapeCSV(dueDate),
          escapeCSV(fromName),
          escapeCSV(fromEmail),
          escapeCSV(fromAddress),
          escapeCSV(fromCity),
          escapeCSV(fromCountry),
          escapeCSV(fromPostal),
          escapeCSV(toName),
          escapeCSV(toEmail),
          escapeCSV(toAddress),
          escapeCSV(toCity),
          escapeCSV(toCountry),
          escapeCSV(toPostal),
          escapeCSV(tokenSymbol),
          escapeCSV(item.description || "N/A"),
          escapeCSV(item.qty || 0),
          escapeCSV(item.unitPrice || 0),
          escapeCSV(item.discount || "0"),
          escapeCSV(item.tax || "0%"),
          escapeCSV(item.amount || 0),
          escapeCSV(invoice.amountDue),
          escapeCSV(networkFee),
          escapeCSV(tokenSymbol),
        ].join(",")
      );
    });
  }

  return rows.join("\n");
};

/**
 * Generate and download CSV file for an invoice
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 */
export const downloadInvoiceCSV = (invoice, fee = 0) => {
  const csvContent = generateCSVContent(invoice, fee);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${invoice.id.toString().padStart(6, "0")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
