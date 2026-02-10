# 🎨 Checklist Uji Tampilan - Bagian Pembeli

## 📱 1. HEADER & NAVIGATION

### Header Component
- [ ] **Logo & Branding**
  - Logo "Wastra Digital" terlihat jelas
  - Subtitle "Kain Tradisional Bali" terlihat
  - Klik logo → redirect ke home (`/`)

- [ ] **Search Bar**
  - Search bar terlihat di desktop
  - Placeholder: "Cari produk, kategori, atau pengrajin..."
  - Ketik keyword → tekan Enter → redirect ke `/produk?search=keyword`
  - Klik icon search → redirect ke hasil pencarian
  - Clear button muncul saat ada input

- [ ] **Navigation Links**
  - "Beranda" → link ke `/`
  - "Katalog Produk" → link ke `/produk`
  - "Masuk" → muncul jika belum login, link ke `/onboarding`
  - Link aktif → underline & warna berbeda

- [ ] **Icon Notifikasi**
  - Icon bell terlihat
  - Belum login → klik → popup "Login Diperlukan"
  - Sudah login → klik → redirect ke `/notifications`
  - Hover effect → background berubah

- [ ] **Icon Keranjang**
  - Icon shopping bag terlihat
  - **Belum login:**
    - Cart count TIDAK muncul (bahkan jika ada item di localStorage)
    - Klik → popup "Login Diperlukan"
  - **Sudah login:**
    - Cart count muncul jika ada item (badge merah dengan angka)
    - Cart count tidak muncul jika cart kosong
    - Klik → redirect ke `/keranjang`
  - Hover effect → background berubah

- [ ] **User Menu Dropdown**
  - **Belum login:**
    - Icon user terlihat
    - Klik → redirect ke `/onboarding`
  - **Sudah login:**
    - Avatar user muncul (atau icon jika belum upload foto)
    - Klik → dropdown menu muncul dengan:
      - ✅ Profil Saya (icon user)
      - ✅ Pesanan Saya (icon cart)
      - ✅ Wishlist (icon heart)
      - ✅ Alamat Saya (icon map pin)
      - ─── (divider)
      - ✅ Keluar (icon logout, warna merah)
    - Klik menu item → redirect ke halaman sesuai
    - Klik "Keluar" → logout & redirect ke home

- [ ] **Responsive**
  - Desktop: semua elemen terlihat
  - Mobile: search bar tersembunyi, menu burger muncul
  - Sticky header → tetap di atas saat scroll

---

## 🏠 2. LANDING PAGE (Homepage)

### Hero Section
- [ ] **Hero Banner**
  - Banner/hero section terlihat
  - Judul & deskripsi jelas
  - CTA button (jika ada) → klik → redirect sesuai

### Featured Products
- [ ] **Produk Unggulan**
  - Grid produk terlihat
  - Card produk menampilkan:
    - ✅ Gambar produk (atau placeholder)
    - ✅ Nama produk
    - ✅ Harga (format: Rp 350.000)
    - ✅ Kategori (tag: Endek/Songket)
    - ✅ Nama pengrajin/toko
  - Hover card → efek hover (shadow/scale)
  - Klik card → redirect ke `/produk/:id`

### Categories
- [ ] **Kategori Produk**
  - Section kategori terlihat
  - Kategori "Endek" & "Songket" (jika ada)
  - Klik kategori → filter produk di katalog

### Footer
- [ ] **Footer**
  - Footer terlihat di bawah
  - Informasi kontak/links (jika ada)
  - Copyright notice

---

## 🛍️ 3. KATALOG PRODUK (`/produk`)

### Search & Filter
- [ ] **Search Bar**
  - Search bar terlihat di atas
  - Ketik keyword → hasil filter real-time
  - Query parameter di URL: `/produk?search=keyword`

- [ ] **Filter Kategori**
  - Dropdown/button kategori terlihat
  - Pilih "Endek" → hanya produk endek yang muncul
  - Pilih "Songket" → hanya produk songket yang muncul
  - Pilih "Semua" → semua produk muncul

- [ ] **Filter Harga**
  - Dropdown filter harga (jika ada)
  - Pilih range harga → produk ter-filter

