// Data wilayah Indonesia - dibatasi hanya Nusa Tenggara sampai Jawa Timur
export const provinces = [
  { id: 'nusa-tenggara-barat', name: 'Nusa Tenggara Barat' },
  { id: 'nusa-tenggara-timur', name: 'Nusa Tenggara Timur' },
  { id: 'bali', name: 'Bali' },
  { id: 'jawa-timur', name: 'Jawa Timur' },
]

// Kab/Kota utama per provinsi
export const regencies = {
  // NTB
  'nusa-tenggara-barat': [
    { id: 'lombok-barat', name: 'Kabupaten Lombok Barat' },
    { id: 'lombok-tengah', name: 'Kabupaten Lombok Tengah' },
    { id: 'lombok-timur', name: 'Kabupaten Lombok Timur' },
    { id: 'lombok-utara', name: 'Kabupaten Lombok Utara' },
    { id: 'sumbawa', name: 'Kabupaten Sumbawa' },
    { id: 'sumbawa-barat', name: 'Kabupaten Sumbawa Barat' },
    { id: 'bima', name: 'Kabupaten Bima' },
    { id: 'dompu', name: 'Kabupaten Dompu' },
    { id: 'kota-bima', name: 'Kota Bima' },
    { id: 'kota-mataram', name: 'Kota Mataram' },
  ],

  // NTT (daftar kab/kota utama)
  'nusa-tenggara-timur': [
    { id: 'alor', name: 'Kabupaten Alor' },
    { id: 'belu', name: 'Kabupaten Belu' },
    { id: 'ende', name: 'Kabupaten Ende' },
    { id: 'flores-timur', name: 'Kabupaten Flores Timur' },
    { id: 'kupang', name: 'Kabupaten Kupang' },
    { id: 'lembata', name: 'Kabupaten Lembata' },
    { id: 'malaka', name: 'Kabupaten Malaka' },
    { id: 'manggarai', name: 'Kabupaten Manggarai' },
    { id: 'manggarai-barat', name: 'Kabupaten Manggarai Barat' },
    { id: 'manggarai-timur', name: 'Kabupaten Manggarai Timur' },
    { id: 'nagekeo', name: 'Kabupaten Nagekeo' },
    { id: 'ngada', name: 'Kabupaten Ngada' },
    { id: 'rote-ndao', name: 'Kabupaten Rote Ndao' },
    { id: 'sabu-raijua', name: 'Kabupaten Sabu Raijua' },
    { id: 'sikka', name: 'Kabupaten Sikka' },
    { id: 'sumba-barat', name: 'Kabupaten Sumba Barat' },
    { id: 'sumba-barat-daya', name: 'Kabupaten Sumba Barat Daya' },
    { id: 'sumba-tengah', name: 'Kabupaten Sumba Tengah' },
    { id: 'sumba-timur', name: 'Kabupaten Sumba Timur' },
    { id: 'timor-tengah-selatan', name: 'Kabupaten Timor Tengah Selatan' },
    { id: 'timor-tengah-utara', name: 'Kabupaten Timor Tengah Utara' },
    { id: 'kota-kupang', name: 'Kota Kupang' },
  ],

  // Bali
  bali: [
    { id: 'badung', name: 'Kabupaten Badung' },
    { id: 'bangli', name: 'Kabupaten Bangli' },
    { id: 'buleleng', name: 'Kabupaten Buleleng' },
    { id: 'gianyar', name: 'Kabupaten Gianyar' },
    { id: 'jembrana', name: 'Kabupaten Jembrana' },
    { id: 'karangasem', name: 'Kabupaten Karangasem' },
    { id: 'klungkung', name: 'Kabupaten Klungkung' },
    { id: 'tabanan', name: 'Kabupaten Tabanan' },
    { id: 'denpasar', name: 'Kota Denpasar' },
  ],

  // Jawa Timur (contoh beberapa kota/kabupaten utama)
  'jawa-timur': [
    { id: 'surabaya', name: 'Kota Surabaya' },
    { id: 'malang', name: 'Kota Malang' },
    { id: 'sidoarjo', name: 'Kabupaten Sidoarjo' },
    { id: 'gresik', name: 'Kabupaten Gresik' },
  ],
}

