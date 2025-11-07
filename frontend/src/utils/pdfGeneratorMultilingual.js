import jsPDF from 'jspdf';
import { LOGO_BASE64 } from './logoBase64';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

const translations = {
  en: {
    title: 'Muslim Finance Tracker', subtitle: 'Personal Finance Report', name: 'Name', email: 'Email',
    financialSummary: 'Financial Summary', category: 'Category', amount: 'Amount (BDT)',
    totalIncome: 'Total Income', totalExpense: 'Total Expense', currentBalance: 'Current Balance',
    monthlyIncome: 'Monthly Income', monthlyExpense: 'Monthly Expense', monthlySavings: 'Monthly Savings',
    transactionHistory: 'Transaction History (Recent 8)', date: 'Date', type: 'Type', income: 'Income',
    expense: 'Expense', description: 'Description', loanDetails: 'Loan Details', loanType: 'Type',
    person: 'Person', remaining: 'Remaining', status: 'Status', given: 'Given', taken: 'Taken',
    paid: 'Paid', partial: 'Partial', pending: 'Pending',
    scanToVisit: 'Scan to Visit Website', pageOf: 'Page', of: 'of',
    generatedOn: 'Generated on', at: 'at', directVisit: 'Direct Visit',
    website: 'muslim-finance-tracker.vercel.app',
    tagline: 'Manage your finances with Islamic principles',
    copyright: '© 2024 Muslim Programmer. All rights reserved.'
  },
  bn: {
    title: 'মুসলিম ফাইন্যান্স ট্র্যাকার', subtitle: 'ব্যক্তিগত আর্থিক প্রতিবেদন', name: 'নাম', email: 'ইমেইল',
    financialSummary: 'আর্থিক সারসংক্ষেপ', category: 'বিষয়', amount: 'পরিমাণ (৳)',
    totalIncome: 'মোট আয়', totalExpense: 'মোট খরচ', currentBalance: 'বর্তমান ব্যালেন্স',
    monthlyIncome: 'মাসিক আয়', monthlyExpense: 'মাসিক খরচ', monthlySavings: 'মাসিক সঞ্চয়',
    transactionHistory: 'লেনদেনের ইতিহাস', date: 'তারিখ', type: 'ধরন', income: 'আয়',
    expense: 'খরচ', description: 'বিবরণ', loanDetails: 'ঋণের বিবরণ', loanType: 'ধরন',
    person: 'ব্যক্তি', remaining: 'বাকি', status: 'স্ট্যাটাস', given: 'দেওয়া', taken: 'নেওয়া',
    paid: 'পরিশোধিত', partial: 'আংশিক', pending: 'বকেয়া',
    scanToVisit: 'স্ক্যান করে ওয়েবসাইটে ভিজিট করুন', pageOf: 'পৃষ্ঠা', of: 'এর',
    generatedOn: 'তৈরির তারিখ', at: 'সময়', directVisit: 'সরাসরি ভিজিট করুন',
    website: 'muslim-finance-tracker.vercel.app',
    tagline: 'ইসলামী নীতিমালা অনুযায়ী আর্থিক ব্যবস্থাপনা',
    copyright: '© ২০২৪ মুসলিম প্রোগ্রামার। সর্বস্বত্ব সংরক্ষিত।'
  },
  ar: {
    title: 'متتبع المالية الإسلامية', subtitle: 'تقرير مالي شخصي', name: 'الاسم', email: 'البريد الإلكتروني',
    financialSummary: 'ملخص مالي', category: 'الفئة', amount: 'المبلغ (BDT)',
    totalIncome: 'إجمالي الدخل', totalExpense: 'إجمالي المصروفات', currentBalance: 'الرصيد الحالي',
    monthlyIncome: 'الدخل الشهري', monthlyExpense: 'المصروفات الشهرية', monthlySavings: 'الادخار الشهري',
    transactionHistory: 'سجل المعاملات (آخر 8)', date: 'التاريخ', type: 'النوع', income: 'دخل',
    expense: 'مصروف', description: 'الوصف', loanDetails: 'تفاصيل القروض', loanType: 'النوع',
    person: 'الشخص', remaining: 'المتبقي', status: 'الحالة', given: 'معطى', taken: 'مأخوذ',
    paid: 'مدفوع', partial: 'جزئي', pending: 'معلق',
    scanToVisit: 'امسح لزيارة الموقع', pageOf: 'صفحة', of: 'من',
    generatedOn: 'تم الإنشاء في', at: 'الساعة', directVisit: 'زيارة مباشرة',
    website: 'muslim-finance-tracker.vercel.app',
    tagline: 'إدارة أموالك وفق المبادئ الإسلامية',
    copyright: '© 2024 Muslim Programmer. جميع الحقوق محفوظة.'
  },
  hi: {
    title: 'मुस्लिम फाइनेंस ट्रैकर', subtitle: 'व्यक्तिगत वित्त रिपोर्ट', name: 'नाम', email: 'ईमेल',
    financialSummary: 'वित्तीय सारांश', category: 'श्रेणी', amount: 'राशि (BDT)',
    totalIncome: 'कुल आय', totalExpense: 'कुल व्यय', currentBalance: 'वर्तमान बैलेंस',
    monthlyIncome: 'मासिक आय', monthlyExpense: 'मासिक व्यय', monthlySavings: 'मासिक बचत',
    transactionHistory: 'लेन-देन इतिहास (हाल के 8)', date: 'तारीख', type: 'प्रकार', income: 'आय',
    expense: 'व्यय', description: 'विवरण', loanDetails: 'ऋण विवरण', loanType: 'प्रकार',
    person: 'व्यक्ति', remaining: 'शेष', status: 'स्थिति', given: 'दिया गया', taken: 'लिया गया',
    paid: 'चुकाया गया', partial: 'आंशिक', pending: 'लंबित',
    scanToVisit: 'वेबसाइट पर जाने के लिए स्कैन करें', pageOf: 'पृष्ठ', of: 'का',
    generatedOn: 'निर्माण तिथि', at: 'समय', directVisit: 'सीधे विजिट करें',
    website: 'muslim-finance-tracker.vercel.app',
    tagline: 'इस्लामी सिद्धांतों के साथ वित्त प्रबंधन',
    copyright: '© 2024 Muslim Programmer. सर्वाधिकार सुरक्षित।'
  },
  ur: {
    title: 'مسلم فنانس ٹریکر', subtitle: 'ذاتی مالی رپورٹ', name: 'نام', email: 'ای میل',
    financialSummary: 'مالی خلاصہ', category: 'زمرہ', amount: 'رقم (BDT)',
    totalIncome: 'کل آمدنی', totalExpense: 'کل اخراجات', currentBalance: 'موجودہ بیلنس',
    monthlyIncome: 'ماہانہ آمدنی', monthlyExpense: 'ماہانہ اخراجات', monthlySavings: 'ماہانہ بچت',
    transactionHistory: 'لین دین (حالیہ 8)', date: 'تاریخ', type: 'قسم', income: 'آمدنی',
    expense: 'خرچ', description: 'تفصیل', loanDetails: 'قرض کی تفصیلات', loanType: 'قسم',
    person: 'شخص', remaining: 'باقی', status: 'حالت', given: 'دیے گئے', taken: 'لیے گئے',
    paid: 'ادا شدہ', partial: 'جزوی', pending: 'زیر التواء',
    scanToVisit: 'ویب سائٹ دیکھنے کے لیے اسکین کریں', pageOf: 'صفحہ', of: 'کا',
    generatedOn: 'تیاری کی تاریخ', at: 'وقت', directVisit: 'براہ راست ملاحظہ کریں',
    website: 'muslim-finance-tracker.vercel.app',
    tagline: 'اسلامی اصولوں کے ساتھ مالی انتظام',
    copyright: '© 2024 Muslim Programmer. تمام حقوق محفوظ۔'
  }
};

