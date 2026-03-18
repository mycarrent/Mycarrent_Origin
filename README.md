# My Car Rent — ระบบจัดการงานรถเช่า

A production-ready Progressive Web App (PWA) for managing daily operations of a car rental business in Thailand. Built with React 19, TypeScript, Tailwind CSS 4, and IndexedDB for full offline support.

---

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Today's summary with total income, job count, category breakdown, 7-day income chart, and recent activity feed |
| **Task Entry** | Quick entry form with date picker, category selection (ล้างรถ / ส่งรถ / เก็บรถ), plate dropdown, price input with quick buttons, and optional notes |
| **Data Management** | Full history with filter by date, category, and plate. Edit and delete any entry with confirmation dialogs |
| **Reports** | Daily, weekly, and monthly views with category breakdown, progress bars, percentage analysis, and best-performing category highlight |
| **Export** | Copy as formatted text, download as PNG image card, or export as CSV (Excel-compatible with Thai encoding) |
| **Vehicle Management** | Add, edit, and delete license plates with usage statistics (job count and total income per plate) |
| **Offline Support** | Full PWA with Service Worker — works completely offline. All data stored in IndexedDB on the device |
| **Installable** | Add to Home Screen on any mobile device. Standalone app experience with custom icons and splash screen |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS 4 + custom Neo-Brutalist design system |
| UI Components | shadcn/ui (Radix primitives) |
| Animation | Framer Motion |
| Charts | Recharts |
| Image Export | html2canvas |
| Storage | IndexedDB via `idb` library |
| Routing | Wouter |
| PWA | Service Worker + Web App Manifest |
| Fonts | Kanit (Thai) + Roboto Mono (numbers) |

---

## File Structure

```
my-car-rent/
├── client/
│   ├── index.html              # HTML entry with PWA meta tags & fonts
│   ├── public/
│   │   ├── manifest.json       # PWA manifest (installable config)
│   │   ├── sw.js               # Service Worker (offline caching)
│   │   ├── icon-192.png        # PWA icon 192x192
│   │   └── icon-512.png        # PWA icon 512x512
│   └── src/
│       ├── main.tsx            # React entry + SW registration
│       ├── App.tsx             # Routes, providers, layout
│       ├── index.css           # Global styles + design tokens
│       ├── pages/
│       │   ├── Dashboard.tsx   # Home — today's summary
│       │   ├── AddEntry.tsx    # Task entry form
│       │   ├── History.tsx     # Data management (filter/edit/delete)
│       │   ├── Reports.tsx     # Summary & reports with export
│       │   ├── Vehicles.tsx    # License plate management
│       │   ├── Settings.tsx    # App settings & seed data
│       │   ├── Home.tsx        # Redirect to Dashboard
│       │   └── NotFound.tsx    # 404 page
│       ├── components/
│       │   ├── BottomNav.tsx   # Bottom tab navigation
│       │   ├── DailyChart.tsx  # 7-day stacked bar chart
│       │   ├── LoadingScreen.tsx # Branded loading state
│       │   ├── ErrorBoundary.tsx # Error boundary
│       │   └── ui/             # shadcn/ui components
│       ├── contexts/
│       │   ├── DataContext.tsx  # Global data provider (entries + plates)
│       │   └── ThemeContext.tsx # Theme provider
│       ├── hooks/              # Custom hooks
│       └── lib/
│           ├── db.ts           # IndexedDB layer (CRUD + seed data)
│           ├── utils-app.ts    # Formatting, categories, export helpers
│           └── utils.ts        # General utilities
├── server/                     # Static server (production)
├── package.json
└── README.md
```

---

## Data Structure

Each entry is stored in IndexedDB with the following schema:

```typescript
interface Entry {
  id: string;           // Auto-generated unique ID
  date: string;         // "YYYY-MM-DD"
  category: "wash" | "delivery" | "pickup";
  plate: string;        // License plate number
  price: number;        // Price in Thai Baht
  note: string;         // Optional note
  createdAt: number;    // Unix timestamp
  updatedAt: number;    // Unix timestamp
}

interface Plate {
  id: string;
  plate: string;        // License plate number
  createdAt: number;
}
```