// Kecamatan contoh per kabupaten/kota
export const districts = {
  // NTB
  'lombok-barat': [
    { id: 'gerung', name: 'Gerung' },
    { id: 'kediri', name: 'Kediri' },
    { id: 'kuripan', name: 'Kuripan' },
    { id: 'lembar', name: 'Lembar' },
    { id: 'narmada', name: 'Narmada' },
    { id: 'sekotong', name: 'Sekotong' },
  ],
  'lombok-tengah': [
    { id: 'praya', name: 'Praya' },
    { id: 'praya-barat', name: 'Praya Barat' },
    { id: 'praya-barat-daya', name: 'Praya Barat Daya' },
    { id: 'praya-tengah', name: 'Praya Tengah' },
    { id: 'jonggat', name: 'Jonggat' },
    { id: 'kopang', name: 'Kopang' },
  ],
  'lombok-timur': [
    { id: 'selong', name: 'Selong' },
    { id: 'sikur', name: 'Sikur' },
    { id: 'masbagik', name: 'Masbagik' },
    { id: 'sukamulia', name: 'Sukamulia' },
    { id: 'aikmel', name: 'Aikmel' },
    { id: 'sambelia', name: 'Sambelia' },
  ],
  'lombok-utara': [
    { id: 'tanjung', name: 'Tanjung' },
    { id: 'gondang', name: 'Gondang' },
    { id: 'gangga', name: 'Gangga' },
    { id: 'pemenang', name: 'Pemenang' },
    { id: 'bayan', name: 'Bayan' },
  ],
  sumbawa: [
    { id: 'sumbawa', name: 'Sumbawa' },
    { id: 'labuhan-badas', name: 'Labuhan Badas' },
    { id: 'unter-iwes', name: 'Unter Iwes' },
    { id: 'moyo-hilir', name: 'Moyo Hilir' },
    { id: 'moyo-hulu', name: 'Moyo Hulu' },
  ],
  'sumbawa-barat': [
    { id: 'taliwang', name: 'Taliwang' },
    { id: 'brang-rea', name: 'Brang Rea' },
    { id: 'brang-enas', name: 'Brang Ene' },
    { id: 'jereweh', name: 'Jereweh' },
    { id: 'sekongkang', name: 'Sekongkang' },
  ],
  bima: [
    { id: 'woha', name: 'Woha' },
    { id: 'belo', name: 'Belo' },
    { id: 'bolo', name: 'Bolo' },
    { id: 'madapangga', name: 'Madapangga' },
    { id: 'tambora', name: 'Tambora' },
  ],
  dompu: [
    { id: 'dompu', name: 'Dompu' },
    { id: 'kilo', name: 'Kilo' },
    { id: 'manggelewa', name: 'Manggelewa' },
    { id: 'huu', name: 'Huu' },
  ],
  'kota-bima': [
    { id: 'rasanae-barat', name: 'Rasanae Barat' },
    { id: 'rasanae-timur', name: 'Rasanae Timur' },
    { id: 'raba', name: 'Raba' },
    { id: 'mpunda', name: 'Mpunda' },
    { id: 'asakota', name: 'Asakota' },
  ],
  'kota-mataram': [
    { id: 'ampenan', name: 'Ampenan' },
    { id: 'cakranegara', name: 'Cakranegara' },
    { id: 'mataram', name: 'Mataram' },
    { id: 'sekarbela', name: 'Sekarbela' },
    { id: 'selaparang', name: 'Selaparang' },
    { id: 'sandubaya', name: 'Sandubaya' },
  ],

  // NTT (contoh)
  alor: [
    { id: 'teluk-mutiara', name: 'Teluk Mutiara' },
    { id: 'alor-barat-daya', name: 'Alor Barat Daya' },
    { id: 'alor-timur', name: 'Alor Timur' },
    { id: 'pulau-pura', name: 'Pulau Pura' },
    { id: 'pantar', name: 'Pantar' },
  ],
  belu: [
    { id: 'atambua', name: 'Atambua' },
    { id: 'kakuluk-mesak', name: 'Kakuluk Mesak' },
    { id: 'lasiolat', name: 'Lasiolat' },
    { id: 'raimanuk', name: 'Raimanuk' },
    { id: 'tasifeto-barat', name: 'Tasifeto Barat' },
  ],

  // Bali (fokus Karangasem)
  karangasem: [
    { id: 'abang', name: 'Abang' },
    { id: 'bebandem', name: 'Bebandem' },
    { id: 'karangasem', name: 'Karangasem' },
    { id: 'kubu', name: 'Kubu' },
    { id: 'manggis', name: 'Manggis' },
    { id: 'rendang', name: 'Rendang' },
    { id: 'selat', name: 'Selat' },
    { id: 'sidemen', name: 'Sidemen' },
  ],

  // Jawa Timur (contoh)
  surabaya: [
    { id: 'surabaya-barat', name: 'Surabaya Barat' },
    { id: 'surabaya-selatan', name: 'Surabaya Selatan' },
    { id: 'surabaya-timur', name: 'Surabaya Timur' },
    { id: 'surabaya-utara', name: 'Surabaya Utara' },
    { id: 'surabaya-pusat', name: 'Surabaya Pusat' },
  ],
  malang: [
    { id: 'klojen', name: 'Klojen' },
    { id: 'lowokwaru', name: 'Lowokwaru' },
    { id: 'sukun', name: 'Sukun' },
    { id: 'kedungkandang', name: 'Kedungkandang' },
    { id: 'blimbing', name: 'Blimbing' },
  ],
  sidoarjo: [
    { id: 'sidoarjo', name: 'Sidoarjo' },
    { id: 'buduran', name: 'Buduran' },
    { id: 'candi', name: 'Candi' },
    { id: 'gedangan', name: 'Gedangan' },
    { id: 'tulangan', name: 'Tulangan' },
  ],
  gresik: [
    { id: 'gresik', name: 'Gresik' },
    { id: 'kebomas', name: 'Kebomas' },
    { id: 'manyar', name: 'Manyar' },
    { id: 'bungah', name: 'Bungah' },
    { id: 'driyorejo', name: 'Driyorejo' },
  ],
}

// Dusun per kecamatan (khusus kebutuhan registrasi pengrajin)
export const villages = {
  selat: [
    { id: 'tengah', name: 'Dusun Tengah' },
    { id: 'sidakarya', name: 'Dusun Sidakarya' },
    { id: 'budamanis', name: 'Dusun Budamanis' },
    { id: 'tabola', name: 'Dusun Tabola' },
    { id: 'guminten', name: 'Dusun Guminten' },
  ],
}

