const tanggalHariIni = () => {
  const hariIni = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return hariIni;
};

export default tanggalHariIni
