import jsPDF from 'jspdf';
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
    transactionHistory: 'লেনদেনের ইতিহাস (সর্বশেষ ৮টি)', date: 'তারিখ', type: 'ধরন', income: 'আয়',
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
    hour: '2-digit', minute: '2-digit', hour12: language !== 'ar'
  });

  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL('https://muslim-finance-tracker.vercel.app', {
      width: 400, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#000000', light: '#FFFFFF' }
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
  }

  const reportElement = document.createElement('div');
  reportElement.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;padding:30px;background:white;font-family:"Noto Sans Bengali","Noto Sans Arabic","Noto Sans Devanagari","Noto Nastaliq Urdu","Helvetica","Arial",sans-serif;box-sizing:border-box;';

  reportElement.innerHTML = `
    <div style="width:100%;background:white;color:#333;font-size:12px;line-height:1.5;">
      
      <div style="display:flex;align-items:center;margin-bottom:20px;border-bottom:3px solid #22c55e;padding-bottom:12px;">
        <div style="width:50px;height:50px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:15px;font-size:32px;flex-shrink:0;">🕌</div>
        <div style="flex:1;">
          <div style="font-size:22px;font-weight:bold;color:#22c55e;margin-bottom:4px;line-height:1.2;">${t.title}</div>
          <div style="font-size:13px;color:#666;font-weight:500;">${t.subtitle}</div>
        </div>
        <div style="text-align:${language === 'ar' || language === 'ur' ? 'left' : 'right'};font-size:10px;">
          <div style="margin-bottom:4px;"><strong>${t.name}:</strong> ${userData.name || 'User'}</div>
          <div><strong>${t.email}:</strong> ${userData.email || ''}</div>
        </div>
      </div>

      <div style="margin-bottom:18px;">
        <h2 style="color:#22c55e;border-left:4px solid #22c55e;padding-left:10px;margin-bottom:10px;font-size:16px;font-weight:bold;">${t.financialSummary}</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;font-size:11px;">
          <thead><tr style="background:linear-gradient(135deg,#22c55e,#16a34a);color:white;">
            <th style="padding:10px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.category}</th>
            <th style="padding:10px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.amount}</th>
          </tr></thead>
          <tbody>
            ${[
              { key: 'totalIncome', value: stats.totalIncome },
              { key: 'totalExpense', value: stats.totalExpense },
              { key: 'currentBalance', value: stats.balance },
              { key: 'monthlyIncome', value: stats.monthlyIncome },
              { key: 'monthlyExpense', value: stats.monthlyExpense },
              { key: 'monthlySavings', value: stats.monthlyIncome - stats.monthlyExpense }
            ].map((item, i) => `
              <tr style="${i % 2 === 0 ? 'background:#f8fafc;' : 'background:white;'}">
                <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;">${t[item.key]}</td>
                <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;font-weight:600;color:${item.key.includes('Expense') ? '#ef4444' : item.key.includes('Balance') || item.key.includes('Savings') ? '#22c55e' : '#333'};">
                  ${item.value.toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${transactions && transactions.length > 0 ? `
        <div style="margin-bottom:18px;">
          <h2 style="color:#22c55e;border-left:4px solid #22c55e;padding-left:10px;margin-bottom:10px;font-size:16px;font-weight:bold;">${t.transactionHistory}</h2>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;font-size:9px;">
            <thead><tr style="background:linear-gradient(135deg,#22c55e,#16a34a);color:white;">
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.date}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.type}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.category}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.amount}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.description}</th>
            </tr></thead>
            <tbody>
              ${transactions.slice(0, 8).map((tr, i) => {
                const cat = categoryMap[tr.category] || tr.category;
                return `<tr style="${i % 2 === 0 ? 'background:#f8fafc;' : 'background:white;'}">
                  <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;">${new Date(tr.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US')}</td>
                  <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;"><span style="color:${tr.type === 'income' ? '#22c55e' : '#ef4444'};font-weight:600;">${tr.type === 'income' ? t.income : t.expense}</span></td>
                  <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;">${cat}</td>
                  <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;font-weight:600;color:${tr.type === 'income' ? '#22c55e' : '#ef4444'};">${tr.amount.toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US')}</td>
                  <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;">${tr.description || '-'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${loans && loans.length > 0 ? `
        <div style="margin-bottom:40px;">
          <h2 style="color:#f97316;border-left:4px solid #f97316;padding-left:10px;margin-bottom:10px;font-size:16px;font-weight:bold;">${t.loanDetails}</h2>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;font-size:9px;">
            <thead><tr style="background:linear-gradient(135deg,#f97316,#ea580c);color:white;">
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.loanType}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.person}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.amount}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.remaining}</th>
              <th style="padding:8px;text-align:center;vertical-align:middle;border:1px solid #cbd5e0;font-weight:600;">${t.status}</th>
            </tr></thead>
            <tbody>
              ${loans.slice(0, 5).map((ln, i) => `<tr style="${i % 2 === 0 ? 'background:#f8fafc;' : 'background:white;'}">
                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;"><span style="color:${ln.type === 'given' ? '#22c55e' : '#ef4444'};font-weight:600;">${ln.type === 'given' ? t.given : t.taken}</span></td>
                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;">${ln.personName}</td>
                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;font-weight:600;">${ln.amount.toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US')}</td>
                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;font-weight:600;color:${ln.remainingAmount > 0 ? '#ef4444' : '#22c55e'};">${ln.remainingAmount.toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US')}</td>
                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;vertical-align:middle;"><span style="color:${ln.status === 'paid' ? '#22c55e' : ln.status === 'partial' ? '#f59e0b' : '#ef4444'};font-weight:600;">${ln.status === 'paid' ? t.paid : ln.status === 'partial' ? t.partial : t.pending}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <div style="border-top:2px solid #d1d5db;padding-top:20px;margin-top:30px;text-align:center;">
        ${qrCodeDataUrl ? `<div style="margin:0 auto 12px;display:inline-block;"><img src="${qrCodeDataUrl}" style="width:100px;height:100px;border:2px solid #333;border-radius:4px;display:block;" alt="QR"/></div>` : ''}
        <div style="font-size:10px;color:#374151;font-weight:600;margin-bottom:10px;">${t.scanToVisit}</div>
        <div style="font-size:9px;color:#6b7280;margin-bottom:12px;">${t.pageOf} 1 ${t.of} 1</div>
        <div style="font-size:9px;color:#6b7280;margin-bottom:10px;">${t.generatedOn} ${dateStr} ${t.at} ${timeStr}</div>
        <div style="font-size:10px;color:#374151;font-weight:600;margin-bottom:4px;">${t.directVisit}:</div>
        <div style="font-size:11px;color:#22c55e;font-weight:700;margin-bottom:12px;">${t.website}</div>
        <div style="font-size:9px;color:#6b7280;font-style:italic;margin-bottom:10px;">${t.tagline}</div>
        <div style="font-size:8px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:10px;">${t.copyright}</div>
      </div>

    </div>
  `;

  document.body.appendChild(reportElement);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const canvas = await html2canvas(reportElement, { scale: 2.5, useCORS: true, allowTaint: false, logging: false, width: 794, backgroundColor: '#fff', imageTimeout: 0 });
    document.body.removeChild(reportElement);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgW = 210, imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(canvas, 'PNG', 0, 0, imgW, imgH, '', 'FAST');
    return pdf;
  } catch (error) {
    if (document.body.contains(reportElement)) document.body.removeChild(reportElement);
    throw error;
  }
};
