# 📋 Daftar Uji Coba - Wastra Digital

## 🔐 1. AUTENTIKASI & ROLE-BASED ACCESS

### Login & Register
- [ ] **Login sebagai Pembeli**
  - Pilih role "Pembeli" di onboarding
  - Login dengan email/password
  - Redirect ke `/produk` setelah login
  - Menu header menampilkan menu pembeli (Profil, Pesanan, Wishlist, Alamat)

- [ ] **Login sebagai Pengrajin**
  - Pilih role "Pengrajin" di onboarding
  - Login dengan email/password
  - Redirect ke `/pengrajin` (dashboard) setelah login
  - Menu header menampilkan menu pengrajin (Dashboard, Kelola Produk, Pesanan Masuk, Profil)

- [ ] **Login sebagai Admin**
  - Pilih role "Admin BUMDes" di onboarding
  - Login dengan email/password
  - Redirect ke `/admin` setelah login

- [ ] **Register Akun Baru**
  - Daftar dengan role berbeda (Pembeli, Pengrajin, Admin)
  - Verifikasi data tersimpan di localStorage
  - Auto-redirect setelah register

### Protected Routes
- [ ] **Akses tanpa login**
  - Coba akses `/keranjang` → harus redirect ke `/onboarding`
  - Coba akses `/checkout` → harus redirect ke `/onboarding`
  - Coba akses `/pengrajin` → harus redirect ke `/onboarding`
  - Coba akses `/profil` → harus redirect ke `/onboarding`
  - Coba akses `/pesanan` → harus redirect ke `/onboarding`
  - Coba akses `/chat/:sellerId` → harus redirect ke `/onboarding`

- [ ] **Akses dengan role yang salah**
  - Login sebagai Pembeli, coba akses `/pengrajin` → harus redirect ke `/`
  - Login sebagai Pengrajin, coba akses `/admin` → harus redirect ke `/`
  - Login sebagai Pembeli, coba akses `/admin` → harus redirect ke `/`

### Popup Konfirmasi Login
- [ ] **Klik fitur tanpa login**
  - Klik "Tambah ke Keranjang" → popup muncul, klik "Login" → redirect ke onboarding
  - Klik "Tambah ke Keranjang" → popup muncul, klik "Batal" → tetap di halaman
  - Klik "Wishlist" → popup muncul
  - Klik "Chat Penjual" → popup muncul
  - Klik icon "Keranjang" di header → popup muncul
  - Klik icon "Notifikasi" di header → popup muncul

### Cart Count di Header
- [ ] **Cart count visibility**
  - Belum login → cart count tidak muncul (0)
  - Sudah login dengan cart kosong → cart count tidak muncul
  - Sudah login dengan cart berisi → cart count muncul dengan jumlah yang benar

---

## 👤 2. FITUR PEMBELI (CUSTOMER)

### Profil & Akun
- [ ] **UserProfile (`/profil`)**
  - Edit nama lengkap → tersimpan
  - Edit nomor telepon → tersimpan
  - Upload foto profil (JPG/PNG, max 2MB) → tersimpan dan persist setelah refresh
  - Upload foto profil dengan format salah → error message
  - Upload foto profil > 2MB → error message
  - Ubah kata sandi → validasi password lama, password baru, konfirmasi
  - Logout → redirect ke home, data terhapus

### Pesanan
- [ ] **OrderHistory (`/pesanan`)**
  - Lihat daftar semua pesanan
  - Filter pesanan berdasarkan status (Semua, Menunggu Pembayaran, Diproses, dll)
  - Klik "Lihat Detail" → modal detail pesanan muncul
  - Detail pesanan menampilkan: ID, produk, total, alamat, status
  - Untuk pesanan "Menunggu Pembayaran" → tombol "Konfirmasi Pembayaran" muncul
  - Klik "Konfirmasi Pembayaran" → status berubah ke "Diproses"
  - Untuk pesanan "Pending" atau "Processing" → tombol "Batalkan" muncul
  - Klik "Batalkan" → popup konfirmasi muncul
  - Batalkan pesanan COD → pesan refund sesuai
  - Batalkan pesanan Bank Transfer → pesan refund sesuai
  - Status pesanan ter-update setelah aksi

