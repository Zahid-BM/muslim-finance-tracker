# 🕌 Muslim Finance Tracker

**بسم الله الرحمن الرحيم**

> Manage your finances with authentic Islamic principles  
> Complete MERN stack SaaS application

---

## 📊 Project Status

**Progress:** 41.8/60 Steps Complete (69.7%)  
**Current Step:** 41.8 Complete ✅ → 42 (Auth & Premium System)
**Tech Stack:** MongoDB + Express + React + Node.js (MERN)  
**Last Updated:** 2025-11-16 (Step 41.8 Complete - API Routes Fixed)

---

## ✅ Completed Features (Steps 1-40)

### Phase 1-2: Foundation & Core (Steps 1-31)
- 🔐 **Authentication:** Firebase + MongoDB sync
- 💰 **Transactions:** Income/Expense with categories
- 📊 **Loans:** Given/Taken with payment tracking
- 📈 **Dashboard:** Real-time statistics & summaries
- 🔄 **CRUD Operations:** All working perfectly

### Phase 3: Reports & Multilingual (Steps 32-40)
- 📄 **PDF Reports:** Complete transaction history
- 🌍 **5 Languages:** বাংলা, English, العربية, हिन्दी, اردو
- 🎨 **Professional Design:** International standard layout
- 💱 **Localized:** Currency symbols (৳, ر.س, ₹, Rs, $)
- 📅 **Localized Dates:** Regional formatting
- 🔗 **QR Code:** Website verification
- 📑 **Multi-page:** Automatic page breaks with headers/footers

---



### ✅ Step 41: Enhanced Zakat Calculator + PDF Certificate - COMPLETE ✅
**Completed:** November 15, 2025 (Updated)

#### ✅ All Features Working:
**Backend:**
- ✅ bajusService.js - BAJUS gold/silver price integration
- ✅ zakatService.js - Hanafi madhab calculations (accurate)
- ✅ routes/zakat.js - API endpoints (bugs fixed)
- ✅ server.js - Routes properly mounted
- ✅ axios package installed

#### ✅ Step 41.7: UX Enhancement - COMPLETE ✅
**Completed:** November 15, 2025

**Features Added:**
1. **Toast Notification System:**
   - react-hot-toast@2.4.1 integration
   - Professional loading/success/error notifications
   - Bengali language support
   - Custom styling with gradient backgrounds
   - Auto-dismiss with configurable duration

2. **Result Modal Window:**
   - Opens automatically after calculation
   - Professional design with header/content/footer
   - Close button (×) in header
   - Dark overlay with backdrop blur
   - Smooth fade-in and slide-up animations
   - Responsive for mobile devices
   - Scrollable content area

3. **Enhanced Download Button:**
   - Loading state with animated spinner
   - Text changes: "📄 সার্টিফিকেট ডাউনলোড করুন" → "⏳ তৈরি হচ্ছে..."
   - Loading toast: "আপনার সার্টিফিকেট তৈরি হচ্ছে... দয়া করে অপেক্ষা করুন"
   - Success notification with gradient background
   - Button disabled during PDF generation
   - Professional error handling with helpful messages

4. **User Experience:**
   - Immediate feedback for all actions
   - Clear loading indicators
   - Success confirmations in Bengali
   - Professional animations
   - Prevents accidental double-clicks

**Technical:**
- New states: resultModal, downloadLoading
- Toast configurations for all variants
- Modal structure with sticky header/footer
- Proper async/await error handling
- No breaking changes to existing features

**Frontend:**
- ✅ EnhancedZakatCalculator component
- ✅ Asset input forms (8 categories: cash, bank, gold, silver, business, investments, properties, other)
- ✅ Liability deduction (necessary loans, unpaid bills)
- ✅ Accurate calculation logic (tested & verified)
- ✅ Islamic masail modals (10+ topics with authentic sources)
- ✅ Professional UI with full Bangla support
- ✅ Responsive design
- ✅ Console errors resolved

