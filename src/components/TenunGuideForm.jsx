import { useState } from 'react'
import axiosClient from '../api/AxiosClient'

const TenunGuideForm = ({ onResult }) => {
  const [designName, setDesignName] = useState('')
  const [motifWidth, setMotifWidth] = useState('')
  const [motifHeight, setMotifHeight] = useState('')
  const [colors, setColors] = useState([])
  const [colorInput, setColorInput] = useState('')
  const [referenceImage, setReferenceImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addColor = () => {
    if (!colorInput.trim()) return
    setColors([...colors, colorInput.trim()])
    setColorInput('')
  }

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!designName || !motifWidth || !motifHeight || colors.length === 0) {
      setError('Lengkapi semua field dan minimal satu warna.')
      return
    }

    const formData = new FormData()

    formData.append('design_name', designName)
    formData.append('motif_width_lungsin', motifWidth)
    formData.append('motif_height_pakan', motifHeight)

    colors.forEach(c => formData.append('motif_colors[]', c))

    if (referenceImage) {
      formData.append('reference_image', referenceImage)
    }

    setLoading(true)

    try {
      const res = await axiosClient.post('/ai/seller/tenun-guide', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onResult(res.data.data)
    } catch (err) {
      console.error(err)
      setError('Gagal menghasilkan panduan tenun.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="border rounded p-5 space-y-4">

      <h2 className="font-semibold">
        Panduan Tenun Motif Baru
      </h2>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Nama Desain */}
      <div>
        <label className="text-sm">Nama Desain Wastra</label>
        <input
          className="border rounded w-full p-2 text-sm"
          value={designName}
          onChange={e => setDesignName(e.target.value)}
          placeholder="Contoh: Songket Surya Sidemen"
        />
      </div>

      {/* Ukuran */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Lebar Motif (lungsin)</label>
          <input
            type="number"
            className="border rounded w-full p-2 text-sm"
            value={motifWidth}
            onChange={e => setMotifWidth(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Tinggi Motif (pakan)</label>
          <input
            type="number"
            className="border rounded w-full p-2 text-sm"
            value={motifHeight}
            onChange={e => setMotifHeight(e.target.value)}
          />
        </div>
      </div>

      {/* Warna */}
      <div>
        <label className="text-sm">Warna Benang Motif</label>

        <div className="flex gap-2 mt-1">
          <input
            className="border rounded flex-1 p-2 text-sm"
            value={colorInput}
            onChange={e => setColorInput(e.target.value)}
            placeholder="emas / merah / biru"
          />

          <button
            type="button"
            onClick={addColor}
            className="px-3 rounded bg-gray-200 text-sm"
          >
            Tambah
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((c, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs cursor-pointer"
              onClick={() => removeColor(i)}
            >
              {c} ✕
            </span>
          ))}
        </div>
      </div>

      {/* Gambar Referensi */}
      <div>
        <label className="text-sm">Gambar Referensi (opsional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setReferenceImage(e.target.files[0])}
          className="text-sm"
        />
      </div>

      <button
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
      >
        {loading ? 'Memproses…' : 'Buat Panduan Tenun'}
      </button>

      <p className="text-xs text-gray-500">
        Klik warna untuk menghapus. Gambar membantu AI memahami motif.
      </p>
    </form>
  )
}

export default TenunGuideForm
