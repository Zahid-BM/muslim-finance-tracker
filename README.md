# 🕌 Muslim Finance Tracker

**بسم الله الرحمن الرحيم**

> Manage your finances with authentic Islamic principles  
> Complete MERN stack SaaS application

---

## 📊 Project Status

**Progress:** 41/60 Steps Complete (68%)  
**Current Step:** 41 - Enhanced Zakat Calculator (Testing & Fixes)
**Tech Stack:** MongoDB + Express + React + Node.js (MERN)  
**Last Updated:** 2025-11-09 16:14:01

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



### ✅ Step 41: Enhanced Zakat Calculator (In Progress)
**Last Updated:** November 09, 2025

#### ✅ Completed:
- Backend Services:
  - ✅ bajusService.js - BAJUS gold/silver price integration
  - ✅ zakatService.js - Hanafi madhab calculations
  - ✅ routes/zakat.js - API endpoints
  - ✅ server.js - Route mounting fixed
  - ✅ axios package installed
- Frontend:
  - ✅ EnhancedZakatCalculator component
  - ✅ Asset input forms (8 categories)
  - ✅ Liability deduction
  - ✅ Islamic masail modals
  - ✅ Professional UI with Bangla support
  - ✅ HTML structure errors fixed
  - ✅ Browser console errors resolved

#### ❌ Known Issues (Testing Phase):
1. **Nisab Calculation Incorrect:**
   - Currently showing: ৳78,355
   - Should be: ৳109,207.56
   - Issue: bajusService.js has outdated price (৳160/gram)
   - BAJUS actual: ৳223/gram silver (Nov 9, 2025)
   - Correct calculation:
     * ৳223 - 20% = ৳178.40/gram (selling price)
     * 11.66 gram = 1 vori = ৳2,080.144
     * 52.5 vori nisab = ৳109,207.56

2. **Zakat Obligation Check Failing:**
   - User with ৳1,40,000 assets shown as "not obligatory"
   - Should be obligatory (above ৳78,355 or ৳109,207)
   - Need to debug backend calculation logic

3. **Price Update Required:**
   - Update bajusService.js with current BAJUS prices
   - Implement better price fallback mechanism

#### API Endpoints:
- GET /api/zakat/prices - Current gold/silver prices
- POST /api/zakat/calculate - Calculate zakat

**Status:** Partial completion - Core features working, accuracy fixes needed
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
