# My Car Rent PWA — Performance Analysis & Optimization Roadmap

**Analysis Date:** March 22, 2026  
**Current Version:** 419ef609 (Clean Light Mode + History with date headers)

---

## 📊 Current Performance Metrics

### Bundle Size Analysis
| Metric | Size | Gzip | Status |
|--------|------|------|--------|
| **Total HTML** | 368 KB | 106 KB | ⚠️ Large |
| **CSS Bundle** | 118 KB | 18 KB | ✅ Good |
| **JS Bundle** | 1,216 KB | 344 KB | 🔴 **Critical** |
| **Total (Gzipped)** | — | 468 KB | 🔴 **Over 500KB threshold** |

### Build Performance
- **Build Time:** ~10 seconds
- **Module Count:** 2,695 modules
- **Dev Server Startup:** 396-557ms (acceptable)

---

## 🔍 Key Findings

### 1. **Oversized JavaScript Bundle (1.2 MB uncompressed)**

**Root Causes:**
- **All Radix UI components imported:** 53 UI components defined, but only 13 actually used
  - Unused: accordion, avatar, badge, breadcrumb, calendar, carousel, checkbox, collapsible, command, context-menu, drawer, dropdown-menu, field, form, hover-card, input-group, input-otp, item, kbd, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, separator, slider, switch, tabs, toggle, toggle-group, tooltip
  - Each Radix UI component adds ~10-20 KB to bundle
  
- **Unused dependencies in package.json:**
  - `html2canvas` (65 KB) — Not used in Reports page
  - `jspdf` (Not in package.json but was referenced)
  - `axios` (13 KB) — Can use native `fetch` instead
  - `embla-carousel-react` (40 KB) — Not used
  - `cmdk` (25 KB) — Not used
  - `recharts` (200+ KB) — Only used in Dashboard chart

- **Heavy animation library:**
  - `framer-motion` (60+ KB) — Used for 54 animations across 8 files
  - Can be replaced with CSS animations for 90% of use cases

### 2. **Unused shadcn/ui Components (40 components)**

**Currently Used:**
- alert-dialog, button, card, dialog, input, label, separator, sheet, skeleton, sonner, textarea, toggle, tooltip

**Bloat from Pre-built Template:**
- All 53 components are included by default in the template
- Each adds Radix UI dependency overhead

### 3. **Dependency Duplication**

**Radix UI Ecosystem:**
- 27 separate `@radix-ui/*` packages (each has own peer dependencies)
- Total Radix UI footprint: ~200-250 KB

**Tailwind CSS:**
- Tailwind 4 with full plugin ecosystem
- CSS is well-optimized (18 KB gzip), but can be further reduced

### 4. **Recharts for Single Chart**

- Only used in Dashboard for 7-day expense chart
- Recharts library: ~200+ KB
- Alternative: Chart.js (100 KB) or custom SVG chart (10 KB)

### 5. **Service Worker Caching Strategy**

**Current Implementation:** ✅ Good
- Cache-first for static assets
- Network-first for navigation
- Stale-while-revalidate for JS/CSS
- **Issue:** No versioning strategy for cache busting

**Recommendation:** Add version hash to cache name

### 6. **IndexedDB Implementation**

**Current Implementation:** ✅ Excellent
- Uses `idb` library (small wrapper, ~5 KB)
- Proper indexes on date, category, plate
- Efficient for offline-first architecture

---

## 🎯 Optimization Opportunities (Prioritized)

### Priority 1: Critical (Save ~300-400 KB)

#### 1.1 Remove Unused UI Components
- **Action:** Delete 40 unused shadcn/ui component files
- **Savings:** ~80-100 KB (removes Radix UI imports)
- **Effort:** 30 minutes
- **Risk:** Low (no code uses them)

#### 1.2 Replace Framer Motion with CSS Animations
- **Current:** 60+ KB library for 54 animations
- **Action:** Convert animations to Tailwind CSS + `@keyframes`
- **Savings:** ~60 KB
- **Effort:** 2-3 hours
- **Risk:** Medium (need to test all animations)
- **Benefit:** Better performance on low-end devices

#### 1.3 Replace Recharts with Chart.js or Custom SVG
- **Current:** 200+ KB for single chart
- **Action:** Migrate Dashboard chart to Chart.js (~100 KB) or custom SVG (~10 KB)
- **Savings:** 100-200 KB
- **Effort:** 1-2 hours
- **Risk:** Low (isolated to Dashboard)

#### 1.4 Remove Unused Dependencies
- **Remove:** html2canvas, jspdf, axios, embla-carousel, cmdk
- **Savings:** ~150-200 KB
- **Effort:** 1 hour
- **Risk:** Low (verify no code uses them)

### Priority 2: High (Save ~100-150 KB)

