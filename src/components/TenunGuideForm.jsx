import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../api/AxiosClient'

const TenunGuideForm = ({ onResult }) => {
  const queryClient = useQueryClient()
  
  // State manajemen objek untuk menyederhanakan kode
  const [formData, setFormData] = useState({
    designName: '',
    motif: '', // Deskripsi detail untuk AI
    motifWidth: '',
    motifHeight: '',
    colors: [],
    colorInput: '',
    referenceImage: null
  })
  
  const [preview, setPreview] = useState(null) // State untuk preview gambar

  // Mutation untuk Create Guide menggunakan TanStack Query
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosClient.post('/ai/seller/tenun-guide', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data.data
    },
    onSuccess: (data) => {
      // Refresh riwayat otomatis dan tampilkan hasil
      queryClient.invalidateQueries({ queryKey: ['tenun-guides'] })
      onResult(data)
      // Reset form setelah berhasil
      setPreview(null)
      setFormData({
        designName: '', motif: '', motifWidth: '', motifHeight: '',
        colors: [], colorInput: '', referenceImage: null
      })
    }
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, referenceImage: file })
      setPreview(URL.createObjectURL(file)) // Membuat preview URL lokal
    }
  }

  const addColor = () => {
    if (!formData.colorInput.trim()) return
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, prev.colorInput.trim()],
      colorInput: ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { designName, motif, motifWidth, motifHeight, colors, referenceImage } = formData
    
    // Validasi dasar agar AI tidak kekurangan data
    if (!designName || !motif || !motifWidth || !motifHeight || colors.length === 0) {
        alert("Lengkapi data desain, deskripsi motif, ukuran, dan minimal satu warna.")
        return
    }

    const data = new FormData()
    data.append('design_name', designName)
    data.append('motif', motif)
    data.append('motif_width_lungsin', motifWidth)
    data.append('motif_height_pakan', motifHeight)
    colors.forEach(c => data.append('motif_colors[]', c))
    
    if (referenceImage) {
      data.append('reference_image', referenceImage)
    }

    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-xl p-6 bg-white shadow-sm space-y-5">
      <h2 className="font-bold text-indigo-900 text-lg">Panduan Tenun Motif Baru</h2>
      
      {mutation.isError && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          Gagal: {mutation.error.message}
        </div>
      )}

      {/* Identitas Desain */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Nama Desain</label>
          <input
            className="border rounded-lg w-full p-2.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={formData.designName}
            onChange={e => setFormData({...formData, designName: e.target.value})}
            placeholder="Contoh: Songket Bintang Sidemen"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Deskripsi Detail Motif (Penting untuk AI)</label>
          <textarea
            className="border rounded-lg w-full p-2.5 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={formData.motif}
            onChange={e => setFormData({...formData, motif: e.target.value})}
            placeholder="Jelaskan bentuk motif, misalnya: Bunga teratai 8 kelopak dengan titik di tengah..."
            rows="3"
          />
        </div>
      </div>

      {/* Ukuran Lungsin & Pakan */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400">LEBAR (LUNGSIN)</label>
          <input
            type="number"
            className="border rounded-lg w-full p-2.5 text-sm mt-1"
            value={formData.motifWidth}
            onChange={e => setFormData({...formData, motifWidth: e.target.value})}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400">TINGGI (PAKAN)</label>
          <input
            type="number"
            className="border rounded-lg w-full p-2.5 text-sm mt-1"
            value={formData.motifHeight}
            onChange={e => setFormData({...formData, motifHeight: e.target.value})}
          />
        </div>
      </div>

      {/* Warna Benang */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase">Warna Benang Motif</label>
        <div className="flex gap-2 mt-1">
          <input
            className="border rounded-lg flex-1 p-2.5 text-sm"
            value={formData.colorInput}
            onChange={e => setFormData({...formData, colorInput: e.target.value})}
            placeholder="Ketik warna..."
          />
          <button type="button" onClick={addColor} className="px-4 bg-gray-100 text-sm font-bold rounded-lg hover:bg-gray-200">Tambah</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.colors.map((c, i) => (
            <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs border border-indigo-100 flex items-center gap-2">
              {c} 
              <button type="button" onClick={() => setFormData({...formData, colors: formData.colors.filter((_, idx) => idx !== i)})} className="hover:text-red-500 font-bold">✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* Image Reference & Preview */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Gambar Referensi</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
          {preview ? (
            <div className="relative group">
              <img src={preview} alt="Preview" className="h-48 w-48 object-cover rounded-lg shadow-md border-4 border-white" />
              <button 
                type="button"
                onClick={() => { setPreview(null); setFormData({...formData, referenceImage: null}) }}
                className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition"
              >✕</button>
            </div>
          ) : (
            <label className="cursor-pointer text-center">
              <div className="text-indigo-600 font-semibold mb-1">Klik untuk unggah gambar</div>
              <div className="text-[10px] text-gray-400">PNG, JPG up to 2MB</div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          )}
        </div>
      </div>

      <button
        disabled={mutation.isPending}
        className={`w-full py-3 rounded-xl text-sm font-bold shadow-lg transition duration-300 ${
          mutation.isPending 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
        }`}
      >
        {mutation.isPending ? 'Master AI sedang menganalisis...' : 'Hasilkan Panduan Tenun'}
      </button>
    </form>
  )
}

export default TenunGuideForm