IndexedDB indexes enable fast queries by date, category, plate, and compound date+category.

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (`npm install -g pnpm`)

### Local Development

```bash
# 1. Clone or download the project
cd my-car-rent

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev

# 4. Open in browser
# → http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## How to Deploy to GitHub Pages

1. **Create a GitHub repository** and push the code.

2. **Install `gh-pages`** package:
   ```bash
   pnpm add -D gh-pages
   ```

3. **Add deploy script** to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "pnpm build",
       "deploy": "gh-pages -d dist/public"
     }
   }
   ```

4. **Configure Vite** for GitHub Pages base path. In `vite.config.ts`, add:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   });
   ```

5. **Deploy**:
   ```bash
   pnpm deploy
   ```

6. **Enable GitHub Pages** in repository Settings → Pages → Source: `gh-pages` branch.

Your app will be available at `https://yourusername.github.io/your-repo-name/`.

---

## How to Install as PWA on Mobile

### Android (Chrome)

1. Open the app URL in Chrome.
2. Tap the **three-dot menu** (⋮) in the top-right.
3. Tap **"Add to Home Screen"** or **"Install app"**.
4. Confirm the installation.
5. The app icon will appear on your home screen.

### iOS (Safari)

1. Open the app URL in Safari.
2. Tap the **Share button** (□↑) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** to confirm.
5. The app icon will appear on your home screen.

### Desktop (Chrome/Edge)

1. Open the app URL.
2. Click the **install icon** (⊕) in the address bar.
3. Click **"Install"** to confirm.

Once installed, the app runs in standalone mode (no browser UI) and works fully offline.

---

## Sample Data

The app includes a built-in sample data generator. To populate the app with test data:

1. Navigate to **Settings** (ตั้งค่า) via the "More" menu.
2. Tap **"เพิ่มข้อมูลตัวอย่าง"** (Add sample data).
3. This generates 30 days of realistic data across 5 license plates.

**Sample plates**: กก 1234, ขข 5678, คค 9012, งง 3456, จจ 7890

**Sample data includes**:
- 2-5 entries per day for the past 30 days (~100+ entries)
- Random distribution across all 3 categories
- Realistic Thai prices (200-1000 Baht)
- Thai notes (e.g., ล้างภายนอก, ส่งสนามบิน, เก็บจากโรงแรม)

To clear all data, use the **"ล้างข้อมูลทั้งหมด"** button in Settings.

---

## Categories

| Category | Thai Name | English Name | Color | Icon |
|----------|-----------|-------------|-------|------|
| `wash` | ล้างรถ | Car Wash | Blue (#3B82F6) | 💧 |
| `delivery` | ส่งรถ | Car Delivery | Green (#10B981) | 🚗 |
| `pickup` | เก็บรถ | Car Pickup | Orange (#F97316) | 🔑 |

---

## Design Philosophy

The app uses a **"Tropical Operations Console"** design — a Soft Neo-Brutalist aesthetic with tropical color accents. Key design decisions:

- **Warm off-white background** (#FFF8F0) for comfortable extended use
- **Bold 2.5px borders** and **offset drop shadows** for a tactile, graphic quality
- **Color-coded categories** for instant visual recognition
- **Kanit font** for native Thai readability, **Roboto Mono** for numbers/prices
- **Bottom tab navigation** with a prominent center FAB for quick task entry
- **Large touch targets** (minimum 44px) for reliable mobile interaction
- **Bouncy spring animations** via Framer Motion for satisfying feedback

---

## Offline Support

The app is designed to work completely offline:

- **Service Worker** caches all static assets (HTML, CSS, JS, fonts, images)
- **IndexedDB** stores all data locally on the device
- **No external API dependencies** — all operations are client-side
- **Online/offline indicator** in Settings shows current connection status
- **Cache strategies**: Cache-first for static assets, stale-while-revalidate for dynamic content

All data remains on the user's device. No data is sent to any external server.

---

## License

MIT
