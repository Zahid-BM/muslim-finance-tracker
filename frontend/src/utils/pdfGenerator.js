import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

export const generateFinancialReport = async (userData, transactions, loans, stats) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Generate QR Code
  const qrCodeDataUrl = await QRCode.toDataURL('https://muslim-finance-tracker.vercel.app', {
    width: 80,
    margin: 1
  });

  // Header Function
  const addHeader = () => {
    // Logo
    doc.setFontSize(24);
    doc.text('🕌', 14, 20);
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Muslim Finance Tracker', 30, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Personal Finance Report', 30, 27);
    
    // User Info - Right aligned properly
    doc.setFontSize(9);
    const userName = userData.name || 'User';
    const userEmail = userData.email || '';
    
    // Calculate text width to right-align
    const nameText = `Name: ${userName}`;
    const emailText = `Email: ${userEmail}`;
    
    const nameWidth = doc.getTextWidth(nameText);
    const emailWidth = doc.getTextWidth(emailText);
    
    doc.text(nameText, pageWidth - nameWidth - 14, 15);
    doc.text(emailText, pageWidth - emailWidth - 14, 20);
    
    // Line
    doc.setLineWidth(0.5);
    doc.line(14, 32, pageWidth - 14, 32);
  };

  // Footer Function
  const addFooter = (pageNum) => {
    const footerY = pageHeight - 20;
    
    // QR Code
    doc.addImage(qrCodeDataUrl, 'PNG', 14, footerY - 10, 20, 20);
    
    // Footer Text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Scan QR to visit website', 36, footerY);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 36, footerY + 5);
    doc.text('Muslim Programmer - All Rights Reserved', 36, footerY + 10);
    doc.text(`Page ${pageNum}`, pageWidth - 30, footerY + 5);
    
    // Line
    doc.setLineWidth(0.5);
    doc.line(14, footerY - 15, pageWidth - 14, footerY - 15);
  };

  let currentPage = 1;

  // Page 1: Summary
  addHeader();
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary', 14, 45);

  // Stats Table
  autoTable(doc, {
    startY: 55,
    head: [['Category', 'Amount (BDT)']],
    body: [
      ['Total Income', stats.totalIncome.toLocaleString('en-US')],
      ['Total Expense', stats.totalExpense.toLocaleString('en-US')],
      ['Balance', stats.balance.toLocaleString('en-US')],
      ['Monthly Income', stats.monthlyIncome.toLocaleString('en-US')],
      ['Monthly Expense', stats.monthlyExpense.toLocaleString('en-US')],
      ['Monthly Savings', (stats.monthlyIncome - stats.monthlyExpense).toLocaleString('en-US')]
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5, font: 'helvetica' }
  });

  addFooter(currentPage);

  // Page 2: Transactions
  if (transactions && transactions.length > 0) {
    doc.addPage();
    currentPage++;
    addHeader();
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction History', 14, 45);

    const transactionData = transactions.slice(0, 20).map(t => [
      new Date(t.date).toLocaleDateString('en-US'),
      t.type === 'income' ? 'Income' : 'Expense',
      t.category,
      t.amount.toLocaleString('en-US'),
      t.description || '-'
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Type', 'Category', 'Amount', 'Description']],
      body: transactionData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3, font: 'helvetica' },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 'auto' }
      }
    });

    addFooter(currentPage);
  }

  // Page 3: Loans
  if (loans && loans.length > 0) {
    doc.addPage();
    currentPage++;
    addHeader();
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Loan Details', 14, 45);

    const loanData = loans.map(l => [
      l.type === 'given' ? 'Given' : 'Taken',
      l.personName,
      l.amount.toLocaleString('en-US'),
      l.remainingAmount.toLocaleString('en-US'),
      l.status
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Type', 'Person', 'Amount', 'Remaining', 'Status']],
      body: loanData,
      theme: 'grid',
      headStyles: { fillColor: [251, 146, 60], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4, font: 'helvetica' }
    });

    addFooter(currentPage);
  }

  return doc;
};