### Alamat
- [ ] **AddressManagement (`/alamat`)**
  - Tambah alamat baru → form lengkap (jalan, provinsi, kabupaten, kecamatan, kode pos)
  - Pilih provinsi → dropdown kabupaten muncul
  - Pilih kabupaten → dropdown kecamatan muncul
  - Set alamat sebagai default → badge "Default" muncul
  - Edit alamat → data ter-load di form
  - Hapus alamat → konfirmasi muncul, alamat terhapus
  - Hapus alamat default → tidak bisa (atau ada validasi)

### Wishlist
- [ ] **Wishlist (`/wishlist`)**
  - Tambah produk ke wishlist dari ProductDetail → muncul di wishlist
  - Hapus dari wishlist → produk terhapus
  - Tambah ke keranjang dari wishlist → produk masuk cart
  - Wishlist persist setelah refresh page

### Keranjang & Checkout
- [ ] **Cart (`/keranjang`)**
  - Tambah produk ke keranjang → muncul di cart
  - Update quantity → total ter-update
  - Hapus item → item terhapus
  - Select/deselect item → checkbox berfungsi
  - Hapus selected items → hanya item terpilih yang terhapus
  - Cart persist setelah refresh

- [ ] **Checkout (`/checkout`)**
  - Pilih alamat pengiriman → dropdown alamat muncul
  - Alamat default auto-load → terpilih otomatis
  - Tambah alamat baru dari checkout → form muncul, alamat tersimpan
  - Pilih metode pembayaran (COD/Bank Transfer)
  - Upload bukti transfer (JPG/PNG/PDF, max 5MB) → preview muncul
  - Upload bukti transfer format salah → error message
  - Upload bukti transfer > 5MB → error message
  - Checkout dengan COD → status "processing", redirect ke OrderSuccess
  - Checkout dengan Bank Transfer + bukti → status "processing", redirect ke OrderSuccess
  - Checkout dengan Bank Transfer tanpa bukti → status "pending", redirect ke OrderSuccess
  - Setelah checkout → item terpilih terhapus dari cart
  - Subtotal dan shipping cost ter-display dengan benar di OrderSuccess

### OrderSuccess
- [ ] **OrderSuccess (`/order-success`)**
  - Menampilkan ID pesanan
  - Menampilkan produk yang dibeli
  - Menampilkan subtotal dengan benar
  - Menampilkan ongkos kirim dengan benar
  - Menampilkan total dengan benar
  - Menampilkan alamat pengiriman dengan benar
  - Tombol "Lihat Pesanan" → redirect ke `/pesanan`

---

## 🛠️ 3. FITUR PENGRAJIN (ARTISAN)

### Dashboard
- [ ] **ArtisanDashboard (`/pengrajin`)**
  - Statistik menampilkan data yang benar:
    - Total Produk
    - Total Pesanan
    - Pesanan Pending
    - Total Pendapatan
  - Quick Actions:
    - "Tambah Produk Baru" → redirect ke `/pengrajin/produk/tambah`
    - "Kelola Produk" → redirect ke `/pengrajin/produk`
    - "Lihat Semua Pesanan" → redirect ke `/pengrajin/pesanan`
  - Tabel "Pesanan Terbaru" menampilkan 5 pesanan terbaru
  - Klik "Detail" di tabel → redirect ke detail pesanan

