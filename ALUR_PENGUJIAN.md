# 🔄 Alur Pengujian - Wastra Digital

## 📋 DAFTAR ISI
1. [Persiapan Testing](#persiapan-testing)
2. [Alur Pengujian Autentikasi](#alur-pengujian-autentikasi)
3. [Alur Pengujian Pembeli](#alur-pengujian-pembeli)
4. [Alur Pengujian Pengrajin](#alur-pengujian-pengrajin)
5. [Alur Pengujian Integrasi](#alur-pengujian-integrasi)

---

## 🛠️ PERSIAPAN TESTING

### Setup Awal
```bash
# 1. Jalankan aplikasi
npm run dev

# 2. Buka browser
# - Chrome/Edge (recommended)
# - Buka DevTools (F12)
# - Tab: Console, Network, Application (untuk cek localStorage)

# 3. Clear data sebelumnya (jika perlu)
# Di Console: localStorage.clear()
```

### Data Testing
- **User Pembeli:** email: `pembeli@test.com`, password: `test123`
- **User Pengrajin:** email: `pengrajin@test.com`, password: `test123`
- **User Admin:** email: `admin@test.com`, password: `test123`

---

## 🔐 ALUR PENGUJIAN AUTENTIKASI

### Flow 1: Register & Login Pertama Kali

#### Step 1: Register Akun Baru
```
1. Buka aplikasi → Homepage (/)
2. Klik "Masuk" di header → redirect ke /onboarding
3. Pilih role "Pembeli" → klik "Lanjut"
4. Step 2: Ringkasan → klik "Lanjut"
5. Step 3: Klik "Daftar" → redirect ke /daftar
6. Isi form:
   - Nama: "Test Pembeli"
   - Email: "pembeli@test.com"
   - Password: "test123"
   - Konfirmasi Password: "test123"
7. Klik "Daftar" → message success → redirect ke /masuk
```

**✅ Checklist:**
- [ ] Onboarding menampilkan 3 role dengan benar
- [ ] Step navigation berfungsi (Pilih Peran → Ringkasan → Masuk/Daftar)
- [ ] Form register validasi semua field
- [ ] Register berhasil, redirect ke login
- [ ] Data tersimpan di localStorage

#### Step 2: Login Setelah Register
```
1. Di halaman /masuk
2. Isi form:
   - Email: "pembeli@test.com"
   - Password: "test123"
3. Klik "Masuk" → message success → redirect ke /produk
```

**✅ Checklist:**
- [ ] Login berhasil
- [ ] Redirect ke /produk (default untuk pembeli)
- [ ] Header menampilkan menu pembeli
- [ ] User data ter-load dari localStorage

### Flow 2: Login dengan Role Berbeda

#### Test Login Pengrajin
```
1. Buka /onboarding
2. Pilih role "Pengrajin" → Lanjut → Lanjut
3. Klik "Masuk" → /masuk?role=artisan
4. Login dengan email/password
5. ✅ Redirect ke /pengrajin (dashboard)
6. ✅ Header menampilkan menu pengrajin
```

#### Test Login Admin
```
1. Buka /onboarding
2. Pilih role "Admin BUMDes" → Lanjut → Lanjut
3. Klik "Masuk" → /masuk?role=admin
4. Login dengan email/password
5. ✅ Redirect ke /admin
```

### Flow 3: Protected Routes (Tanpa Login)

#### Test Akses Tanpa Login
```
1. Clear localStorage (localStorage.clear())
2. Refresh page
3. Coba akses URL langsung:
   - /keranjang → ✅ redirect ke /onboarding
   - /checkout → ✅ redirect ke /onboarding
   - /profil → ✅ redirect ke /onboarding
   - /pesanan → ✅ redirect ke /onboarding
   - /pengrajin → ✅ redirect ke /onboarding
   - /admin → ✅ redirect ke /onboarding
```

### Flow 4: Popup Konfirmasi Login

#### Test Popup di Berbagai Fitur
```
1. Belum login, buka /produk
2. Klik produk → /produk/1
3. Klik "Tambah ke Keranjang" → ✅ popup muncul
   - Klik "Login" → redirect ke /onboarding
   - Klik "Batal" → popup tutup, tetap di halaman
4. Klik "Wishlist" → ✅ popup muncul
5. Klik "Chat Penjual" → ✅ popup muncul
6. Klik icon "Keranjang" di header → ✅ popup muncul
7. Klik icon "Notifikasi" di header → ✅ popup muncul
```

---

## 🛍️ ALUR PENGUJIAN PEMBELI

### Flow 1: Alur Belanja Lengkap (Happy Path)

#### Step 1: Browse Produk
```
1. Login sebagai Pembeli
2. Buka /produk (Katalog Produk)
3. ✅ Grid produk terlihat
4. Test Search:
   - Ketik "endek" di search bar
   - Tekan Enter → ✅ hasil filter muncul
   - URL: /produk?search=endek
5. Test Filter:
   - Pilih kategori "Endek" → ✅ hanya produk endek muncul
   - Pilih kategori "Songket" → ✅ hanya produk songket muncul
6. Klik card produk → redirect ke /produk/:id
```

**✅ Checklist:**
- [ ] Grid produk responsive (4 kolom desktop, 2 kolom mobile)
- [ ] Search berfungsi dengan query parameter
- [ ] Filter kategori berfungsi
- [ ] Card produk menampilkan: gambar, nama, harga, kategori, toko
- [ ] Klik card → redirect ke detail produk

#### Step 2: Detail Produk
```
1. Di /produk/1 (Detail Produk)
2. ✅ Galeri gambar terlihat
   - Klik thumbnail → gambar utama berubah
3. ✅ Info produk lengkap:
   - Nama, harga, rating, kategori, pengrajin
   - Deskripsi, spesifikasi
4. Test Actions:
   - Klik "Tambah ke Keranjang" → ✅ produk masuk cart, message success
   - Klik "Wishlist" → ✅ produk masuk wishlist, icon heart fill merah
   - Klik "Chat Penjual" → ✅ redirect ke /chat/:sellerId?productId=1
```

**✅ Checklist:**
- [ ] Gambar produk ter-load
- [ ] Info produk lengkap & readable
- [ ] Tombol aksi berfungsi
- [ ] Wishlist toggle (fill/unfill icon)

#### Step 3: Tambah ke Wishlist
```
1. Di /produk/1
2. Klik "Wishlist" → produk masuk wishlist
3. Buka /wishlist
4. ✅ Produk muncul di wishlist
5. Klik "Tambah ke Keranjang" dari wishlist → ✅ produk masuk cart
6. Klik "Hapus" → ✅ produk terhapus dari wishlist
```

#### Step 4: Tambah ke Keranjang
```
1. Di /produk/1
2. Klik "Tambah ke Keranjang" → produk masuk cart
3. Buka /keranjang
4. ✅ Produk muncul di cart dengan:
   - Gambar, nama, harga
   - Quantity: 1
   - Checkbox ter-check
5. Test Quantity:
   - Klik + → quantity jadi 2, subtotal ter-update
   - Klik - → quantity jadi 1
6. Test Select:
   - Uncheck checkbox → item tidak ter-select
   - Check "Select All" → semua item ter-select
7. Test Hapus:
   - Klik icon trash → konfirmasi muncul
   - Konfirmasi → item terhapus
```

**✅ Checklist:**
- [ ] Item muncul di cart
- [ ] Quantity update → subtotal ter-update
- [ ] Select/deselect berfungsi
- [ ] Hapus item berfungsi
- [ ] Cart summary menampilkan subtotal

#### Step 5: Checkout
```
1. Di /keranjang, pastikan ada item ter-select
2. Klik "Lanjut ke Checkout" → redirect ke /checkout
3. ✅ Alamat Pengiriman:
   - Default address auto-load & ter-select
   - Atau pilih alamat lain dari dropdown
   - Atau klik "Tambah Alamat Baru"
4. Jika tambah alamat baru:
   - Form muncul
   - Isi: Nama, Telepon, Jalan
   - Pilih Provinsi → dropdown Kabupaten muncul
   - Pilih Kabupaten → dropdown Kecamatan muncul
   - Isi Kode Pos
   - Submit → alamat tersimpan & ter-select
5. ✅ Produk yang Dipesan:
   - List produk ter-select dari cart terlihat
6. ✅ Metode Pembayaran:
   - Pilih "COD" → info COD muncul
   - Pilih "Bank Transfer" → info rekening & upload bukti muncul
7. Jika Bank Transfer:
   - Upload bukti transfer (JPG/PNG/PDF, max 5MB)
   - ✅ Preview file muncul
8. ✅ Ringkasan Pesanan:
   - Subtotal terlihat
   - Ongkos kirim terlihat
   - Total terlihat
9. Klik "Buat Pesanan" → redirect ke /order-success
```

**✅ Checklist:**
- [ ] Alamat default auto-load
- [ ] Dropdown alamat berfungsi
- [ ] Form tambah alamat: dropdown dinamis (provinsi → kabupaten → kecamatan)
- [ ] Upload bukti transfer: validasi format & size
- [ ] Ringkasan: subtotal, ongkir, total benar
- [ ] Submit → redirect ke order success

#### Step 6: Order Success
```
1. Di /order-success
2. ✅ Pesan sukses terlihat: "Pesanan Berhasil Dibuat!"
3. ✅ ID pesanan terlihat (format: #ABC12345)
4. ✅ Detail Pesanan:
   - List produk dengan gambar, nama, quantity, harga
   - Subtotal produk
5. ✅ Alamat Pengiriman lengkap terlihat
6. ✅ Ringkasan Pembayaran:
   - Subtotal: Rp 350.000
   - Ongkos kirim: Rp 25.000
   - Total: Rp 375.000
7. Klik "Lihat Pesanan" → redirect ke /pesanan
```

**✅ Checklist:**
- [ ] Semua informasi pesanan terlihat
- [ ] Subtotal & ongkir & total benar
- [ ] Alamat lengkap & readable
- [ ] Item terpilih terhapus dari cart

#### Step 7: Lihat Pesanan
```
1. Di /pesanan (Riwayat Pesanan)
2. ✅ Pesanan baru muncul di list dengan status sesuai:
   - COD → "Diproses"
   - Bank Transfer + bukti → "Diproses"
   - Bank Transfer tanpa bukti → "Menunggu Pembayaran"
3. Klik "Lihat Detail" → modal detail muncul
4. ✅ Detail lengkap:
   - ID, status, tanggal
   - List produk
   - Alamat pengiriman
   - Ringkasan pembayaran
5. Jika status "Menunggu Pembayaran" + ada bukti:
   - Tombol "Konfirmasi Pembayaran" muncul
   - Klik → status berubah ke "Diproses"
```

**✅ Checklist:**
- [ ] Pesanan muncul di list
- [ ] Status sesuai dengan metode pembayaran
- [ ] Detail modal lengkap
- [ ] Konfirmasi pembayaran berfungsi

### Flow 2: Kelola Alamat

#### Step 1: Tambah Alamat
```
1. Login sebagai Pembeli
2. Buka /alamat
3. Klik "Tambah Alamat Baru"
4. Isi form:
   - Label: "Rumah"
   - Nama: "John Doe"
   - Telepon: "081234567890"
   - Jalan: "Jl. Test No. 123"
   - Provinsi: Pilih "Bali"
   - Kabupaten: Pilih "Karangasem" (muncul setelah pilih provinsi)
   - Kecamatan: Pilih "Sidemen" (muncul setelah pilih kabupaten)
   - Kode Pos: "80864"
   - Checkbox "Set sebagai Alamat Default"
5. Klik "Simpan" → ✅ alamat tersimpan, muncul di list dengan badge "Default"
```

**✅ Checklist:**
- [ ] Form alamat lengkap
- [ ] Dropdown dinamis: Provinsi → Kabupaten → Kecamatan
- [ ] Validasi semua field required
- [ ] Set default → badge "Default" muncul
- [ ] Alamat muncul di list

#### Step 2: Edit Alamat
```
1. Di /alamat
2. Klik "Ubah" pada alamat
3. Form muncul dengan data ter-load
4. Edit nama: "John Doe Updated"
5. Klik "Simpan" → ✅ alamat ter-update
```

#### Step 3: Set Default Alamat
```
1. Di /alamat, ada 2+ alamat
2. Klik "Set sebagai Default" pada alamat non-default
3. ✅ Alamat tersebut menjadi default (badge muncul)
4. ✅ Alamat default sebelumnya kehilangan badge
```

#### Step 4: Hapus Alamat
```
1. Di /alamat
2. Klik "Hapus" pada alamat non-default
3. ✅ Konfirmasi muncul
4. Konfirmasi → ✅ alamat terhapus
5. Test: Hapus alamat default → ✅ tidak bisa (atau ada validasi)
```

### Flow 3: Kelola Profil

#### Step 1: Edit Profil
```
1. Login sebagai Pembeli
2. Buka /profil
3. Tab "Profil" (default)
4. ✅ Foto profil terlihat (atau icon jika belum upload)
5. Upload foto profil:
   - Klik icon camera → file picker muncul
   - Pilih gambar JPG/PNG (max 2MB)
   - ✅ Preview muncul, foto ter-update
6. Edit form:
   - Nama: "Nama Baru"
   - Telepon: "081234567890"
7. Klik "Simpan Perubahan" → ✅ message success, data ter-update
8. Refresh page → ✅ data persist (tetap tersimpan)
```

**✅ Checklist:**
- [ ] Upload foto: validasi format (JPG/PNG) & size (max 2MB)
- [ ] Foto persist setelah refresh
- [ ] Form edit berfungsi
- [ ] Data persist di localStorage

#### Step 2: Ubah Password
```
1. Di /profil, klik tab "Ubah Kata Sandi"
2. Isi form:
   - Kata Sandi Saat Ini: "test123"
   - Kata Sandi Baru: "newpass123"
   - Konfirmasi: "newpass123"
3. Klik "Ubah Kata Sandi" → ✅ message success
4. Test validasi:
   - Password baru < 8 karakter → ✅ error message
   - Konfirmasi tidak sama → ✅ error message
```

### Flow 4: Batalkan Pesanan

#### Test Batalkan Pesanan
```
1. Di /pesanan
2. Cari pesanan dengan status "Pending" atau "Processing"
3. Klik "Batalkan" → ✅ modal konfirmasi muncul
4. Pesan konfirmasi berbeda:
   - COD → info refund sesuai
   - Bank Transfer → info refund sesuai
5. Konfirmasi → ✅ status berubah ke "Dibatalkan"
6. ✅ Pesanan muncul di filter "Dibatalkan"
```

---

## 🛠️ ALUR PENGUJIAN PENGRAJIN

### Flow 1: Dashboard Pengrajin

#### Step 1: Akses Dashboard
```
1. Login sebagai Pengrajin
2. ✅ Auto-redirect ke /pengrajin (dashboard)
3. ✅ Statistik terlihat:
   - Total Produk
   - Total Pesanan
   - Pesanan Pending
   - Total Pendapatan
4. ✅ Quick Actions:
   - "Tambah Produk Baru" → redirect ke /pengrajin/produk/tambah
   - "Kelola Produk" → redirect ke /pengrajin/produk
   - "Lihat Semua Pesanan" → redirect ke /pengrajin/pesanan
5. ✅ Tabel "Pesanan Terbaru" menampilkan 5 pesanan terbaru
```

### Flow 2: Kelola Produk

#### Step 1: Tambah Produk
```
1. Di /pengrajin, klik "Tambah Produk Baru"
2. Redirect ke /pengrajin/produk/tambah
3. Isi form:
   - Nama: "Kain Endek Test"
   - Kategori: "Endek"
   - Deskripsi: "Deskripsi produk test"
   - Harga: 350000
   - Stok: 10
   - Upload gambar (maks 5 gambar)
4. Klik "Tambah Produk" → ✅ message success, redirect ke /pengrajin/produk
5. ✅ Produk muncul di tabel
```

**✅ Checklist:**
- [ ] Form lengkap & validasi
- [ ] Upload gambar: validasi format & jumlah
- [ ] Submit → produk tersimpan
- [ ] Produk muncul di list

#### Step 2: Edit Produk
```
1. Di /pengrajin/produk
2. Klik "Edit" pada produk
3. Redirect ke /pengrajin/produk/:id
4. ✅ Form ter-load dengan data produk
5. Edit harga: 400000
6. Klik "Perbarui Produk" → ✅ message success, redirect ke list
7. ✅ Data ter-update di tabel
```

#### Step 3: Hapus Produk
```
1. Di /pengrajin/produk
2. Klik "Hapus" pada produk
3. ✅ Modal konfirmasi muncul
4. Konfirmasi → ✅ produk terhapus dari tabel
5. Batal → produk tetap ada
```

### Flow 3: Kelola Pesanan

#### Step 1: Lihat Pesanan Masuk
```
1. Di /pengrajin/pesanan
2. ✅ Tabel pesanan terlihat
3. ✅ Hanya pesanan yang relevan untuk pengrajin ini yang muncul
4. Filter berdasarkan status:
   - Pilih "Diproses" → ✅ hanya pesanan "Diproses" yang muncul
   - Pilih "Dikirim" → ✅ hanya pesanan "Dikirim" yang muncul
```

#### Step 2: Detail Pesanan
```
1. Di /pengrajin/pesanan
2. Klik "Detail" pada pesanan
3. Redirect ke /pengrajin/pesanan/:id
4. ✅ Modal detail muncul dengan:
   - ID, Pembeli, Status, Tanggal
   - List produk lengkap
   - Alamat pengiriman
   - Ringkasan pembayaran
```

#### Step 3: Update Status Pesanan
```
1. Di /pengrajin/pesanan/:id (detail pesanan)
2. Jika status "Diproses":
   - ✅ Tombol "Tandai Sebagai Dikirim" muncul
   - Klik → ✅ status berubah ke "Dikirim", message success
3. Jika status "Dikirim":
   - ✅ Tombol "Tandai Sebagai Selesai" muncul
   - Klik → ✅ status berubah ke "Selesai", message success
4. ✅ Status ter-update di tabel & detail
```

### Flow 4: Profil Pengrajin

#### Test Profil Pengrajin
```
1. Login sebagai Pengrajin
2. Klik avatar → dropdown → "Profil Pengrajin"
3. Redirect ke /pengrajin/profil
4. ✅ Mirip UserProfile tapi untuk pengrajin
5. Edit profil → ✅ tersimpan
6. Upload foto → ✅ tersimpan
7. Ubah password → ✅ tersimpan
```

---

## 🔗 ALUR PENGUJIAN INTEGRASI

### Flow 1: Sinkronisasi Pembeli & Pengrajin

#### Test Alur Lengkap
```
1. **Sebagai Pengrajin:**
   - Login sebagai Pengrajin
   - Tambah produk baru di /pengrajin/produk/tambah
   - Produk tersimpan

2. **Sebagai Pembeli:**
   - Login sebagai Pembeli (atau buka tab baru)
   - Buka /produk
   - ✅ Produk yang ditambah pengrajin muncul di katalog
   - Klik produk → detail produk
   - Tambah ke keranjang → checkout → buat pesanan

3. **Kembali ke Pengrajin:**
   - Di /pengrajin/pesanan
   - ✅ Pesanan dari pembeli muncul
   - Update status: Diproses → Dikirim → Selesai

4. **Kembali ke Pembeli:**
   - Di /pesanan
   - ✅ Status pesanan ter-update sesuai aksi pengrajin
```

### Flow 2: Data Persist

#### Test Data Tersimpan
```
1. Login sebagai Pembeli
2. Tambah produk ke cart
3. Tambah produk ke wishlist
4. Tambah alamat baru
5. Buat pesanan
6. Refresh page (F5)
7. ✅ Semua data tetap ada:
   - Cart items masih ada
   - Wishlist masih ada
   - Alamat masih ada
   - Pesanan masih ada
```

### Flow 3: Role-Based Access

#### Test Menu Berbeda Per Role
```
1. **Login sebagai Pembeli:**
   - Klik avatar → dropdown
   - ✅ Menu: Profil Saya, Pesanan Saya, Wishlist, Alamat Saya
   - Tidak ada menu pengrajin

2. **Login sebagai Pengrajin:**
   - Klik avatar → dropdown
   - ✅ Menu: Dashboard, Kelola Produk, Pesanan Masuk, Profil Pengrajin
   - Tidak ada menu pembeli (Wishlist, Alamat)

3. **Login sebagai Admin:**
   - Klik avatar → dropdown
   - ✅ Menu admin (jika ada)
```

---

## 📊 PRIORITAS PENGUJIAN

### Prioritas 1 (Must Test First)
1. ✅ **Autentikasi:** Login/Register, Protected Routes
2. ✅ **Alur Belanja:** Browse → Cart → Checkout → Order Success
3. ✅ **Kelola Produk Pengrajin:** CRUD produk
4. ✅ **Kelola Pesanan:** Update status pesanan

### Prioritas 2
1. ⚠️ **Kelola Alamat:** CRUD alamat, dropdown dinamis
2. ⚠️ **Wishlist:** Tambah/hapus, persist
3. ⚠️ **Profil:** Edit profil, upload foto, ubah password

### Prioritas 3
1. ℹ️ **Chat:** Interface chat
2. ℹ️ **Notifikasi:** List notifikasi
3. ℹ️ **Dashboard:** Statistik pengrajin

---

## 📝 TEMPLATE CATATAN ERROR

### Format Dokumentasi Error
```
**Halaman:** /checkout
**Elemen:** Tombol "Buat Pesanan"
**Masalah:** Tombol tidak bisa diklik
**Kondisi:** 
- Sudah login sebagai Pembeli
- Cart ada 2 item ter-select
- Alamat sudah dipilih
- Metode pembayaran sudah dipilih
**Expected:** Tombol enabled, bisa diklik
**Actual:** Tombol disabled, tidak bisa diklik
**Screenshot:** [attach screenshot]
**Priority:** High/Medium/Low
```

---

## ✅ CHECKLIST RINGKAS

### Autentikasi
- [ ] Register akun baru
- [ ] Login dengan role berbeda
- [ ] Protected routes redirect
- [ ] Popup konfirmasi login

### Pembeli - Alur Belanja
- [ ] Browse produk & search
- [ ] Detail produk & actions
- [ ] Tambah ke wishlist
- [ ] Tambah ke cart
- [ ] Checkout dengan alamat
- [ ] Order success
- [ ] Lihat pesanan

### Pembeli - Manajemen
- [ ] Kelola alamat (CRUD)
- [ ] Edit profil & upload foto
- [ ] Ubah password
- [ ] Batalkan pesanan

### Pengrajin
- [ ] Dashboard & statistik
- [ ] Tambah produk
- [ ] Edit produk
- [ ] Hapus produk
- [ ] Lihat pesanan masuk
- [ ] Update status pesanan

### Integrasi
- [ ] Sinkronisasi pembeli & pengrajin
- [ ] Data persist setelah refresh
- [ ] Role-based menu

---

**Tips:**
- Test satu flow lengkap dari awal sampai akhir
- Jangan skip step, test secara berurutan
- Catat semua error dengan detail
- Screenshot untuk dokumentasi
- Test dengan data berbeda (kosong, banyak, dll)