#### 2.1 Code Splitting by Route
- **Action:** Lazy load pages using React.lazy() + Suspense
- **Savings:** ~50-80 KB (defer non-critical pages)
- **Effort:** 1-2 hours
- **Risk:** Low (Wouter supports lazy loading)
- **Benefit:** Faster initial page load

#### 2.2 Tree-shake Unused Radix UI Packages
- **Action:** Only import used Radix components
- **Savings:** ~50-70 KB
- **Effort:** 1 hour
- **Risk:** Low (verify imports)

#### 2.3 Optimize Tailwind CSS
- **Action:** Remove unused Tailwind utilities, enable JIT purging
- **Savings:** ~5-10 KB
- **Effort:** 30 minutes
- **Risk:** Low

### Priority 3: Medium (Save ~30-50 KB)

#### 3.1 Minify and Compress Assets
- **Action:** Ensure Vite minification is enabled
- **Savings:** ~10-20 KB
- **Effort:** Already done by Vite

#### 3.2 Remove Unused Lucide Icons
- **Current:** All 453 icons imported
- **Action:** Tree-shake to only used icons
- **Savings:** ~20-30 KB
- **Effort:** 30 minutes
- **Risk:** Low

#### 3.3 Optimize Fonts
- **Action:** Use system fonts or subset Google Fonts (Kanit)
- **Savings:** ~10-15 KB
- **Effort:** 30 minutes
- **Risk:** Low

---

## 📈 Expected Results After Optimization

| Optimization | Current | After | Savings |
|--------------|---------|-------|---------|
| **JS Bundle** | 1,216 KB | 700-800 KB | 400-500 KB |
| **JS Gzip** | 344 KB | 200-250 KB | 100-150 KB |
| **Total Gzip** | 468 KB | 300-350 KB | 120-170 KB |
| **Initial Load** | ~2-3s | ~1-1.5s | 50-60% faster |

---

## 🔧 Implementation Plan

### Phase 1: Quick Wins (1-2 hours)
1. Remove 40 unused UI components
2. Remove unused dependencies (html2canvas, jspdf, axios, embla, cmdk)
3. Optimize Tailwind CSS
4. Tree-shake Lucide icons

### Phase 2: Medium Effort (2-3 hours)
1. Replace Framer Motion with CSS animations
2. Implement code splitting by route
3. Optimize fonts

### Phase 3: High Impact (2-3 hours)
1. Replace Recharts with Chart.js or custom SVG
2. Verify all functionality
3. Performance testing

### Phase 4: Testing & Validation (1 hour)
1. Lighthouse audit
2. Bundle size analysis
3. Performance profiling
4. User testing on low-end devices

---

## 🧪 Performance Testing Recommendations

### Metrics to Track
- **Lighthouse Score:** Target 90+
- **First Contentful Paint (FCP):** Target <1.5s
- **Largest Contentful Paint (LCP):** Target <2.5s
- **Cumulative Layout Shift (CLS):** Target <0.1
- **Time to Interactive (TTI):** Target <3s

### Tools
- Chrome DevTools Lighthouse
- WebPageTest
- Bundle Analyzer: `npm run build -- --analyze`

---

## 💡 Additional Recommendations

### 1. **Service Worker Cache Versioning**
```javascript
// Add version hash to cache name
const CACHE_NAME = "my-car-rent-v1-" + BUILD_HASH;
```

### 2. **Implement Lazy Loading for Images**
```html
<img src="..." loading="lazy" />
```

### 3. **Enable Compression**
- Ensure gzip compression on server
- Consider Brotli compression for modern browsers

### 4. **Monitor Performance in Production**
- Add Web Vitals monitoring
- Track bundle size over time
- Set performance budgets

### 5. **Progressive Enhancement**
- Ensure app works with JS disabled (for critical paths)
- Implement graceful degradation for older browsers

---

## 📋 Implementation Checklist

- [ ] Phase 1: Remove unused components & dependencies
- [ ] Phase 2: Replace Framer Motion with CSS
- [ ] Phase 3: Replace Recharts with Chart.js
- [ ] Phase 4: Implement code splitting
- [ ] [ ] Run Lighthouse audit
- [ ] [ ] Verify all features work
- [ ] [ ] Test on low-end devices
- [ ] [ ] Create new checkpoint
- [ ] [ ] Update documentation

---

## 🚀 Long-term Optimization Strategy

1. **Monitor Bundle Size:** Set performance budgets in CI/CD
2. **Dependency Audit:** Quarterly review of unused packages
3. **Performance Regression Testing:** Automated performance tests in CI
4. **User Monitoring:** Track real-world performance metrics
5. **Progressive Enhancement:** Prioritize critical paths for faster load

---

**Next Steps:** Review this analysis with the team and prioritize optimizations based on business impact and available resources.
