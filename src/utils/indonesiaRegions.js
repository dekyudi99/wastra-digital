// Data wilayah Indonesia (contoh beberapa provinsi utama)
export const provinces = [
  { id: 'bali', name: 'Bali' },
  { id: 'jawa-timur', name: 'Jawa Timur' },
  { id: 'jawa-tengah', name: 'Jawa Tengah' },
  { id: 'jawa-barat', name: 'Jawa Barat' },
  { id: 'dki-jakarta', name: 'DKI Jakarta' },
  { id: 'yogyakarta', name: 'DI Yogyakarta' },
  { id: 'sumatera-utara', name: 'Sumatera Utara' },
  { id: 'sumatera-barat', name: 'Sumatera Barat' },
  { id: 'sumatera-selatan', name: 'Sumatera Selatan' },
  { id: 'lampung', name: 'Lampung' },
]

export const regencies = {
  'bali': [
    { id: 'badung', name: 'Badung' },
    { id: 'bangli', name: 'Bangli' },
    { id: 'buleleng', name: 'Buleleng' },
    { id: 'gianyar', name: 'Gianyar' },
    { id: 'jembrana', name: 'Jembrana' },
    { id: 'karangasem', name: 'Karangasem' },
    { id: 'klungkung', name: 'Klungkung' },
    { id: 'tabanan', name: 'Tabanan' },
    { id: 'denpasar', name: 'Kota Denpasar' },
  ],
  'jawa-timur': [
    { id: 'surabaya', name: 'Kota Surabaya' },
    { id: 'malang', name: 'Kota Malang' },
    { id: 'sidoarjo', name: 'Sidoarjo' },
    { id: 'gresik', name: 'Gresik' },
  ],
  'jawa-tengah': [
    { id: 'semarang', name: 'Kota Semarang' },
    { id: 'solo', name: 'Kota Surakarta' },
    { id: 'magelang', name: 'Kota Magelang' },
  ],
  'jawa-barat': [
    { id: 'bandung', name: 'Kota Bandung' },
    { id: 'bekasi', name: 'Kota Bekasi' },
    { id: 'depok', name: 'Kota Depok' },
  ],
  'dki-jakarta': [
    { id: 'jakarta-selatan', name: 'Jakarta Selatan' },
    { id: 'jakarta-utara', name: 'Jakarta Utara' },
    { id: 'jakarta-barat', name: 'Jakarta Barat' },
    { id: 'jakarta-timur', name: 'Jakarta Timur' },
    { id: 'jakarta-pusat', name: 'Jakarta Pusat' },
  ],
  'yogyakarta': [
    { id: 'yogyakarta', name: 'Kota Yogyakarta' },
    { id: 'bantul', name: 'Bantul' },
    { id: 'gunungkidul', name: 'Gunungkidul' },
    { id: 'kulon-progo', name: 'Kulon Progo' },
    { id: 'sleman', name: 'Sleman' },
  ],
}

