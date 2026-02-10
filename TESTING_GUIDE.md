# 🧪 Panduan Testing Fitur User Management & Profile

## 📋 Persiapan

1. **Pastikan development server berjalan:**
   ```bash
   npm run dev
   ```

2. **Buka browser di:** `http://localhost:5173`

3. **Buka Developer Tools (F12)** untuk melihat:
   - Console (untuk melihat log/error)
   - Application → Local Storage (untuk melihat data yang tersimpan)

---

## ✅ Testing Checklist

### 1. 🔐 Authentication & Registration

#### Test Register
1. Klik **"Masuk"** di header atau buka `/onboarding`
2. Pilih role (Pembeli/Pengrajin/Admin)
3. Klik **"Daftar"** atau buka `/daftar`
4. Isi form:
   - Nama: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Konfirmasi Password: `password123`
5. Klik **"Buat Akun"**
6. ✅ **Expected:** Redirect ke halaman login, data tersimpan di localStorage

#### Test Login
1. Buka `/masuk`
2. Pilih role
3. Isi email dan password (bisa apa saja, tidak ada validasi backend)
4. Klik **"Masuk"**
5. ✅ **Expected:** 
   - Berhasil login
   - Header menampilkan avatar/user icon
   - Menu "Masuk" hilang dari header

#### Test Logout
1. Klik **avatar/user icon** di header
2. Klik **"Keluar"**
3. ✅ **Expected:** 
   - Redirect ke home
   - Header kembali menampilkan "Masuk"
   - Data user masih ada di localStorage (untuk testing)

---

### 2. 👤 User Profile (`/profil`)

#### Test Edit Profile
1. Login terlebih dahulu
2. Klik **avatar** → **"Profil Saya"** atau buka `/profil`
3. Tab **"Profil"**:
   - Edit nama, telepon
   - Klik **"Simpan Perubahan"**
4. ✅ **Expected:** 
   - Success message muncul
   - Data tersimpan di localStorage
   - Refresh halaman, data masih ada

#### Test Upload Avatar
1. Di halaman profil, klik **foto profil**
2. Pilih file gambar (JPG/PNG, max 2MB)
3. ✅ **Expected:** 
   - Foto profil berubah
   - Avatar di header juga berubah
   - Data tersimpan

#### Test Change Password
1. Di halaman profil, klik tab **"Ubah Kata Sandi"**
2. Isi form:
   - Kata Sandi Saat Ini: `password123`
   - Kata Sandi Baru: `newpassword123`
   - Konfirmasi: `newpassword123`
3. Klik **"Ubah Kata Sandi"**
4. ✅ **Expected:** Success message muncul

---

### 3. 📦 Order History (`/pesanan`)

#### Test Lihat Order History
1. Login terlebih dahulu
2. Klik **avatar** → **"Pesanan Saya"** atau buka `/pesanan`
3. ✅ **Expected:** 
   - Jika belum ada order: tampil empty state
   - Jika ada order: tampil daftar order

#### Test Filter Orders
1. Di halaman Order History, coba klik filter:
   - Semua
   - Menunggu Pembayaran
   - Diproses
   - Dikirim
   - Selesai
   - Dibatalkan
2. ✅ **Expected:** Order list terfilter sesuai status

#### Test Order Detail
1. Klik tombol **"Detail"** pada salah satu order
2. ✅ **Expected:** Modal muncul dengan detail lengkap:
   - Status
   - Tanggal
   - Alamat pengiriman
   - Items
   - Total

#### Test Create Order (dari Checkout)
1. Tambah produk ke keranjang
2. Buka `/keranjang`
3. Pilih produk, klik **"Checkout"**
4. Isi alamat (atau pilih yang sudah ada)
5. Pilih metode pembayaran
6. Klik **"Buat Pesanan"**
7. ✅ **Expected:** 
   - Order muncul di Order History
   - Data tersimpan di localStorage

---

### 4. 📍 Address Management (`/alamat`)

#### Test Tambah Alamat
1. Login terlebih dahulu
2. Klik **avatar** → **"Alamat Saya"** atau buka `/alamat`
3. Klik **"Tambah Alamat"**
4. Isi form:
   - Nama Penerima: `John Doe`
   - Nomor Telepon: `081234567890`
   - Alamat Lengkap: `Jl. Contoh No. 123`
   - Provinsi: Pilih salah satu
   - Kota/Kabupaten: Pilih sesuai provinsi
   - Kecamatan: Pilih sesuai kota
   - Kode Pos: `12345`
   - Catatan (opsional): `Rumah warna biru`
5. Klik **"Simpan Alamat"**
6. ✅ **Expected:** 
   - Alamat muncul di list
   - Jika alamat pertama, otomatis jadi default
   - Data tersimpan di localStorage