### Product Grid
- [ ] **Grid Layout**
  - Grid produk responsive:
    - Desktop: 4 kolom
    - Tablet: 3 kolom
    - Mobile: 2 kolom
  - Spacing antar card konsisten
  - Card produk:
    - ✅ Gambar produk (ratio 1:1 atau sesuai)
    - ✅ Tag kategori (warna berbeda: Endek=blue, Songket=gold)
    - ✅ Nama produk (max 2 baris, ellipsis jika panjang)
    - ✅ Nama toko/pengrajin
    - ✅ Harga (format: Rp 350.000, warna merah/wastra-red)
  - Hover card → efek hover
  - Klik card → redirect ke `/produk/:id`

### Empty State
- [ ] **Tidak Ada Hasil**
  - Jika filter tidak ada hasil → pesan "Tidak ada produk yang ditemukan"
  - Pesan jelas & centered

---

## 📦 4. DETAIL PRODUK (`/produk/:id`)

### Product Images
- [ ] **Galeri Gambar**
  - Gambar utama terlihat besar
  - Thumbnail images di bawah (jika ada multiple images)
  - Klik thumbnail → gambar utama berubah
  - Klik gambar utama → modal fullscreen muncul (jika ada)
  - Image placeholder jika tidak ada gambar

### Product Info
- [ ] **Informasi Produk**
  - ✅ Nama produk (heading besar)
  - ✅ Harga (format: Rp 350.000, font besar & bold)
  - ✅ Rating & jumlah review (jika ada)
  - ✅ Kategori (tag)
  - ✅ Nama pengrajin/toko (dengan link ke profil pengrajin)
  - ✅ Deskripsi produk (text panjang, readable)
  - ✅ Spesifikasi (bahan, lebar, panjang, dll) dalam tabel

### Action Buttons
- [ ] **Tombol Aksi**
  - **"Tambah ke Keranjang"** (primary button, besar):
    - Belum login → klik → popup "Login Diperlukan"
    - Sudah login → klik → produk masuk cart, message success
    - Icon shopping cart terlihat
  - **"Wishlist"** (secondary button):
    - Belum login → klik → popup "Login Diperlukan"
    - Sudah login → klik → toggle wishlist
    - Icon heart → fill merah jika sudah di wishlist
    - Border merah jika sudah di wishlist
  - **"Chat Penjual"** (secondary button):
    - Belum login → klik → popup "Login Diperlukan"
    - Sudah login → klik → redirect ke `/chat/:sellerId?productId=:id`
    - Icon chat terlihat

### Related Products
- [ ] **Produk Terkait**
  - Section "Produk Lainnya" terlihat (jika ada)
  - Grid produk terkait
  - Klik → redirect ke detail produk lain

---

## 🛒 5. KERANJANG (`/keranjang`)

### Header
- [ ] **Judul Halaman**
  - "Keranjang Saya" terlihat jelas
  - Breadcrumb/back button (jika ada)

### Cart Items
- [ ] **Daftar Item**
  - Tabel/list item terlihat
  - Setiap item menampilkan:
    - ✅ Checkbox untuk select/deselect
    - ✅ Gambar produk (thumbnail kecil)
    - ✅ Nama produk
    - ✅ Harga per item
    - ✅ Quantity input (dengan +/- button)
    - ✅ Subtotal per item (harga × quantity)
    - ✅ Tombol hapus (icon trash)
  - Update quantity → subtotal ter-update
  - Hapus item → konfirmasi muncul, item terhapus
  - Select all checkbox → semua item ter-select

### Cart Summary
- [ ] **Ringkasan Keranjang**
  - Card summary terlihat (sticky di kanan/bawah)
  - Menampilkan:
    - ✅ Subtotal
    - ✅ Ongkos kirim (jika sudah pilih alamat)
    - ✅ Total
  - **Tombol "Lanjut ke Checkout"**:
    - Disabled jika tidak ada item ter-select
    - Enabled jika ada item ter-select
    - Klik → redirect ke `/checkout`

### Empty State
- [ ] **Keranjang Kosong**
  - Pesan "Keranjang Anda kosong"
  - Icon/illustration (jika ada)
  - Tombol "Mulai Belanja" → redirect ke `/produk`

---

## 💳 6. CHECKOUT (`/checkout`)

### Header
- [ ] **Judul & Progress**
  - "Checkout" terlihat jelas
  - Progress indicator (jika ada): Keranjang → Checkout → Selesai

