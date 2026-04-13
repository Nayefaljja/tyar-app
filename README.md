<div align="center">

```
████████╗██╗   ██╗ █████╗ ██████╗
╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔══██╗
   ██║    ╚████╔╝ ███████║██████╔╝
   ██║     ╚██╔╝  ██╔══██║██╔══██╗
   ██║      ██║   ██║  ██║██║  ██║
   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
         تـيـار  |  T Y A R
```

### منصة السيارات الكهربائية الأولى في المملكة العربية السعودية
### Saudi Arabia's First Dedicated Electric Vehicle Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-3CAEA3.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-0f2744.svg?style=for-the-badge)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-3CAEA3.svg?style=for-the-badge)]()
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Expo](https://img.shields.io/badge/Expo-Mobile-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## Overview | نظرة عامة

**English:** TYAR (تيار) is Saudi Arabia's premier electric vehicle ecosystem — a bilingual (Arabic/English) platform that lets users browse and inquire about EVs, book home charger installations, and schedule certified maintenance services. Built for Vision 2030, TYAR bridges the gap between Saudi EV enthusiasts and the services they need, all in one place.

**العربية:** تيار هي منصة السيارات الكهربائية الرائدة في المملكة العربية السعودية — بيئة متكاملة ثنائية اللغة (عربي/إنجليزي) تتيح للمستخدمين تصفح السيارات الكهربائية، حجز تركيب الشواحن المنزلية، وجدولة خدمات الصيانة المعتمدة. مبنية لخدمة رؤية 2030، تجمع تيار كل ما يحتاجه محبو السيارات الكهربائية في مكان واحد.

---

## Features | المميزات

### 🚗 EV Marketplace | سوق السيارات الكهربائية
- Browse a curated inventory of electric vehicles available in KSA
- Filter by brand, range, price, and charging standard
- Real-time availability powered by Supabase
- Detailed specs including range (km), charging time, and warranty

### ⚡ Charger Installation | تركيب الشواحن
- Book certified home charger installations in minutes
- Choose charger type (Level 1 / Level 2 / DC Fast)
- Automatic city-based technician dispatch
- Status tracking from booking to completion

### 🔧 Maintenance Scheduling | جدولة الصيانة
- Schedule EV-specific maintenance with certified centres
- Service reminders and booking history
- Support for Tesla, BYD, Lucid, Hyundai, Kia, and more

### 🌐 Bilingual | ثنائي اللغة
- Full Arabic (RTL) and English (LTR) support
- Instant language switch without page reload
- Saudi-localised content and pricing (SAR)

### 🌙 Dark Mode | الوضع الليلي
- System-preference aware dark/light theme
- Seamless token-based colour system

### 📱 Mobile App | التطبيق الجوال
- React Native + Expo cross-platform app (iOS & Android)
- Native navigation, haptic feedback, smooth animations
- Shared Supabase backend with the web platform

---

## Tech Stack | التقنيات المستخدمة

| Layer | Technology |
|---|---|
| **Web Frontend** | Vanilla HTML5, CSS3 (Custom Properties), ES2022 JS |
| **Mobile** | React Native 0.81, Expo SDK 54 |
| **Navigation (Mobile)** | React Navigation 7 (Stack + Bottom Tabs) |
| **Animations** | React Native Reanimated 4, Expo Linear Gradient |
| **Backend / Database** | Supabase (PostgreSQL + Auth + Realtime) |
| **Fonts** | Tajawal (Arabic), Inter (Latin) — Google Fonts |
| **Icons** | Font Awesome 6, Expo Vector Icons |
| **Hosting (Web)** | Vercel |
| **CI/CD (Mobile)** | EAS Build (Expo Application Services) |

---

## Project Structure | هيكل المشروع

```
tyar-app-root/
├── tyar-app/                  # Web platform (Vanilla JS)
│   ├── index.html             # Homepage / Hero
│   ├── marketplace.html       # EV browsing & listings
│   ├── charger.html           # Charger installation booking
│   ├── maintenance.html       # Maintenance scheduling
│   ├── admin.html             # Admin dashboard
│   ├── privacy-policy.html    # Privacy policy (AR + EN)
│   ├── styles.css             # Global design tokens
│   ├── header.css             # Shared frosted-glass header
│   ├── branding.css           # Brand-specific component styles
│   ├── service-icons.css      # Service icon utilities
│   ├── supabase.js            # Supabase client + data helpers
│   ├── script.js              # Homepage interactions
│   ├── lang.js                # Language toggle (AR/EN)
│   ├── localization.js        # i18n string map
│   ├── saudi-data.js          # KSA cities, regions, EV data
│   ├── charger-installation.js
│   ├── maintenance-scheduling.js
│   ├── arabic-translations.js
│   ├── images/                # Static assets
│   ├── vercel.json            # Vercel routing config
│   ├── robots.txt
│   └── sitemap.xml
│
└── tyar-mobile/               # Mobile app (React Native + Expo)
    ├── App.js                 # Root component
    ├── index.js               # Entry point
    ├── app.json               # Expo config
    ├── app.config.js          # Dynamic Expo config
    ├── eas.json               # EAS Build profiles
    └── src/                   # Screens, components, navigation
```

---

## Screenshots | لقطات الشاشة

> Screenshots will be added after the first public release.

| Homepage | Marketplace | Charger Booking | Maintenance |
|:---:|:---:|:---:|:---:|
| *(coming soon)* | *(coming soon)* | *(coming soon)* | *(coming soon)* |

| Mobile — Home | Mobile — Listings | Mobile — Booking |
|:---:|:---:|:---:|
| *(coming soon)* | *(coming soon)* | *(coming soon)* |

---

## Quick Start | البداية السريعة

### Prerequisites | المتطلبات

- **Node.js** 18+ and npm / yarn
- **Git**
- A [Supabase](https://supabase.com) account
- **Expo CLI** (for mobile): `npm install -g expo-cli`

### 1. Clone the Repository | استنساخ المستودع

```bash
git clone https://github.com/Nayefaljja/tyar-app.git
cd tyar-app
```

### 2. Web Platform | تشغيل الموقع

The web platform is pure HTML/CSS/JS — no build step required.

```bash
# Option A: any static file server
cd tyar-app
npx serve .
# Open http://localhost:3000

# Option B: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option C: Python (if installed)
cd tyar-app
python -m http.server 8080
# Open http://localhost:8080
```

### 3. Mobile App | تشغيل التطبيق الجوال

```bash
cd tyar-mobile
npm install

# Start Expo dev server
npm start
# or
npx expo start

# Run on specific platform
npm run android   # Android emulator or device
npm run ios       # iOS simulator (macOS only)
npm run web       # Web preview
```

> Scan the QR code with **Expo Go** (iOS / Android) to run on a real device instantly.

---

## Supabase Setup | إعداد Supabase

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project** and fill in the details
3. Note your **Project URL** and **anon public key**

### 2. Configure Credentials

**Web — `tyar-app/supabase.js`:**
```js
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_KEY';
```

**Mobile — `tyar-mobile/src/lib/supabase.js` (or equivalent):**
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey  = 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 3. Database Schema

Run the following SQL in the **Supabase SQL Editor** to create the core tables:

```sql
-- EV Listings
create table cars (
  id           uuid default gen_random_uuid() primary key,
  brand        text not null,
  model        text not null,
  year         int,
  price_sar    numeric,
  range_km     int,
  image_url    text,
  is_active    boolean default true,
  created_at   timestamptz default now()
);

-- Charger Installation Bookings
create table charger_bookings (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  phone        text not null,
  city         text not null,
  charger_type text,
  notes        text,
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- Maintenance Bookings
create table maintenance_bookings (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  phone        text not null,
  city         text not null,
  car_brand    text,
  service_type text,
  preferred_date date,
  notes        text,
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- Enable Row Level Security
alter table cars enable row level security;
alter table charger_bookings enable row level security;
alter table maintenance_bookings enable row level security;

-- Public read for cars
create policy "Public can read active cars"
  on cars for select using (is_active = true);

-- Authenticated insert for bookings
create policy "Anyone can submit charger booking"
  on charger_bookings for insert with check (true);

create policy "Anyone can submit maintenance booking"
  on maintenance_bookings for insert with check (true);
```

### 4. Row Level Security

All tables have RLS enabled. Adjust policies in the Supabase Dashboard under **Authentication → Policies** to match your access requirements.

---

## Deployment | النشر

### Web — Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# From the tyar-app directory
cd tyar-app
vercel

# Follow the prompts — the vercel.json is already configured
# Production URL will be printed on completion
```

The included `vercel.json` configures:
- Clean URLs (no `.html` extensions)
- Proper cache headers for assets
- Redirect rules

### Web — Manual / cPanel

Upload the contents of `tyar-app/` to your web server's public root. No build step needed.

### Mobile — EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

cd tyar-mobile

# Log in to Expo account
eas login

# Configure (first time)
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## Environment Variables | متغيرات البيئة

No `.env` file is required for the web platform (credentials are in `supabase.js`). For production, consider moving secrets to Vercel environment variables and fetching them server-side or via a serverless function.

For the mobile app, if using `expo-constants` or a `.env` approach:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Contributing | المساهمة

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style (RTL-first, bilingual labels, design token usage).

---

## License | الرخصة

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Contact | التواصل

- **Email:** [nfjaaazy@gmail.com](mailto:nfjaaazy@gmail.com)
- **GitHub:** [@Nayefaljja](https://github.com/Nayefaljja)
- **Project:** [github.com/Nayefaljja/tyar-app](https://github.com/Nayefaljja/tyar-app)

---

<div align="center">

Made with dedication for Saudi Arabia's clean-energy future &nbsp;|&nbsp; صُنع بشغف لمستقبل المملكة النظيف

**تيار — طاقة نظيفة، ابتكار**

</div>