### Kelola Produk
- [ ] **ArtisanProducts (`/pengrajin/produk`)**
  - **List Produk:**
    - Tabel menampilkan semua produk pengrajin
    - Kolom: Gambar, Nama, Kategori, Harga, Stok, Status, Aksi
    - Status "Aktif" → tag hijau
    - Status "Nonaktif" → tag merah
  
  - **Tambah Produk (`/pengrajin/produk/tambah`):**
    - Form: Nama, Kategori, Deskripsi, Harga, Stok, Gambar
    - Validasi semua field required
    - Upload gambar (maks 5 gambar)
    - Submit → produk tersimpan, redirect ke list
    - Produk baru muncul di tabel
  
  - **Edit Produk (`/pengrajin/produk/:id`):**
    - Data produk ter-load di form
    - Edit data → submit → produk ter-update
    - Update tersimpan di tabel
  
  - **Hapus Produk:**
    - Klik "Hapus" → popup konfirmasi muncul
    - Konfirmasi hapus → produk terhapus dari tabel
    - Batal → produk tetap ada

### Kelola Pesanan
- [ ] **ArtisanOrders (`/pengrajin/pesanan`)**
  - **List Pesanan:**
    - Tabel menampilkan pesanan yang relevan untuk pengrajin ini
    - Filter berdasarkan status → hanya pesanan dengan status tersebut yang muncul
    - Kolom: ID, Pembeli, Produk, Total, Status, Tanggal, Aksi
  
  - **Detail Pesanan (`/pengrajin/pesanan/:id`):**
    - Modal detail muncul dengan informasi lengkap
    - Menampilkan: ID, Pembeli, Status, Tanggal, Produk, Total, Alamat
    - Untuk status "Diproses" → tombol "Tandai Sebagai Dikirim" muncul
    - Untuk status "Dikirim" → tombol "Tandai Sebagai Selesai" muncul
  
  - **Update Status:**
    - Klik "Kirim" untuk pesanan "Diproses" → status berubah ke "Dikirim"
    - Klik "Selesai" untuk pesanan "Dikirim" → status berubah ke "Selesai"
    - Status ter-update di tabel dan detail

### Profil Pengrajin
- [ ] **ArtisanProfile (`/pengrajin/profil`)**
  - Edit nama pengrajin → tersimpan
  - Edit nomor telepon → tersimpan
  - Upload foto profil → tersimpan dan persist
  - Ubah kata sandi → validasi dan tersimpan
  - Logout → redirect ke home

---

## 🔄 4. INTEGRASI & ALUR LENGKAP

### Alur Pembeli
- [ ] **Alur Belanja Lengkap:**
  1. Login sebagai Pembeli
  2. Browse produk di `/produk`
  3. Klik produk → lihat detail di `/produk/:id`
  4. Tambah ke wishlist → muncul di `/wishlist`
  5. Tambah ke keranjang → muncul di `/keranjang`
  6. Pilih item → checkout
  7. Pilih alamat (atau tambah baru)
  8. Pilih metode pembayaran
  9. Upload bukti transfer (jika bank transfer)
  10. Submit → redirect ke OrderSuccess
  11. Item terhapus dari cart
  12. Pesanan muncul di `/pesanan`
  13. Pengrajin bisa lihat pesanan di `/pengrajin/pesanan`

### Alur Pengrajin
- [ ] **Alur Kelola Produk & Pesanan:**
  1. Login sebagai Pengrajin
  2. Dashboard → lihat statistik
  3. Tambah produk baru → form muncul, submit
  4. Produk muncul di list produk
  5. Edit produk → update data
  6. Produk muncul di katalog pembeli (jika aktif)
  7. Pembeli beli produk → pesanan muncul di `/pengrajin/pesanan`
  8. Update status pesanan: Diproses → Dikirim → Selesai
  9. Pembeli lihat update status di `/pesanan`

### Sinkronisasi Data
- [ ] **Data Persist:**
  - Refresh page → data tetap ada (localStorage)
  - Logout → data user terhapus
  - Login lagi → data user ter-load
  - Cart persist setelah refresh
  - Wishlist persist setelah refresh
  - Alamat persist setelah refresh
  - Pesanan persist setelah refresh

---

## 🎨 5. UI/UX & TRANSISI

### Transisi Halaman
- [ ] **Page Transitions:**
  - Pindah halaman → ada fade effect (200ms)
  - Transisi smooth, tidak terasa lag
  - Tidak ada flash atau jump