### Shipping Address
- [ ] **Alamat Pengiriman**
  - Section "Alamat Pengiriman" terlihat
  - **Dropdown Alamat:**
    - Default address auto-load & ter-select
    - Dropdown menampilkan semua alamat tersimpan
    - Format alamat: "Nama Penerima - Jalan, Kecamatan, Kabupaten, Provinsi"
    - Klik dropdown → pilih alamat lain
  - **Tambah Alamat Baru:**
    - Button "Tambah Alamat Baru" terlihat
    - Klik → form alamat muncul (modal atau inline)
    - Form: Nama, Telepon, Jalan, Provinsi, Kabupaten, Kecamatan, Kode Pos
    - Dropdown provinsi → kabupaten muncul
    - Dropdown kabupaten → kecamatan muncul
    - Submit → alamat tersimpan & ter-select

### Order Items
- [ ] **Produk yang Dipesan**
  - List produk ter-select dari cart
  - Setiap item menampilkan:
    - ✅ Gambar produk
    - ✅ Nama produk
    - ✅ Quantity
    - ✅ Harga per item
    - ✅ Subtotal per item

### Voucher (jika ada)
- [ ] **Kode Voucher**
  - Input kode voucher terlihat
  - Button "Gunakan" → apply voucher
  - Diskon ter-apply ke total

### Shipping Method
- [ ] **Metode Pengiriman**
  - Radio button/select metode pengiriman
  - Pilih metode → ongkos kirim ter-update
  - Estimasi waktu pengiriman terlihat

### Payment Method
- [ ] **Metode Pembayaran**
  - Radio button pilihan:
    - ✅ COD (Cash on Delivery)
    - ✅ Bank Transfer
  - **Jika Bank Transfer:**
    - Info rekening bank muncul
    - Upload bukti transfer muncul:
      - Button "Pilih File" atau drag & drop
      - Preview file yang di-upload
      - Format: JPG/PNG/PDF
      - Max size: 5MB
      - Error message jika format/size salah

### Order Summary
- [ ] **Ringkasan Pesanan**
  - Card summary (sticky di kanan/bawah)
  - Menampilkan:
    - ✅ Subtotal
    - ✅ Ongkos kirim
    - ✅ Diskon (jika ada voucher)
    - ✅ **Total** (font besar & bold)
  - **Tombol "Buat Pesanan"**:
    - Disabled jika form belum lengkap
    - Enabled jika semua valid
    - Loading state saat submit
    - Klik → redirect ke `/order-success`

### Validation
- [ ] **Validasi Form**
  - Alamat kosong → error message
  - Item kosong → error message
  - Bukti transfer kosong (bank transfer) → warning/error

---

## ✅ 7. ORDER SUCCESS (`/order-success`)

