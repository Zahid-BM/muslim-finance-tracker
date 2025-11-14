import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { LOGO_BASE64 } from './logoBase64';

/**
 * Generate Zakat Calculation Certificate PDF
 * Fixed: Text compression & Missing zakat amount display
 */
export const generateZakatCertificate = async (data) => {
  const {
    certificateId,
    date,
    userName = 'ব্যবহারকারী',
    assets,
    liabilities,
    result,
    nisabInfo,
    language = 'bn'
  } = data;

  try {
    // Generate QR Code
    const qrCodeUrl = `https://muslim-finance-tracker.vercel.app/verify/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 150, margin: 1 });

    // Create HTML template with proper sizing
    const certificateHTML = `
      <div id="certificate-container" style="width: 794px; background: white; padding: 60px; font-family: 'Noto Sans Bengali', 'Hind Siliguri', 'Arial', sans-serif; box-sizing: border-box;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; display: flex; align-items: center; gap: 25px;">
          <img src="${LOGO_BASE64}" style="width: 85px; height: 85px; object-fit: contain; background: white; padding: 10px; border-radius: 12px; flex-shrink: 0;" />
          <div style="flex: 1;">
            <h1 style="color: white; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 0.5px;">Muslim Finance Tracker</h1>
            <h2 style="color: white; margin: 8px 0 0 0; font-size: 22px; font-weight: normal;">যাকাত হিসাব সার্টিফিকেট</h2>
            <p style="color: rgba(255,255,255,0.95); margin: 5px 0 0 0; font-size: 17px;">Zakat Calculation Certificate</p>
          </div>
        </div>

        <!-- Certificate Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px; padding: 12px; background: #f9fafb; border-radius: 10px;">
          <div style="font-size: 13px; color: #6b7280;">
            <strong style="color: #1f2937;">Certificate ID:</strong> ${certificateId}
          </div>
          <div style="font-size: 13px; color: #6b7280;">
            <strong style="color: #1f2937;">Date:</strong> ${date}
          </div>
        </div>
        <div style="margin-bottom: 25px; padding: 10px; background: #f9fafb; border-radius: 10px; font-size: 13px; color: #6b7280;">
          <strong style="color: #1f2937;">User:</strong> ${userName}
        </div>

        <!-- Calculation Summary -->
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #22c55e;">
          <h3 style="color: #16a34a; margin: 0 0 18px 0; font-size: 20px; font-weight: bold;">📊 হিসাবের সারসংক্ষেপ | CALCULATION SUMMARY</h3>
          
          <!-- Assets Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 18px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 12px 8px; text-align: left; font-weight: bold; color: #1f2937;">Asset Type | সম্পদের ধরন</th>
                <th style="padding: 12px 8px; text-align: right; font-weight: bold; color: #1f2937;">Amount | পরিমাণ</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(assets).filter(([_, value]) => value > 0).map(([key, value]) => {
                const labels = {
                  cash: 'নগদ টাকা | Cash',
                  bankBalance: 'ব্যাংক ব্যালেন্স | Bank Balance',
                  goldValue: 'সোনা (বিক্রয় মূল্য) | Gold',
                  silverValue: 'রুপা (বিক্রয় মূল্য) | Silver',
                  businessInventory: 'ব্যবসায়িক মাল | Business',
                  investments: 'বিনিয়োগ | Investments',
                  investmentProperties: 'বিনিয়োগ সম্পত্তি | Properties',
                  other: 'অন্যান্য | Other'
                };
                return `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 8px; color: #4b5563;">${labels[key] || key}</td>
                    <td style="padding: 10px 8px; text-align: right; color: #1f2937; font-weight: 600;">৳${formatNumber(value)}</td>
                  </tr>
                `;
              }).join('')}
              <tr style="border-top: 2px solid #d1d5db; background: #fafafa;">
                <td style="padding: 12px 8px; font-weight: bold; color: #1f2937;">মোট সম্পদ | Total Assets</td>
                <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #1f2937; font-size: 17px;">৳${formatNumber(result.totalAssets)}</td>
              </tr>
              ${result.deductibleLiabilities > 0 ? `
                <tr>
                  <td style="padding: 10px 8px; color: #dc2626;">বিয়োগ: দায়যোগ্য | Less: Liabilities</td>
                  <td style="padding: 10px 8px; text-align: right; color: #dc2626; font-weight: 600;">-৳${formatNumber(result.deductibleLiabilities)}</td>
                </tr>
              ` : ''}
              <tr style="border-top: 2px solid #d1d5db; background: #dcfce7;">
                <td style="padding: 12px 8px; font-weight: bold; color: #16a34a;">যাকাতযোগ্য সম্পদ | Zakatable</td>
                <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #16a34a; font-size: 17px;">৳${formatNumber(result.zakatableAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Nisab -->
        <div style="background: #fef3c7; padding: 18px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">📏 নিসাব (সর্বনিম্ন সীমা) | NISAB THRESHOLD</h3>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 15px; color: #78350f; line-height: 1.6;">
              <strong>রুপা ভিত্তিক নিসাব | Silver Nisab</strong><br/>
              <span style="font-size: 13px;">${nisabInfo || '(৫২.৫ ভরি রুপা × ১১.৬৬ গ্রাম)'}</span>
            </div>
            <div style="font-size: 22px; font-weight: bold; color: #92400e;">
              ৳${formatNumber(result.nisabThreshold)}
            </div>
          </div>
        </div>

        <!-- Result - FIXED: Show zakat amount properly -->
        ${result.isObligatory ? `
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 30px; border-radius: 15px; text-align: center; border: 4px solid #22c55e; margin-bottom: 25px;">
            <p style="color: #166534; font-size: 24px; font-weight: bold; margin: 0 0 10px 0; line-height: 1.4;">
              ✅ মাশাআল্লাহ! আপনার উপর যাকাত ফরজ
            </p>
            <p style="color: #15803d; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; letter-spacing: 0.5px;">
              ZAKAT IS OBLIGATORY
            </p>
            <div style="background: white; padding: 20px 30px; border-radius: 12px; display: block; margin: 0 auto; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="color: #15803d; font-size: 36px; font-weight: bold; margin: 0 0 10px 0; line-height: 1.3;">
                ৳${formatNumber(result.zakatDue)}
              </div>
              <div style="color: #4b5563; font-size: 13px; margin: 0; font-weight: 500;">
                (মোট সম্পদের ২.৫% | 2.5% of zakatable assets)
              </div>
            </div>
          </div>
        ` : `
          <div style="background: #fef2f2; padding: 25px; border-radius: 12px; text-align: center; border: 3px solid #dc2626; margin-bottom: 25px;">
            <p style="color: #991b1b; font-size: 22px; font-weight: bold; margin: 0 0 10px 0;">
              আপনার উপর যাকাত ফরজ নয়
            </p>
            <p style="color: #b91c1c; font-size: 17px; font-weight: 600; margin: 0 0 10px 0;">
              ZAKAT NOT OBLIGATORY
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              (সম্পদ নিসাবের কম | Assets below nisab threshold)
            </p>
          </div>
        `}

        <!-- Islamic Reference -->
        <div style="background: #eff6ff; padding: 18px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #3b82f6;">
          <h3 style="color: #1e40af; margin: 0 0 14px 0; font-size: 18px; font-weight: bold;">📚 ইসলামিক রেফারেন্স | ISLAMIC REFERENCE</h3>
          <ul style="margin: 0; padding-left: 22px; font-size: 13px; color: #4b5563; line-height: 2;">
            <li>হানাফী মাযহাব অনুযায়ী হিসাব | Calculated per Hanafi Madhab</li>
            <li>রুপার নিসাব ব্যবহৃত (সাধারণ মানুষের জন্য) | Silver nisab used</li>
            <li>সূত্র: দারুল উলূম দেওবন্দ, আল-কাউসার, মুফতি তাকী উসমানী</li>
            <li>Sources: Darul Uloom Deoband, Al-Kauthar, Mufti Taqi Usmani</li>
          </ul>
        </div>

        <!-- QR Code & Verification -->
        <div style="display: flex; align-items: center; gap: 18px; background: white; padding: 18px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #e5e7eb;">
          <img src="${qrCodeDataUrl}" style="width: 85px; height: 85px; flex-shrink: 0;" />
          <div style="flex: 1; font-size: 12px; color: #4b5563; line-height: 1.6;">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #1f2937; font-size: 13px;">Scan to Verify</p>
            <p style="margin: 0 0 6px 0; word-break: break-all; font-size: 11px;">${qrCodeUrl}</p>
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Certificate ID: ${certificateId}</p>
          </div>
        </div>

        <!-- Disclaimer -->
        <div style="background: #fef3c7; padding: 14px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #fbbf24;">
          <p style="color: #92400e; font-size: 12px; font-weight: bold; margin: 0 0 8px 0;">⚠️ দাবিত্যাগ | DISCLAIMER</p>
          <p style="color: #78350f; font-size: 11px; line-height: 1.7; margin: 0;">
            এটি একটি হিসাবের রেফারেন্স মাত্র। BAJUS মূল্য (Nov 9, 2025) অনুযায়ী প্রস্তুত।
            This is a calculation reference based on BAJUS prices (Nov 9, 2025).
            চূড়ান্ত নিশ্চিতকরণের জন্য স্থানীয় আলেমদের সাথে যাচাই করুন।
            Please verify with local Islamic scholars for final confirmation.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 2px solid #e5e7eb; padding-top: 18px; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.8;">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #1f2937; font-size: 13px;">Muslim Finance Tracker</p>
          <p style="margin: 0 0 6px 0;">https://muslim-finance-tracker.vercel.app</p>
          <p style="margin: 0; font-size: 10px;">© 2025 Muslim Finance Tracker. All rights reserved.</p>
        </div>

      </div>
    `;

    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = certificateHTML;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Wait for fonts and images to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500)); // Extra wait for stability

    // Convert to canvas with better settings
    const canvas = await html2canvas(container.firstElementChild, {
      scale: 2.5, // Higher quality but not too much
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF with proper aspect ratio
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add image maintaining aspect ratio
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

    // Save
    const filename = `Zakat_Certificate_${date.replace(/[\s,]/g, '_')}_${certificateId}.pdf`;
    pdf.save(filename);

    return { success: true, filename };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Helper function
const formatNumber = (num) => {
  return new Intl.NumberFormat('bn-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export default generateZakatCertificate;