export const districts = {
  // Bali
  'karangasem': [
    { id: 'abang', name: 'Abang' },
    { id: 'bebandem', name: 'Bebandem' },
    { id: 'karangasem', name: 'Karangasem' },
    { id: 'kubu', name: 'Kubu' },
    { id: 'manggis', name: 'Manggis' },
    { id: 'rendang', name: 'Rendang' },
    { id: 'selat', name: 'Selat' },
    { id: 'sidemen', name: 'Sidemen' },
  ],
  'badung': [
    { id: 'abiansemal', name: 'Abiansemal' },
    { id: 'kuta', name: 'Kuta' },
    { id: 'kuta-selatan', name: 'Kuta Selatan' },
    { id: 'kuta-utara', name: 'Kuta Utara' },
    { id: 'mengwi', name: 'Mengwi' },
    { id: 'petang', name: 'Petang' },
  ],
  'denpasar': [
    { id: 'denpasar-barat', name: 'Denpasar Barat' },
    { id: 'denpasar-selatan', name: 'Denpasar Selatan' },
    { id: 'denpasar-timur', name: 'Denpasar Timur' },
    { id: 'denpasar-utara', name: 'Denpasar Utara' },
  ],
  // Jawa Timur
  'surabaya': [
    { id: 'surabaya-barat', name: 'Surabaya Barat' },
    { id: 'surabaya-selatan', name: 'Surabaya Selatan' },
    { id: 'surabaya-timur', name: 'Surabaya Timur' },
    { id: 'surabaya-utara', name: 'Surabaya Utara' },
    { id: 'surabaya-pusat', name: 'Surabaya Pusat' },
  ],
  'malang': [
    { id: 'malang-kota', name: 'Malang Kota' },
    { id: 'blimbing', name: 'Blimbing' },
    { id: 'klojen', name: 'Klojen' },
    { id: 'lowokwaru', name: 'Lowokwaru' },
    { id: 'sukun', name: 'Sukun' },
  ],
  'sidoarjo': [
    { id: 'sidoarjo', name: 'Sidoarjo' },
    { id: 'buduran', name: 'Buduran' },
    { id: 'candi', name: 'Candi' },
    { id: 'gedangan', name: 'Gedangan' },
    { id: 'tulangan', name: 'Tulangan' },
  ],
  'gresik': [
    { id: 'gresik', name: 'Gresik' },
    { id: 'kebomas', name: 'Kebomas' },
    { id: 'manyar', name: 'Manyar' },
    { id: 'bungah', name: 'Bungah' },
    { id: 'driyorejo', name: 'Driyorejo' },
  ],
  // Jawa Tengah
  'semarang': [
    { id: 'semarang-barat', name: 'Semarang Barat' },
    { id: 'semarang-selatan', name: 'Semarang Selatan' },
    { id: 'semarang-timur', name: 'Semarang Timur' },
    { id: 'semarang-utara', name: 'Semarang Utara' },
    { id: 'semarang-tengah', name: 'Semarang Tengah' },
  ],
  'solo': [
    { id: 'solo-barat', name: 'Solo Barat' },
    { id: 'solo-selatan', name: 'Solo Selatan' },
    { id: 'solo-timur', name: 'Solo Timur' },
    { id: 'solo-utara', name: 'Solo Utara' },
    { id: 'solo-tengah', name: 'Solo Tengah' },
  ],
  'magelang': [
    { id: 'magelang-selatan', name: 'Magelang Selatan' },
    { id: 'magelang-utara', name: 'Magelang Utara' },
    { id: 'magelang-tengah', name: 'Magelang Tengah' },
  ],
  // Jawa Barat
  'bandung': [
    { id: 'bandung-kulon', name: 'Bandung Kulon' },
    { id: 'bandung-wetan', name: 'Bandung Wetan' },
    { id: 'bandung-kidul', name: 'Bandung Kidul' },
    { id: 'bandung-kaler', name: 'Bandung Kaler' },
    { id: 'bandung-tengah', name: 'Bandung Tengah' },
  ],
  'bekasi': [
    { id: 'bekasi-barat', name: 'Bekasi Barat' },
    { id: 'bekasi-selatan', name: 'Bekasi Selatan' },
    { id: 'bekasi-timur', name: 'Bekasi Timur' },
    { id: 'bekasi-utara', name: 'Bekasi Utara' },
    { id: 'bekasi-pusat', name: 'Bekasi Pusat' },
  ],
  'depok': [
    { id: 'depok-barat', name: 'Depok Barat' },
    { id: 'depok-selatan', name: 'Depok Selatan' },
    { id: 'depok-timur', name: 'Depok Timur' },
    { id: 'depok-utara', name: 'Depok Utara' },
    { id: 'depok-pusat', name: 'Depok Pusat' },
  ],
  // DKI Jakarta
  'jakarta-selatan': [
    { id: 'kebayoran-baru', name: 'Kebayoran Baru' },
    { id: 'kebayoran-lama', name: 'Kebayoran Lama' },
    { id: 'pasar-minggu', name: 'Pasar Minggu' },
    { id: 'cilandak', name: 'Cilandak' },
    { id: 'pesanggrahan', name: 'Pesanggrahan' },
  ],
  'jakarta-utara': [
    { id: 'tanjung-priok', name: 'Tanjung Priok' },
    { id: 'koja', name: 'Koja' },
    { id: 'kelapa-gading', name: 'Kelapa Gading' },
    { id: 'cakung', name: 'Cakung' },
    { id: 'pademangan', name: 'Pademangan' },
  ],
  'jakarta-barat': [
    { id: 'kebon-jeruk', name: 'Kebon Jeruk' },
    { id: 'kembangan', name: 'Kembangan' },
    { id: 'palmerah', name: 'Palmerah' },
    { id: 'grogol-petamburan', name: 'Grogol Petamburan' },
    { id: 'taman-sari', name: 'Taman Sari' },
  ],
  'jakarta-timur': [
    { id: 'matraman', name: 'Matraman' },
    { id: 'pulo-gadung', name: 'Pulo Gadung' },
    { id: 'jatinegara', name: 'Jatinegara' },
    { id: 'duren-sawit', name: 'Duren Sawit' },
    { id: 'cakung', name: 'Cakung' },
  ],
  'jakarta-pusat': [
    { id: 'menteng', name: 'Menteng' },
    { id: 'tanah-abang', name: 'Tanah Abang' },
    { id: 'senen', name: 'Senen' },
    { id: 'cempaka-putih', name: 'Cempaka Putih' },
    { id: 'kemayoran', name: 'Kemayoran' },
  ],
  // Yogyakarta
  'yogyakarta': [
    { id: 'gedongtengen', name: 'Gedongtengen' },
    { id: 'jetis', name: 'Jetis' },
    { id: 'mantrijeron', name: 'Mantrijeron' },
    { id: 'mergan', name: 'Mergansan' },
    { id: 'ngampilan', name: 'Ngampilan' },
  ],
  'bantul': [
    { id: 'bantul', name: 'Bantul' },
    { id: 'sanden', name: 'Sanden' },
    { id: 'kretek', name: 'Kretek' },
    { id: 'pundong', name: 'Pundong' },
    { id: 'imogiri', name: 'Imogiri' },
  ],
  'sleman': [
    { id: 'sleman', name: 'Sleman' },
    { id: 'gamping', name: 'Gamping' },
    { id: 'godean', name: 'Godean' },
    { id: 'moyudan', name: 'Moyudan' },
    { id: 'mlati', name: 'Mlati' },
  ],
}