const categoryTranslations = {
  en: { 'বেতন': 'Salary', 'ব্যবসা': 'Business', 'ফ্রিল্যান্সিং': 'Freelancing', 'খাবার': 'Food', 'যাতায়াত': 'Transport', 'বিল': 'Bills', 'শিক্ষা': 'Education', 'স্বাস্থ্য': 'Health', 'দান-সাদাকা': 'Charity', 'অন্যান্য': 'Other' },
  bn: { 'বেতন': 'বেতন', 'ব্যবসা': 'ব্যবসা', 'ফ্রিল্যান্সিং': 'ফ্রিল্যান্সিং', 'খাবার': 'খাবার', 'যাতায়াত': 'যাতায়াত', 'বিল': 'বিল', 'শিক্ষা': 'শিক্ষা', 'স্বাস্থ্য': 'স্বাস্থ্য', 'দান-সাদাকা': 'দান-সাদাকা', 'অন্যান্য': 'অন্যান্য' },
  ar: { 'বেতন': 'الراتب', 'ব্যবসা': 'العمل', 'ফ্রিল্যান্সিং': 'العمل الحر', 'খাবার': 'الطعام', 'যাতায়াত': 'النقل', 'বিল': 'الفواتير', 'শিক্ষা': 'التعليم', 'স্বাস্থ্য': 'الصحة', 'দান-সাদাকা': 'الصدقة', 'অন্যান্য': 'أخرى' },
  hi: { 'বেতন': 'वेतन', 'ব্যবসা': 'व্यवसाय', 'ফ্রিল্যান্সিং': 'फ्रीलांसिंग', 'খাবার': 'भोजन', 'যাতায়াত': 'यातायात', 'বিল': 'बिल', 'শিক্ষা': 'शिक्षा', 'স্বাস্থ্য': 'स्वास्थ्य', 'দান-সাদাকা': 'दान', 'অন্যান্য': 'अन्य' },
  ur: { 'বেতন': 'تنخواہ', 'ব্যবসা': 'کاروبار', 'ফ্রিল্যান্সিং': 'فری لانسنگ', 'খাবার': 'کھانا', 'যাতায়াত': 'آمدورفت', 'বিল': 'بل', 'শিক্ষা': 'تعلیم', 'স্বাস্থ্য': 'صحت', 'দান-সাদাকা': 'خیرات', 'অন্যান্য': 'دیگر' }
};