### Responsive Design
- [ ] **Mobile/Tablet/Desktop:**
  - Layout responsive di berbagai ukuran layar
  - Tabel bisa di-scroll horizontal di mobile
  - Form tidak terpotong di mobile
  - Menu dropdown berfungsi di mobile

### Visual Feedback
- [ ] **Loading States:**
  - Button loading saat submit form
  - Tidak bisa double-click saat loading
  - Message success/error muncul dengan jelas

- [ ] **Empty States:**
  - Cart kosong → pesan "Keranjang kosong"
  - Wishlist kosong → pesan "Belum ada wishlist"
  - Pesanan kosong → pesan "Belum ada pesanan"
  - Produk kosong → pesan "Belum ada produk"

---

## ⚠️ 6. ERROR HANDLING & EDGE CASES

### Validasi Form
- [ ] **Form Validation:**
  - Required fields → error message muncul
  - Email format → validasi format
  - Password min 8 karakter → validasi
  - Nomor telepon → validasi format
  - Harga/Stok → hanya angka positif

### File Upload
- [ ] **File Validation:**
  - Foto profil: JPG/PNG, max 2MB
  - Bukti transfer: JPG/PNG/PDF, max 5MB
  - Gambar produk: JPG/PNG, max 5MB per gambar
  - Format salah → error message
  - Ukuran terlalu besar → error message

### Edge Cases
- [ ] **Edge Cases:**
  - Hapus alamat terakhir → tidak bisa (atau ada validasi)
  - Hapus semua item di cart → cart kosong
  - Checkout dengan cart kosong → tidak bisa (validasi)
  - Update status pesanan yang sudah selesai → tidak bisa
  - Akses URL langsung tanpa login → redirect ke onboarding
  - Akses URL dengan ID yang tidak ada → error handling

---

## 🔍 7. TESTING KHUSUS

### Browser Compatibility
- [ ] **Browser Testing:**
  - Chrome/Edge (Chromium)
  - Firefox
  - Safari (jika ada Mac)
  - Mobile browser (Chrome Mobile, Safari Mobile)

### Performance
- [ ] **Performance:**
  - Halaman load cepat (< 2 detik)
  - Tidak ada lag saat scroll
  - Transisi smooth
  - Tidak ada memory leak (test dengan banyak aksi)

### Data Integrity
- [ ] **Data Consistency:**
  - Data tidak hilang setelah refresh
  - Data tidak duplikat
  - Status pesanan konsisten antara pembeli dan pengrajin
  - Cart count akurat

---

## ✅ CHECKLIST RINGKAS

### Prioritas Tinggi (Must Test)
1. ✅ Login/Register untuk semua role
2. ✅ Protected routes (akses tanpa login)
3. ✅ Role-based menu di header
4. ✅ Popup konfirmasi login
5. ✅ Cart & Checkout flow
6. ✅ Kelola produk pengrajin (CRUD)
7. ✅ Kelola pesanan pengrajin
8. ✅ Update status pesanan
9. ✅ Data persist (localStorage)

### Prioritas Sedang
1. ⚠️ Upload file (foto profil, bukti transfer, gambar produk)
2. ⚠️ Validasi form
3. ⚠️ Filter & search
4. ⚠️ Transisi halaman

### Prioritas Rendah
1. ℹ️ Responsive design
2. ℹ️ Browser compatibility
3. ℹ️ Performance optimization

---

## 📝 CATATAN TESTING

**Tanggal Testing:** _______________

**Tester:** _______________

**Browser:** _______________

**OS:** _______________

**Issues Found:**
1. 
2. 
3. 

**Notes:**
- 

---

**Tips Testing:**
- Gunakan browser DevTools untuk cek localStorage
- Test dengan data berbeda (banyak produk, banyak pesanan)
- Test dengan role berbeda di tab browser berbeda
- Clear localStorage jika perlu reset data
- Test edge cases (empty states, invalid input, dll)


