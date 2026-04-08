# E-Learning Fisika (Nuxt) — UI/UX High-Fidelity Prototype

## 📋 Project Overview

Prototype UI/UX modern untuk platform pembelajaran fisika dengan pendekatan **premium SaaS**:
- Dark space-science visual language
- Glassmorphism yang halus
- Layout bersih dengan whitespace lega
- Micro-interactions yang smooth

Implementasi ini fokus pada kualitas tampilan, arsitektur UI modular, dan kesiapan pengembangan lanjut.

## 🎨 Design System

### Visual Language
- **Theme**: Dark premium (`zinc-950`)
- **Accent Colors**: Electric Blue (`blue-500`) + Indigo (`indigo-500`)
- **Typography**: Plus Jakarta Sans
- **Effects**: Glassmorphism (`bg-white/5`, `backdrop-blur`, `border-white/10`)
- **Interaction style**: hover/focus transitions ±200ms, subtle glow

### Tailwind Tokens & Utilities
**File**: `tailwind.config.ts`

- Token warna:
  - `background` → `#09090b`
  - `accent.blue` → `#3b82f6`
  - `accent.indigo` → `#6366f1`
- Utility khusus:
  - `.glass-card`
  - `.border-glow`
  - `.border-glow-hover`

## 🏗️ Architecture

### Technology Stack
- **Framework**: Nuxt 4 (`app/` directory)
- **Runtime UI**: Vue 3 Composition API
- **Styling**: Tailwind CSS (`@nuxtjs/tailwindcss`)
- **Icons**: `lucide-vue-next`
- **UI primitives (shadcn-style)**: custom components (`Button`, `Input`, `Dialog`)
- **Auth integration**: `@nuxtjs/supabase`
- **ORM / data layer**: Prisma (schema tersedia)

### Project Structure (UI scope)
```txt
app/
├── app.vue
├── assets/css/
│   └── tailwind.css
├── layouts/
│   ├── teacher.vue
│   └── student.vue
├── components/ui/
│   ├── GlassCard.vue
│   ├── StatCard.vue
│   ├── cn.ts
│   ├── button/Button.vue
│   ├── input/Input.vue
│   └── dialog/Dialog.vue
├── composables/
│   └── useCourses.ts
└── pages/
    ├── teacher/index.vue
    ├── courses/index.vue
    └── courses/[id].vue
```

## 🛣️ Route Map

```txt
/
├── /frontend
├── /backend
├── /teacher
├── /courses
└── /courses/:id
```

## 📄 Page Descriptions

### 1) Teacher Dashboard (`/teacher`)
**File**: `app/pages/teacher/index.vue`

Features:
- **Bento stats widgets**: Total Students (sparkline), Active Courses, Assignments to Grade
- **Recent Materials** list dengan hover micro-interactions
- **Recent Activity** feed berbasis card
- **Floating Quick Action Panel** untuk upload
- **Upload Material Modal** (glass dialog)

### 2) Student Courses (`/courses`)
**File**: `app/pages/courses/index.vue`

Features:
- **Glass Search Bar** (focus glow)
- **Premium course cards**:
  - rounded-3xl
  - physics icon badge
  - progress bar gradient blue → indigo
- **Real-time filtering** berdasarkan kata kunci
- **Card to detail navigation**

### 3) Course Detail (`/courses/:id`)
**File**: `app/pages/courses/[id].vue`

Features:
- Header course + action buttons
- **Learning Path** modules (video/reading/quiz)
- **Progress panel** + achievement block
- Consistent glass visual style

## 🧩 Reusable UI Components

Lokasi: `app/components/ui/`

- **`GlassCard.vue`**
  - Container premium reusable
  - Hover border accent (`hover:border-blue-500/50`)
  - Subtle gradient edge glow

- **`StatCard.vue`**
  - Metric card untuk dashboard
  - Glowing icon background
  - Slot untuk subcontent/footer (fleksibel)

- **`button/Button.vue`**
  - shadcn-style button dengan variants (`default`, `secondary`, `ghost`)
  - Focus ring dan interactive states konsisten

- **`input/Input.vue`**
  - Input reusable dengan focus style premium

- **`dialog/Dialog.vue`**
  - Modal reusable (ESC close, click-outside close, blur backdrop)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Run Development
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

### Preview Notes
Project menggunakan `nitro.preset = "vercel"`, sehingga `nuxt preview` dapat menampilkan:
> Preview is not supported for this build.

Untuk preview lokal:
```bash
NITRO_PRESET=node-server npm run build
npm run preview
```

atau gunakan:
```bash
npm run dev
```

## 🔐 Environment Notes

Agar warning Supabase hilang, isi `.env` dari `.env.example`:
- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_KEY`

Contoh:
```bash
cp .env.example .env
```

> Catatan: gunakan **anon public key**, bukan `service_role`.

## ✅ Key Features Checklist

- [x] Space-Science visual foundation (dark premium + blue/indigo accents)
- [x] Glassmorphism utility system di Tailwind
- [x] Teacher layout (sleek vertical sidebar)
- [x] Student layout (floating top-nav)
- [x] Teacher dashboard bento grid + quick action modal
- [x] Student course gallery + detail flow
- [x] Reusable modular UI components
- [x] Full Composition API implementation

## 🐛 Known Limitations

1. Beberapa data masih mock/static (belum terhubung ke API real)
2. Upload material masih level prototype UI (belum persistence backend)
3. Supabase env wajib diisi untuk menghilangkan warning runtime
4. Preview production perlu override preset bila ingin lokal preview

## 🔮 Next Enhancements

- [ ] Integrasi data real dari Supabase/Prisma untuk dashboard
- [ ] Teacher materials management page (`/teacher/materials`)
- [ ] Course player mode (video/reading/quiz tabs)
- [ ] Role-based auth guard per layout/page
- [ ] Empty/error/loading states yang lebih kaya

---

### Contributor Notes
- Jaga konsistensi visual: glass halus, glow subtle, bukan neon berlebihan
- Prioritaskan reusable components di `app/components/ui/`
- Pertahankan layout yang clean dan spacing yang lega
