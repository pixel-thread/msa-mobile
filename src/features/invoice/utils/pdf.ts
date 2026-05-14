import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Invoice } from '../types/invoice.types';
import { formatCurrency, formatDate } from '@src/shared/utils/format';

export const generateInvoiceHtml = (invoice: Invoice) => {
  const allocationsHtml = invoice.allocations.map(alloc => `
    <tr>
      <td>${alloc.contributionPeriod?.month}/${alloc.contributionPeriod?.year}</td>
      <td>${formatCurrency(alloc.allocatedAmount, invoice.currency)}</td>
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; }
          .invoice-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; }
          .total { text-align: right; font-size: 1.2em; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice</h1>
        </div>
        <div class="invoice-details">
          <p><strong>Invoice ID:</strong> ${invoice.id}</p>
          <p><strong>Date:</strong> ${formatDate(invoice.paymentDate)}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
          <p><strong>Billed To:</strong> ${invoice.user?.name} (${invoice.user?.email})</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${allocationsHtml}
          </tbody>
        </table>
        <div class="total">
          <p>Total: ${formatCurrency(invoice.amount, invoice.currency)}</p>
        </div>
      </body>
    </html>
  `;
};

export const generateAndShareInvoicePdf = async (invoice: Invoice) => {
  try {
    const html = generateInvoiceHtml(invoice);
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