#### 📊 Accuracy Verified:
- **Nisab Calculation:** ৳109,207.56 (BAJUS silver ৳223/gram, Nov 9, 2025)
- **Test Case:** Cash ৳40k + Bank ৳40k + Gold ৳60k + Silver ৳15k = ৳155,000
- **Result:** "যাকাত ফরজ" ✅ | Zakat Due: ৳3,875 (2.5%) ✅

#### 🔄 Current Approach:
- Manual price updates (weekly/as needed)
- Clear "Last Updated" date displayed
- User directed to BAJUS website for latest prices
- International standard best practice

#### 🌍 International Scalability:
- Ready for country-based gold association links
- Architecture supports IP-based detection
- Multilingual foundation in place

#### API Endpoints:
- `GET /api/zakat/prices` - Current gold/silver prices
- `POST /api/zakat/calculate` - Calculate zakat with full accuracy

#### ✅ PDF Certificate - COMPLETED (November 15, 2025):
- ✅ Professional 4-page certificate with Islamic branding
- ✅ Perfect Bangla text rendering (html2canvas)
- ✅ Unique certificate ID (MFT-ZK-timestamp-random)
- ✅ QR code verification system
- ✅ Complete calculation breakdown table
- ✅ Islamic references (Quran, Hadith, Hanafi Fiqh)
- ✅ Footer fixed at bottom (no overlap)
- ✅ Disclaimer, Contact, Dua sections
- ✅ Price verification (country-specific)
- ✅ International standard layout

#### 🔜 Future Enhancements (Step 41.7):
1. **Loading States** - Button feedback during calculation/download
2. **Result Modal** - Better UX with modal window
3. **Toast Notifications** - Success/error feedback
2. **Country Detection** - IP-based gold association links
3. **Admin Panel** - Easy price updates without code editing
4. **Auto-scraping** - Daily BAJUS price updates (if legal)



### ✅ Step 41.8: Critical API Routes Fix - COMPLETED
**Completed:** November 16, 2025

**Critical Issues Fixed:**
- ✅ Dashboard 404 errors resolved
- ✅ Add operations working (Income, Expense, Loan)
- ✅ Reports page data loading fixed
- ✅ Missing /api prefix added to 5 files
- ✅ PDF generator optimized (41 MB → 500 KB)
- ✅ Blank pages removed from PDFs
- ✅ Dynamic page numbering fixed
- ✅ All loans shown (removed 5 limit)
- ✅ JPEG compression (better quality/size ratio)

**Files Fixed:**
- AddIncome.jsx, AddExpense.jsx, AddLoan.jsx
- Loans.jsx, Reports.jsx
- pdfGeneratorMultilingual.js

**Status:** ✅ FULLY COMPLETE & TESTED
**Progress:** 41/60 Steps (68%)
---


## 🚀 Next Steps (Steps 41-60)

### Phase 4: Islamic Features (Steps 41-45)
**Step 41 - Enhanced Zakat Calculator** ⚡ NEXT
- Nisab threshold (BAJUS for Bangladesh)
- Region-specific calculations (11.66g = 1 ভরি)
- Asset categories & liabilities
- Authentic masail (Deoband, Al-Kauthar, Mufti Taqi Usmani)
- PDF certificate generation

**Step 42 - SSL Commerce Integration** 💰
- Two separate accounts (Project vs Zakat)
- Donation gateway
- Receipt generation

**Steps 43-45:**
- Fitrah Calculator
- Qurbani Calculator  
- Hajj Financial Planner

### Phase 5: i18n & Localization (Steps 46-48)
**CRITICAL: Full Site Translation**
- Auto-detect user location (IP-based)
- Complete UI translation (all pages)
- RTL support (Arabic, Urdu)
- Language switcher
- Persistent language preference

**Supported Languages:**
1. 🇧🇩 বাংলা (Bengali) - Bangladesh
2. 🇬🇧 English - Global
3. 🇸🇦 العربية (Arabic) - Middle East
4. 🇮🇳 हिन्दी (Hindi) - India
5. 🇵🇰 اردو (Urdu) - Pakistan
6. 🇯🇵 日本語 (Japanese) - Japan (future)
7. 🇹🇷 Türkçe (Turkish) - Turkey (future)