### Success Message
- [ ] **Pesan Sukses**
  - Icon checkmark/success terlihat
  - Pesan "Pesanan Berhasil Dibuat!" terlihat jelas
  - ID pesanan terlihat (format: #ABC12345)

### Order Details
- [ ] **Detail Pesanan**
  - **Produk yang Dipesan:**
    - List produk dengan gambar, nama, quantity, harga
    - Subtotal produk terlihat
  - **Pengiriman:**
    - Alamat pengiriman lengkap terlihat
    - Format: Jalan, Kecamatan, Kabupaten, Provinsi, Kode Pos
  - **Pembayaran:**
    - Metode pembayaran terlihat
    - Info rekening (jika bank transfer)
    - Status: "Menunggu Pembayaran" atau "Diproses"
  - **Ringkasan:**
    - ✅ Subtotal (format: Rp 350.000)
    - ✅ Ongkos kirim (format: Rp 25.000)
    - ✅ **Total** (format: Rp 375.000, font besar)

### Action Buttons
- [ ] **Tombol Aksi**
  - "Lihat Pesanan" → redirect ke `/pesanan`
  - "Kembali ke Beranda" → redirect ke `/`

---

## 📋 8. RIWAYAT PESANAN (`/pesanan`)

### Header & Filter
- [ ] **Judul & Filter**
  - "Pesanan Saya" terlihat jelas
  - Filter dropdown/buttons:
    - Semua
    - Menunggu Pembayaran
    - Diproses
    - Dikirim
    - Selesai
    - Dibatalkan
  - Pilih filter → hanya pesanan dengan status tersebut yang muncul

### Order List
- [ ] **Daftar Pesanan**
  - Card/list pesanan terlihat
  - Setiap card menampilkan:
    - ✅ ID pesanan (format: #ABC12345)
    - ✅ Tanggal pesanan
    - ✅ Status (tag dengan warna):
      - Menunggu Pembayaran → orange
      - Diproses → blue
      - Dikirim → cyan
      - Selesai → green
      - Dibatalkan → red
    - ✅ Produk (gambar thumbnail + nama, max 2-3 produk)
    - ✅ Total (format: Rp 375.000)
    - ✅ Tombol "Lihat Detail"
    - ✅ Tombol "Konfirmasi Pembayaran" (jika status = pending + ada bukti)
    - ✅ Tombol "Batalkan" (jika status = pending/processing)

### Order Detail Modal
- [ ] **Modal Detail Pesanan**
  - Klik "Lihat Detail" → modal muncul
  - Modal menampilkan:
    - ✅ ID pesanan
    - ✅ Status (tag)
    - ✅ Tanggal pesanan
    - ✅ **Daftar produk lengkap:**
      - Gambar, nama, quantity, harga per item, subtotal
    - ✅ **Alamat pengiriman lengkap**
    - ✅ **Ringkasan pembayaran:**
      - Subtotal
      - Ongkos kirim
      - Total
    - ✅ **Info pembayaran:**
      - Metode pembayaran
      - Info rekening (jika bank transfer)
      - Bukti transfer (jika ada, preview image)
    - ✅ **Aksi:**
      - "Konfirmasi Pembayaran" (jika pending + ada bukti)
      - "Batalkan Pesanan" (jika pending/processing)
      - "Chat Penjual" (jika ada)

### Actions
- [ ] **Konfirmasi Pembayaran**
  - Tombol muncul untuk pesanan "Menunggu Pembayaran" dengan bukti transfer
  - Klik → status berubah ke "Diproses"
  - Message success muncul

- [ ] **Batalkan Pesanan**
  - Tombol muncul untuk pesanan "Pending" atau "Processing"
  - Klik → modal konfirmasi muncul:
    - Pesan konfirmasi
    - Info refund (COD vs Bank Transfer berbeda)
  - Konfirmasi → status berubah ke "Dibatalkan"
  - Message success muncul

### Empty State
- [ ] **Tidak Ada Pesanan**
  - Filter tidak ada hasil → pesan "Tidak ada pesanan dengan status ini"
  - Belum ada pesanan sama sekali → pesan "Belum ada pesanan"

---

## 👤 9. PROFIL SAYA (`/profil`)

### Header
- [ ] **Judul & Back Button**
  - "Profil Saya" terlihat jelas
  - Back button → kembali ke halaman sebelumnya

### Tabs
- [ ] **Tab Navigation**
  - Tab "Profil" (active default)
  - Tab "Ubah Kata Sandi"
  - Klik tab → konten berubah

### Tab: Profil
- [ ] **Foto Profil**
  - Avatar besar (120px) terlihat
  - Foto profil ter-load (jika sudah upload)
  - Icon user jika belum upload
  - Icon camera di pojok → klik → file picker muncul
  - Upload foto → preview muncul, tersimpan
  - Validasi: JPG/PNG, max 2MB

- [ ] **Form Profil**
  - Nama Lengkap (input, required)
  - Email (input, disabled, tidak bisa edit)
  - Nomor Telepon (input, required, format validasi)
  - Peran (input, disabled, menampilkan "Pembeli")
  - Tombol "Simpan Perubahan" (primary, besar)
  - Submit → message success, data ter-update

### Tab: Ubah Kata Sandi
- [ ] **Form Password**
  - Kata Sandi Saat Ini (password input)
  - Kata Sandi Baru (password input, min 8 karakter)
  - Konfirmasi Kata Sandi Baru (password input, harus sama)
  - Validasi:
    - Password baru minimal 8 karakter
    - Konfirmasi harus sama dengan password baru
  - Tombol "Ubah Kata Sandi" (primary, besar)
  - Submit → message success, form reset

### Logout
- [ ] **Tombol Keluar**
  - Tombol "Keluar" (danger/red) di bawah
  - Klik → logout, redirect ke home, message success

---

## 📍 10. ALAMAT SAYA (`/alamat`)

### Header
- [ ] **Judul & Add Button**
  - "Alamat Saya" terlihat jelas
  - Tombol "Tambah Alamat Baru" (primary) terlihat

### Address List
- [ ] **Daftar Alamat**
  - Card/list alamat terlihat
  - Setiap card menampilkan:
    - ✅ Nama penerima
    - ✅ Nomor telepon
    - ✅ Alamat lengkap (Jalan, Kecamatan, Kabupaten, Provinsi, Kode Pos)
    - ✅ Badge "Default" (jika alamat default)
    - ✅ Tombol "Ubah"
    - ✅ Tombol "Hapus"
    - ✅ Tombol "Set sebagai Default" (jika bukan default)

### Add/Edit Address Form
- [ ] **Form Alamat**
  - Modal atau inline form muncul
  - Fields:
    - ✅ Label Alamat (contoh: "Rumah", "Kantor")
    - ✅ Nama Penerima (required)
    - ✅ Nomor Telepon (required)
    - ✅ Jalan (textarea, required)
    - ✅ Provinsi (dropdown, required)
    - ✅ Kabupaten/Kota (dropdown, required, muncul setelah pilih provinsi)
    - ✅ Kecamatan (dropdown, required, muncul setelah pilih kabupaten)
    - ✅ Kode Pos (input, required)
  - **Dropdown Dinamis:**
    - Pilih Provinsi → dropdown Kabupaten ter-populate
    - Pilih Kabupaten → dropdown Kecamatan ter-populate
  - Checkbox "Set sebagai Alamat Default"
  - Tombol "Simpan" & "Batal"

### Actions
- [ ] **Ubah Alamat**
  - Klik "Ubah" → form muncul dengan data ter-load
  - Edit data → submit → alamat ter-update

- [ ] **Hapus Alamat**
  - Klik "Hapus" → konfirmasi muncul
  - Konfirmasi → alamat terhapus
  - Tidak bisa hapus alamat default (atau ada validasi)

- [ ] **Set Default**
  - Klik "Set sebagai Default" → alamat menjadi default
  - Badge "Default" muncul
  - Alamat default sebelumnya kehilangan badge

### Empty State
- [ ] **Belum Ada Alamat**
  - Pesan "Belum ada alamat. Tambah alamat pertama Anda!"
  - Tombol "Tambah Alamat Baru"

---

## ❤️ 11. WISHLIST (`/wishlist`)

### Header
- [ ] **Judul**
  - "Wishlist Saya" terlihat jelas

### Wishlist Items
- [ ] **Daftar Wishlist**
  - Grid/list produk terlihat
  - Setiap item menampilkan:
    - ✅ Gambar produk
    - ✅ Nama produk
    - ✅ Harga (format: Rp 350.000)
    - ✅ Nama pengrajin/toko
    - ✅ Tombol "Tambah ke Keranjang"
    - ✅ Tombol "Hapus dari Wishlist" (icon heart/X)
  - Klik gambar/nama → redirect ke `/produk/:id`
  - Klik "Tambah ke Keranjang" → produk masuk cart, message success
  - Klik "Hapus" → produk terhapus dari wishlist, message success

### Empty State
- [ ] **Wishlist Kosong**
  - Pesan "Belum ada produk di wishlist Anda"
  - Icon/illustration (jika ada)
  - Tombol "Jelajahi Produk" → redirect ke `/produk`

---

## 💬 12. CHAT PENJUAL (`/chat/:sellerId`)

### Header
- [ ] **Header Chat**
  - Nama penjual/pengrajin terlihat
  - Avatar penjual (jika ada)
  - Status online/offline (jika ada)
  - Back button → kembali ke halaman sebelumnya

### Product Info (jika dari product detail)
- [ ] **Info Produk**
  - Jika ada `productId` di URL:
    - Card produk muncul di atas chat
    - Menampilkan: gambar, nama, harga
    - Klik → redirect ke detail produk

### Chat Messages
- [ ] **Pesan Chat**
  - List pesan terlihat (scrollable)
  - Pesan user → align kanan, bubble biru/hijau
  - Pesan seller → align kiri, bubble abu-abu
  - Timestamp setiap pesan (jika ada)
  - Auto-scroll ke pesan terbaru

### Input Area
- [ ] **Input Pesan**
  - Text input terlihat di bawah
  - Placeholder: "Ketik pesan..."
  - Button "Kirim" (atau icon send)
  - Ketik pesan → klik kirim → pesan muncul
  - Simulasi reply dari seller (jika ada)

### Empty State
- [ ] **Belum Ada Pesan**
  - Pesan "Mulai percakapan dengan penjual"
  - Input area tetap terlihat

---

## 🔔 13. NOTIFIKASI (`/notifications`)

### Header
- [ ] **Judul**
  - "Notifikasi" terlihat jelas

### Notification List
- [ ] **Daftar Notifikasi**
  - List notifikasi terlihat
  - Setiap notifikasi menampilkan:
    - ✅ Icon (bell/info/success/error)
    - ✅ Judul notifikasi
    - ✅ Pesan/deskripsi
    - ✅ Timestamp
    - ✅ Status read/unread (badge atau styling berbeda)
  - Klik notifikasi → redirect ke halaman terkait (jika ada)
  - Mark as read (jika ada fitur)

### Empty State
- [ ] **Tidak Ada Notifikasi**
  - Pesan "Belum ada notifikasi"

---

## 🎨 14. UI/UX GENERAL

### Colors & Typography
- [ ] **Warna Tema**
  - Warna wastra-brown konsisten di semua halaman
  - Primary buttons → wastra-brown-600
  - Hover effects → wastra-brown-700
  - Text colors → wastra-brown-800 (heading), wastra-brown-600 (body)

- [ ] **Typography**
  - Font size konsisten (heading besar, body normal)
  - Font weight: semibold untuk heading, normal untuk body
  - Line height readable

### Spacing & Layout
- [ ] **Spacing**
  - Padding & margin konsisten
  - Container max-width sesuai (tidak terlalu lebar)
  - Gap antar elemen cukup (tidak terlalu rapat)

- [ ] **Layout**
  - Content centered (container mx-auto)
  - Cards dengan border & rounded corners
  - Shadow/box-shadow untuk depth (jika ada)

### Buttons
- [ ] **Button Styles**
  - Primary button: wastra-brown-600, text putih
  - Secondary button: border wastra-brown, text wastra-brown
  - Danger button: merah
  - Size: large untuk CTA, default untuk aksi biasa
  - Hover effects → background berubah
  - Disabled state → opacity berkurang, cursor not-allowed

### Forms
- [ ] **Form Elements**
  - Input size: large untuk form penting
  - Label jelas & required indicator (*)
  - Error message muncul di bawah input (warna merah)
  - Success message muncul (warna hijau)
  - Placeholder text membantu

### Loading States
- [ ] **Loading Indicators**
  - Button loading → spinner muncul, text "Loading..."
  - Page loading → skeleton atau spinner (jika ada)
  - Tidak bisa double-click saat loading

### Transitions
- [ ] **Page Transitions**
  - Pindah halaman → fade effect (200ms)
  - Smooth, tidak terasa lag
  - Tidak ada flash atau jump

### Responsive
- [ ] **Mobile/Tablet/Desktop**
  - Layout responsive di berbagai ukuran:
    - Desktop (> 1024px): full layout
    - Tablet (768px - 1024px): layout menyesuaikan
    - Mobile (< 768px): layout stack, hamburger menu
  - Tabel bisa di-scroll horizontal di mobile
  - Form tidak terpotong di mobile
  - Buttons cukup besar untuk tap di mobile

---

## ✅ CHECKLIST RINGKAS - TAMPILAN PEMBELI

### Prioritas Tinggi (Must Check)
1. ✅ Header & Navigation (logo, search, cart, user menu)
2. ✅ Katalog Produk (grid, filter, search)
3. ✅ Detail Produk (gambar, info, tombol aksi)
4. ✅ Keranjang (list item, summary, checkout button)
5. ✅ Checkout (alamat, pembayaran, summary)
6. ✅ Order Success (detail pesanan, ringkasan)
7. ✅ Riwayat Pesanan (list, filter, detail modal)
8. ✅ Profil Saya (edit profil, upload foto, ubah password)

### Prioritas Sedang
1. ⚠️ Alamat Saya (CRUD alamat, dropdown dinamis)
2. ⚠️ Wishlist (list produk, tambah ke cart)
3. ⚠️ Chat Penjual (interface chat)
4. ⚠️ Notifikasi (list notifikasi)

### Prioritas Rendah
1. ℹ️ Landing Page (hero, featured products)
2. ℹ️ Responsive design
3. ℹ️ Loading states
4. ℹ️ Empty states

---

## 📝 CATATAN TESTING

**Tanggal:** _______________

**Browser:** _______________

**Device:** _______________

**Issues Found:**

### Visual Issues
1. 
2. 
3. 

### Functional Issues
1. 
2. 
3. 

### Responsive Issues
1. 
2. 
3. 

### Notes:
- 

---

**Tips:**
- Screenshot setiap halaman untuk dokumentasi
- Test di berbagai ukuran layar (mobile, tablet, desktop)
- Test dengan data berbeda (cart penuh, cart kosong, banyak pesanan, dll)
- Perhatikan konsistensi warna, spacing, typography
- Cek semua tombol, link, dan interaksi


