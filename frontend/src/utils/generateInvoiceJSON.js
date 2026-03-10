import { ethers } from "ethers";

/**
 * Generate structured JSON object from invoice data
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 * @returns {Object} Structured invoice data
 */
const generateJSONContent = (invoice, fee = 0) => {
  if (!invoice) {
    throw new Error("Invoice is required");
  }

  const tokenSymbol = invoice.paymentToken?.symbol || "ETH";

  let networkFee;
  try {
    networkFee = ethers.formatUnits(fee);
  } catch {
    networkFee = "0";
  }

  return {
    invoiceId: invoice.id.toString().padStart(6, "0"),
    status: invoice.isCancelled
      ? "CANCELLED"
      : invoice.isPaid
      ? "PAID"
      : "UNPAID",
    issueDate: new Date(invoice.issueDate).toISOString(),
    dueDate: new Date(invoice.dueDate).toISOString(),
    from: {
      name:
        `${invoice.user?.fname || ""} ${invoice.user?.lname || ""}`.trim() ||
        null,
      email: invoice.user?.email || null,
      address: invoice.user?.address || null,
      city: invoice.user?.city || null,
      country: invoice.user?.country || null,
      postalCode: invoice.user?.postalcode || null,
    },
    billTo: {
      name:
        `${invoice.client?.fname || ""} ${invoice.client?.lname || ""}`.trim() ||
        null,
      email: invoice.client?.email || null,
      address: invoice.client?.address || null,
      city: invoice.client?.city || null,
      country: invoice.client?.country || null,
      postalCode: invoice.client?.postalcode || null,
    },
    paymentToken: {
      name: invoice.paymentToken?.name || "Ether",
      symbol: tokenSymbol,
      address: invoice.paymentToken?.address || null,
      decimals: invoice.paymentToken?.decimals || 18,
      chainId: invoice.paymentToken?.chainId || invoice.chainId || null,
    },
    items: (invoice.items || []).map((item) => ({
      description: item.description || "N/A",
      quantity: item.qty || 0,
      unitPrice: item.unitPrice || 0,
      discount: item.discount || "0",
      tax: item.tax || "0%",
      amount: item.amount || 0,
    })),
    subtotal: invoice.amountDue || "0",
    networkFee: networkFee,
    networkFeeCurrency: "ETH",
    currency: tokenSymbol,
  };
};

/**
 * Generate and download JSON file for an invoice
 * @param {Object} invoice - Invoice object
 * @param {string|BigInt} fee - Network fee (wei)
 */
export const downloadInvoiceJSON = (invoice, fee = 0) => {
  const jsonContent = generateJSONContent(invoice, fee);
  const jsonString = JSON.stringify(jsonContent, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${invoice.id.toString().padStart(6, "0")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
