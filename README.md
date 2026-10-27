# FairShift: UN SDG 8 Decent Work Platform

> **Hackathon Submission for UN SDG 8: Decent Work and Economic Growth**  
> Making work fairer, safer, and transparent for employee-intensive organisations (Construction Sites & Higher Education / Colleges).

---

## 🌟 Six Evaluation Pillars & Implementation

### 1. Code Quality
- **Architecture**: Modular layout with strict separation of pure business logic (`src/lib/`), data access repository (`src/data/`), internationalization (`src/i18n/`), responsive UI components (`src/components/`), and route pages (`src/pages/`).
- **TypeScript**: Strict mode with 100% typed props and domain models. Zero `any` usage.
- **Documentation**: JSDoc comments on every pure calculation and validator function.
- **Reliability**: Top-level React `ErrorBoundary`, with async loading, empty, and error feedback states.

### 2. Security
- **Zero Hardcoded Secrets**: Only reads from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Automatic Fallback**: If environment variables are missing, the app automatically runs in a self-contained local storage fallback mode with clearly labeled sample data.
- **Strict Anonymity**: The `feedback` schema and submission payload have **NO** worker identifier or IP column. Input validators reject any submission containing identity fields.
- **Sanitization & Validation**: Central `src/lib/validators.ts` validates coordinates, text lengths, and numeric ranges. Zero `dangerouslySetInnerHTML` or `eval`.
- **Row Level Security (RLS)**: Enforced in `supabase/schema.sql`.
  > *Known Demonstration Limitation*: Because this hackathon showcase operates in zero-login mode for effortless code evaluation, policies permit public anon client access. In production, Supabase Auth (Worker SMS OTP or SSO) will gate table access via `auth.uid() = worker_id`.
- **Nginx Security Headers**: `nginx.conf` sets strict CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, and `Permissions-Policy` (restricting geolocation & microphone to self).

### 3. Efficiency
- **Minimal Dependencies**: Zero heavy chart libraries (inline SVG charts for 7-day attendance/overtime trends), zero UI-kit bloat.
- **Code Splitting**: Route-level lazy loading (`React.lazy`) for admin dashboard sub-views.
- **Lightweight Assets**: Pure CSS + inline SVG icons for instant mobile performance on low-end smartphones.

### 4. Testing
- **Automated Unit Tests**: Vitest suite covering:
  - Haversine distance and geofence boundary checks (inside, outside, boundary edge, invalid coordinates).
  - Overtime calculations (sub-threshold, exact threshold, overtime, overnight midnight crossings).
  - Payslip calculation (rounding, statutory deductions, overtime rates).
  - Fatigue alert engine (excessive daily hours, short rest intervals between shifts).
  - Input validators and anonymization guarantees.
- **Run Tests**: `npm test` or `npx --yes tsx --test src/tests/*.test.ts`.

### 5. Accessibility
- **Inclusive Design**: Touch targets >= 48px, high-contrast themes, clear typography.
- **Language & Literacy**: Multi-language support (English, Spanish, Hindi) with audio read-out accessibility helpers and speech-to-text safety reporting.

### 6. Problem Statement Alignment
- Solves **worker exploitation**: uncounted overtime, opaque pay, fear of reporting hazards, language barriers.
- Solves **employer blindspots**: automated fatigue flags (>10h day or <11h turnaround), real-time site check-ins, and actionable safety workflows.
- Works across **two distinct sectors**: Construction Sites ("Metro Tower") and Colleges ("Oakridge Community College").

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start local development server
npm run dev
```