export const generateFinancialReport = async (userData, transactions, loans, stats, language = 'en') => {
  const t = translations[language] || translations.en;
  const categoryMap = categoryTranslations[language] || categoryTranslations.en;

  const now = new Date();
  const dateStr = now.toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  // Currency symbol based on language
  const currencySymbol = language === 'bn' ? '৳' : language === 'ar' ? 'ر.س' : language === 'hi' ? '₹' : language === 'ur' ? 'Rs' : '$';

  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL('https://muslim-finance-tracker.vercel.app', {
      width: 400, margin: 2, errorCorrectionLevel: 'H'
    });
  } catch (error) {
    console.error('QR generation failed:', error);
  }

  const contentElement = document.createElement('div');
  contentElement.style.cssText = 'position:fixed;left:-10000px;width:750px;padding:30px;background:white;font-family:Arial,sans-serif;';

  const financialRows = [
    { label: t.totalIncome, value: stats.totalIncome || 0, color: '#111827' },
    { label: t.totalExpense, value: stats.totalExpense || 0, color: '#ef4444' },
    { label: t.currentBalance, value: stats.balance || 0, color: '#22c55e' },
    { label: t.monthlyIncome, value: stats.monthlyIncome || 0, color: '#111827' },
    { label: t.monthlyExpense, value: stats.monthlyExpense || 0, color: '#ef4444' },
    { label: t.monthlySavings, value: (stats.monthlyIncome || 0) - (stats.monthlyExpense || 0), color: '#22c55e' }
  ];

  // Format transactions with proper locale dates
  const txRows = (transactions || []).map(tr => {
    const trDate = new Date(tr.date);
    return {
      date: trDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      }),
      type: tr.type || 'expense',
      typeLabel: tr.type === 'income' ? t.income : t.expense,
      category: categoryMap[tr.category] || tr.category || '-',
      amount: tr.amount || 0,
      description: tr.description || '-'
    };
  });

  let tablesHTML = `<section style="margin-bottom:30px;">
    <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;">${t.financialSummary}</h2>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#90ee90;">
          <th style="padding:14px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-size:15px;font-weight:600;">${t.category}</th>
          <th style="padding:14px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-size:15px;font-weight:600;">${t.amount}</th>
        </tr>
      </thead>
      <tbody>`;

  financialRows.forEach((row, i) => {
    const formattedValue = currencySymbol + ' ' + Number(row.value).toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US');
    tablesHTML += `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
      <td style="padding:14px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:center;vertical-align:middle;">${row.label}</td>
      <td style="padding:14px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;font-size:14px;font-weight:600;color:${row.color};">${formattedValue}</td>
    </tr>`;
  });

  tablesHTML += `</tbody></table></section>`;

  if (txRows.length > 0) {
    tablesHTML += `<section style="margin-bottom:30px;">
      <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;">${t.transactionHistory}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#90ee90;">
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.date}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.type}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.category}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.amount}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.description}</th>
          </tr>
        </thead>
        <tbody>`;

    txRows.forEach(tr => {
      const formattedAmount = currencySymbol + ' ' + Number(tr.amount).toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US');
      const typeColor = tr.type === 'income' ? '#22c55e' : '#ef4444';
      tablesHTML += `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;">${tr.date}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;color:${typeColor};font-weight:600;">${tr.typeLabel}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;">${tr.category}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;font-weight:600;">${formattedAmount}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;">${tr.description}</td>
      </tr>`;
    });

    tablesHTML += `</tbody></table></section>`;
  }

  if (loans && loans.length > 0) {
    tablesHTML += `<section>
      <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;">${t.loanDetails}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#90ee90;">
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.loanType}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.person}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.amount}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.remaining}</th>
            <th style="padding:12px 8px;text-align:center;vertical-align:middle;border-bottom:2px solid #d1d5db;font-weight:600;">${t.status}</th>
          </tr>
        </thead>
        <tbody>`;

    loans.slice(0, 5).forEach(ln => {
      const lnAmount = currencySymbol + ' ' + Number(ln.amount).toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US');
      const lnRemaining = currencySymbol + ' ' + Number(ln.remainingAmount || 0).toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US');
      const typeColor = ln.type === 'given' ? '#22c55e' : '#ef4444';
      const remainColor = ln.remainingAmount > 0 ? '#ef4444' : '#22c55e';
      const statusColor = ln.status === 'paid' ? '#22c55e' : (ln.status === 'partial' ? '#f59e0b' : '#ef4444');
      const statusLabel = ln.status === 'paid' ? t.paid : (ln.status === 'partial' ? t.partial : t.pending);
      const typeLabel = ln.type === 'given' ? t.given : t.taken;

      tablesHTML += `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;color:${typeColor};font-weight:600;">${typeLabel}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;">${ln.personName || '-'}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;font-weight:600;">${lnAmount}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;color:${remainColor};font-weight:600;">${lnRemaining}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:middle;color:${statusColor};font-weight:600;">${statusLabel}</td>
      </tr>`;
    });

    tablesHTML += `</tbody></table></section>`;
  }

  contentElement.innerHTML = `<div style="max-width:700px;margin:0 auto;">${tablesHTML}</div>`;
  document.body.appendChild(contentElement);

  try {
    await new Promise(r => setTimeout(r, 1000));

    const canvas = await html2canvas(contentElement, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 750
    });

    document.body.removeChild(contentElement);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = 210;
    const pdfH = 297;
    const headerH = 38;
    const footerH = 40;
    const contentH = pdfH - headerH - footerH - 3;

    const canvasHeightMM = (canvas.height * pdfW) / canvas.width;
    const totalPages = Math.ceil(canvasHeightMM / contentH);

    const addHeader = async (pageNum) => {
      const headerEl = document.createElement('div');
      headerEl.style.cssText = 'position:fixed;left:-10000px;width:794px;height:144px;background:white;padding:15px 20px;font-family:Arial,sans-serif;box-sizing:border-box;';
      headerEl.innerHTML = `
        <table style="width:100%;height:calc(100% - 22px);border-collapse:collapse;table-layout:fixed;">
          <tr>
            <td style="width:110px;vertical-align:middle;padding:0;">
              <div style="display:flex;align-items:flex-start;height:55px;">
                <img src="${LOGO_BASE64}" style="width:90px;height:auto;max-height:55px;display:block;" />
              </div>
            </td>
            <td style="vertical-align:middle;padding:0 0 0 15px;">
              <div style="display:flex;flex-direction:column;justify-content:center;">
                <div style="font-size:24px;font-weight:700;color:#2d3748;line-height:1.15;margin-bottom:3px;">${t.title}</div>
                <div style="font-size:12px;color:#6b7280;line-height:1.3;margin-bottom:3px;">${t.subtitle}</div>
                <div style="font-size:10px;color:#9ca3af;line-height:1.2;">${t.generatedOn}: ${dateStr} | ${t.at} ${timeStr}</div>
              </div>
            </td>
            <td style="text-align:right;vertical-align:middle;padding:0;font-size:11px;color:#a0aec0;line-height:1.6;width:220px;">
              <div><strong>${t.name}:</strong> ${userData.name || 'User'}</div>
              <div><strong>${t.email}:</strong> ${userData.email || ''}</div>
            </td>
          </tr>
        </table>
        <div style="position:absolute;bottom:5px;left:15px;right:15px;height:1px;background:#e2e8f0;"></div>
      `;
      document.body.appendChild(headerEl);
      
      await new Promise(r => setTimeout(r, 100));
      
      const headerCanvas = await html2canvas(headerEl, { 
        scale: 2.5, 
        backgroundColor: '#ffffff', 
        width: 794,
        windowWidth: 794
      });
      document.body.removeChild(headerEl);
      
      const headerImgData = headerCanvas.toDataURL('image/png');
      pdf.addImage(headerImgData, 'PNG', 0, 0, pdfW, headerH);
    };

    const addFooter = async (pageNum) => {
      const footerY = pdfH - footerH;
      
      const footerEl = document.createElement('div');
      footerEl.style.cssText = 'position:fixed;left:-10000px;width:794px;height:152px;background:white;padding:12px 20px;font-family:Arial,sans-serif;box-sizing:border-box;';
      footerEl.innerHTML = `
        <div style="border-top:1px solid #e2e8f0;padding:12px 0;height:100%;position:relative;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="vertical-align:top;padding-right:20px;padding-left:10px;">
                <div style="font-size:18px;font-weight:700;color:#7ed957;margin-bottom:5px;line-height:1.2;">${t.title}</div>
                <div style="font-size:11px;color:#6b7280;margin-bottom:7px;line-height:1.3;">${t.tagline}</div>
                <div style="font-size:10px;color:#a0aec0;margin-bottom:5px;line-height:1.3;">${t.directVisit}: ${t.website}</div>
                <div style="font-size:9px;color:#cbd5e0;line-height:1.2;">${t.copyright}</div>
              </td>
              ${qrCodeDataUrl ? `<td style="width:90px;text-align:center;vertical-align:top;padding-right:10px;">
                <img src="${qrCodeDataUrl}" style="width:75px;height:75px;border:1px solid #e2e8f0;display:block;margin:0 auto 5px auto;" />
                <div style="font-size:9px;color:#9ca3af;line-height:1.3;">${t.scanToVisit}</div>
              </td>` : ''}
            </tr>
          </table>
          <div style="position:absolute;bottom:8px;left:0;right:0;text-align:center;">
            <div style="font-size:10px;color:#6b7280;font-weight:600;">${t.pageOf} ${pageNum} ${t.of} ${totalPages}</div>
          </div>
        </div>
      `;
      document.body.appendChild(footerEl);
      
      await new Promise(r => setTimeout(r, 100));
      
      const footerCanvas = await html2canvas(footerEl, { 
        scale: 2.5, 
        backgroundColor: '#ffffff', 
        width: 794,
        windowWidth: 794
      });
      document.body.removeChild(footerEl);
      
      const footerImgData = footerCanvas.toDataURL('image/png');
      pdf.addImage(footerImgData, 'PNG', 0, footerY, pdfW, footerH);
    };

    for (let page = 1; page <= totalPages; page++) {
      if (page > 1) pdf.addPage();
      
      await addHeader(page);
      
      const srcY = (page - 1) * contentH * (canvas.width / pdfW);
      const srcH = Math.min(contentH * (canvas.width / pdfW), canvas.height - srcY);
      
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = canvas.width;
      tmpCanvas.height = srcH;
      const ctx = tmpCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
      
      const pageImgData = tmpCanvas.toDataURL('image/png');
      const imgH = (srcH * pdfW) / canvas.width;
      
      pdf.addImage(pageImgData, 'PNG', 0, headerH, pdfW, imgH);
      
      await addFooter(page);
    }

    return pdf;
  } catch (error) {
    if (document.body.contains(contentElement)) document.body.removeChild(contentElement);
    throw error;
  }
};
