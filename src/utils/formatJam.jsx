const formatJam = (dateString) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',   // Menampilkan jam
    minute: '2-digit', // Menampilkan menit
    hour12: false      // Gunakan format 24 jam (opsional)
  }).format(new Date(dateString));
};

export default formatJam