#### Test Edit Alamat
1. Klik **"Edit"** pada salah satu alamat
2. Ubah beberapa field
3. Klik **"Simpan Perubahan"**
4. ✅ **Expected:** Data alamat terupdate

#### Test Set Default Address
1. Jika ada lebih dari 1 alamat, klik **"Set Default"** pada alamat yang bukan default
2. ✅ **Expected:** 
   - Tag "Default" pindah ke alamat tersebut
   - Alamat sebelumnya tidak lagi default

#### Test Hapus Alamat
1. Klik **"Hapus"** pada salah satu alamat
2. Konfirmasi di modal
3. ✅ **Expected:** Alamat terhapus dari list

---

### 5. ❤️ Wishlist (`/wishlist`)

#### Test Tambah ke Wishlist
1. Login terlebih dahulu
2. Buka halaman produk (misal `/produk/1`)
3. Klik **tombol heart** di sebelah tombol "Tambah ke Keranjang"
4. ✅ **Expected:** 
   - Icon heart berubah menjadi filled (merah)
   - Success message muncul
   - Produk tersimpan di wishlist

#### Test Lihat Wishlist
1. Klik **avatar** → **"Wishlist"** atau buka `/wishlist`
2. ✅ **Expected:** 
   - Produk yang ditambahkan muncul di list
   - Jika kosong: tampil empty state

#### Test Tambah ke Cart dari Wishlist
1. Di halaman wishlist, klik **"Tambah ke Keranjang"** pada salah satu produk
2. ✅ **Expected:** 
   - Produk masuk ke keranjang
   - Cart count di header bertambah

#### Test Hapus dari Wishlist
1. Di halaman wishlist, klik **icon trash** pada produk
2. ✅ **Expected:** Produk terhapus dari wishlist

---

### 6. 🔑 Forgot Password (`/lupa-password`)

#### Test Flow Forgot Password
1. Buka `/masuk`
2. Klik **"Lupa kata sandi?"** atau buka `/lupa-password`
3. **Step 1 - Email:**
   - Isi email: `test@example.com`
   - Klik **"Kirim Kode Verifikasi"**
   - ✅ **Expected:** Pindah ke step 2, email ditampilkan
4. **Step 2 - Verifikasi:**
   - Isi kode: `123456` (bisa angka apa saja)
   - Klik **"Verifikasi"**
   - ✅ **Expected:** Pindah ke step 3
5. **Step 3 - Reset Password:**
   - Isi kata sandi baru: `newpassword123`
   - Konfirmasi: `newpassword123`
   - Klik **"Reset Kata Sandi"**
   - ✅ **Expected:** Success message, redirect ke login

---

### 7. 🛒 Integration dengan Checkout

#### Test Checkout dengan Address
1. Tambah produk ke keranjang
2. Buka `/checkout`
3. Jika belum ada alamat: klik **"Tambah Alamat"** dan isi
4. Jika sudah ada: pilih alamat yang sudah ada
5. Pilih metode pembayaran
6. Klik **"Buat Pesanan"**
7. ✅ **Expected:** 
   - Order muncul di Order History
   - Data order tersimpan di localStorage
   - Redirect ke success page

---

## 🔍 Cara Cek Data di LocalStorage

1. Buka **Developer Tools** (F12)
2. Pilih tab **Application** (Chrome) atau **Storage** (Firefox)
3. Klik **Local Storage** → `http://localhost:5173`
4. Cek key-key berikut:
   - `wastra.user` - Data user yang login
   - `wastra.orders` - Daftar semua order
   - `wastra.addresses` - Daftar alamat
   - `wastra.wishlist` - Daftar wishlist
   - `wastra.role` - Role user saat ini

---

## 🐛 Troubleshooting

### Data tidak tersimpan?
- Cek Console untuk error
- Pastikan localStorage tidak di-block browser
- Coba clear localStorage dan test lagi

### Redirect tidak bekerja?
- Cek apakah sudah login
- Cek routing di App.jsx

### UI tidak update?
- Refresh halaman
- Cek apakah state sudah di-update di Context

---

## 📝 Notes

- **Semua data disimpan di localStorage browser**
- **Data akan hilang jika clear browser data**
- **Tidak ada validasi backend** (semua simulasi)
- **Untuk production, perlu integrasi dengan backend API**

---

## 🎯 Quick Test Flow

1. **Register** → `/onboarding` → Pilih role → `/daftar` → Isi form → Submit
2. **Login** → `/masuk` → Isi form → Submit
3. **Edit Profile** → Klik avatar → Profil Saya → Edit → Simpan
4. **Tambah Alamat** → Klik avatar → Alamat Saya → Tambah Alamat → Isi form → Simpan
5. **Tambah Wishlist** → Buka produk → Klik heart icon
6. **Checkout** → Keranjang → Checkout → Pilih alamat → Buat Pesanan
7. **Lihat Order** → Klik avatar → Pesanan Saya → Lihat detail

---

Selamat testing! 🚀

