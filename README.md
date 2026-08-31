# Catatan App

Aplikasi catatan dan to-do list dengan React Native (Expo) menggunakan Supabase sebagai backend dan Zustand untuk state management.

## Struktur Folder (Clean Architecture)

```
catatan-app/
├── App.tsx                          # Entry point, Stack Navigator
├── lib/
│   └── supabase.js                  # Supabase client singleton
├── screens/
│   ├── LoginScreen.js               # Halaman login & register
│   ├── MainTab.js                   # Tab Navigator (Todo + Catatan)
│   ├── TodoScreen.js                # Halaman to-do list
│   └── NotesScreen.js               # Halaman catatan
├── src/
│   ├── constants/
│   │   ├── colors.js                # Warna tema (light/dark) & aksen
│   │   └── config.js                # Konfigurasi Supabase (URL, key)
│   ├── services/
│   │   ├── authService.js           # Autentikasi (signUp, signIn, signOut)
│   │   ├── todoService.js           # CRUD todos ke Supabase
│   │   └── noteService.js           # CRUD notes ke Supabase
│   ├── hooks/
│   │   ├── useAuth.js               # State autentikasi user
│   │   ├── useTodos.js              # State & aksi to-do list
│   │   └── useNotes.js              # State & aksi catatan
│   ├── components/
│   │   ├── ScreenHeader.js          # Header bare reusable
│   │   └── EmptyState.js            # Empty state bare reusable
│   └── store/
│       └── useThemeStore.js         # Zustand store untuk dark/light mode
├── assets/                          # Ikon & gambar
├── package.json
└── tsconfig.json
```

## Arsitektur

### Layer Diagram

```
┌─────────────────────────────────────┐
│            SCREENS (UI)             │  ← Hanya rendering & event handlers
├─────────────────────────────────────┤
│             HOOKS                   │  ← State management & logic
├─────────────────────────────────────┤
│           SERVICES                  │  ← API calls ke Supabase
├─────────────────────────────────────┤
│          CONSTANTS                  │  ← Warna, config, konstanta
└─────────────────────────────────────┘
```

### Prinsip Clean Architecture

1. **Tidak ada import `supabase` langsung di screens** — semua akses database lewat service
2. **Setiap fitur punya service & hook masing-masing** — auth, todo, notes terpisah
3. **Warna & konstanta terpusat** — tidak ada hardcode di screens
4. **Screens hanya panggil hooks & susun components** — logika ada di hooks

### Flow Data

```
User Input → Screen → Hook → Service → Supabase
                 ↑              ↓
              Re-render ← State Update
```

## Tech Stack

- **React Native** (Expo SDK 57)
- **Zustand** — State management (theme)
- **Supabase** — Backend (Auth + Database)
- **React Navigation** — Navigasi (Stack + Bottom Tab)

## Fitur

- ✅ Register & Login (Supabase Auth)
- ✅ CRUD Catatan (Create, Read, Update, Delete)
- ✅ To-Do List dengan toggle selesai
- ✅ Dark/Light Mode (Zustand)
- ✅ Data tersimpan di Supabase, terfilter per user
- ✅ Tab Navigator (Todo + Catatan)

## Menjalankan

```bash
npm install
npx expo start
```

## Database Schema

### Tabel `notes`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key ke auth.users |
| title | TEXT | Judul catatan |
| content | TEXT | Isi catatan |
| created_at | TIMESTAMPTZ | Waktu pembuatan |

### Tabel `todos`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key ke auth.users |
| text | TEXT | Teks todo |
| done | BOOLEAN | Status selesai |
| created_at | TIMESTAMPTZ | Waktu pembuatan |