### Phase 6: Advanced Features (Steps 49-55)
- Analytics dashboard
- Data export (CSV, Excel)
- Advanced search & filtering
- Recurring transactions
- Budget planner
- Subscription plans (SaaS monetization)

### Phase 7: Production (Steps 56-60)
- SEO optimization
- Performance tuning
- Security hardening
- Testing & QA
- Deployment

---

## 🌍 International Features

### Auto Language Detection
```javascript
// Detect user location → Set language automatically
Bangladesh → বাংলা
Saudi Arabia → العربية
India → हिन्दी
Pakistan → اردو
Others → English (default)
```

### Gold/Silver Price Integration
- **Bangladesh:** BAJUS (https://www.bajus.org)
- **International:** Region-specific gold associations
- Auto-show relevant price source

### Nisab Calculation
- **South Asia:** 11.66 gram = 1 ভরি
- **International:** Standard gram/ounce calculations

---

## 🎯 Tech Stack

### Backend
```
├── Node.js + Express.js
├── MongoDB + Mongoose
├── JWT Authentication
├── SSL Commerce (Payment)
└── BAJUS API (Gold prices)
```

### Frontend
```
├── React 18 (NOT Next.js)
├── React Router DOM
├── Tailwind CSS + Shadcn UI
├── Axios (API calls)
├── jsPDF + html2canvas
├── react-i18next (i18n)
└── QRCode generation
```

### DevOps
```
├── Git + GitHub
├── Vercel (Frontend)
├── MongoDB Atlas (Database)
└── AWS/DigitalOcean (Backend)
```

---

## 📦 Installation

### Prerequisites
```bash
Node.js 18+
MongoDB 6+
Git
```

### Setup
```bash
# Clone repository
git clone https://github.com/your-username/muslim-finance-tracker.git
cd muslim-finance-tracker

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SSL_STORE_ID=your_ssl_store_id
SSL_PASSWORD=your_ssl_password

# Frontend (.env)
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
```

---

## 📚 Islamic References

### Masail Sources (Priority Order)
1. **Darul Uloom Deoband** - دار العلوم ديوبند
2. **মাসিক আল-কাউসার** - Bangladesh Islamic magazine
3. **Mufti Taqi Usmani** - Contemporary Hanafi scholar
4. **Hanafi Madhab** - Classical fiqh texts

### Shariah Compliance
- ✅ No interest (Riba) calculations
- ✅ Separate Zakat/donation accounts (never mixed)
- ✅ Halal revenue model only
- ✅ Authentic Islamic guidelines

---

## 🤝 Contributing

### For Developers
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# Test locally
# Commit with proper message
git commit -m "الحمد لله - feat: your feature"

# Push and create PR
git push origin feature/your-feature
```

### Code Standards
- ESLint + Prettier
- PropTypes validation
- Error boundaries
- API error handling
- Input validation (client + server)

---

## 📜 License

MIT License - See LICENSE file

---

## 👨‍💻 Developer

**Muslim Programmer**  
📧 Email: developer@muslimfinancetracker.com  
🌐 Website: https://muslim-finance-tracker.vercel.app

© 2024 Muslim Finance Tracker. All rights reserved.

---

## 🤲 Dua

**رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ**

*O our Lord, accept [this] from us. Indeed, You are the Hearing, the Knowing.*

**Allahumma barik!**


## 📊 User Data Export

Export all user data to CSV/JSON format:

\`\`\`bash
cd backend && node export-users.js
\`\`\`

**Output:**
- CSV file: `backend/exports/users_TIMESTAMP.csv`
- JSON file: `backend/exports/users_TIMESTAMP.json`
- Console statistics with country breakdown

**Note:** This is a temporary solution until Admin Dashboard is implemented in Step 45+.

