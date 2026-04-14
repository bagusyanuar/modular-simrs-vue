# Brainstorming: Sidebar & Layout Assembly

## 🏁 Current Progress

Berhasil mengimplementasikan sistem Sidebar modular dengan spesifikasi premium:

- [x] **NSidebar**: Root provider dengan state `collapsed` (Provide/Inject).
- [x] **NSidebarItem**: Menu item dengan active-state reporting.
- [x] **NSidebarGroup**: Logical grouping dengan auto-divider.
- [x] **Sidebar Tree**: Support nested menu (Multi-level) menggunakan **Reka UI (Collapsible)**.
- [x] **Auto-Expand**: Orang tua otomatis terbuka jika ada anak yang `active`.
- [x] **Styling**: Tailwind v4 + CVA, floating card design (`rounded-[32px]`), smooth transitions.

## 🧠 Brainstorming Agenda

### 1. Navbar Implementation

- **Positioning**: Sticky top atau ikut scroll? (Saran: Sticky).
- **Features**:
  - Search bar (Global search).
  - Notification center.
  - User profile dropdown.
  - Breadcrumbs generator otomatis berdasarkan route.

### 2. Main Layout Assembly (`GenLayout`)

- Bagaimana kita merakit Sidebar, Navbar, dan Main Content.
- **Responsive Handling**:
  - Desktop: Sidebar `relative/sticky`.
  - Mobile: Sidebar `fixed/overlay` dengan hamburger menu.

### 3. RBAC (Role Based Access Control)

- Dimana logic filtering menu ditaruh?
- Opsi:
  - **Level Component**: Item nge-cek permission sendiri (Kurang efisien).
  - **Level Hook/Store**: Menu data di-filter sebelum di-pass ke Sidebar (Lebih clean).

### 4. Breadcrumbs

- Integrasi dengan `vue-router` meta.
- Visual style: Minimalis atau path-based?

## 🚀 Next Step

- Menentukan desain Navbar agar "matching" dengan Sidebar yang sudah ada.
- Membuat wrapper layout utama (`packages/ui/src/components/shared/layouts`).
