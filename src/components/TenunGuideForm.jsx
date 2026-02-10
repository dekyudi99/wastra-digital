import { useState } from 'react'
import axiosClient from '../api/AxiosClient'

const TenunGuideForm = ({ onResult }) => {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [thread, setThread] = useState('emas')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async e => {
    e.preventDefault()
    setError(null)

    if (!width || !height) {
      setError('Lebar dan tinggi motif wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await axiosClient.post('/ai/seller/tenun-guide', {
        motif_width_lungsin: Number(width),
        motif_height_pakan: Number(height),
        motif_thread: thread,
      })

      onResult?.(res.data.data)
    } catch (err) {
      setError('Panduan belum bisa dihasilkan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border rounded p-5 space-y-4 bg-white"
    >
      <h2 className="font-semibold">
        Minta Panduan Menenun Motif
      </h2>

      {/* LEBAR MOTIF */}
      <div>
        <label className="block text-sm mb-1">
          Lebar motif (jumlah lungsin)
        </label>
        <input
          type="number"
          min={10}
          max={400}
          value={width}
          onChange={e => setWidth(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="contoh: 160"
        />
      </div>

      {/* TINGGI MOTIF */}
      <div>
        <label className="block text-sm mb-1">
          Tinggi motif (jumlah pakan)
        </label>
        <input
          type="number"
          min={5}
          max={200}
          value={height}
          onChange={e => setHeight(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="contoh: 50"
        />
      </div>

      {/* BENANG MOTIF */}
      <div>
        <label className="block text-sm mb-1">
          Benang motif
        </label>
        <select
          value={thread}
          onChange={e => setThread(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="emas">Benang emas</option>
          <option value="perak">Benang perak</option>
          <option value="warna">Benang warna</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded text-sm disabled:opacity-50"
      >
        {loading ? 'Menyusun panduan...' : 'Buat Panduan Tenun'}
      </button>

      <p className="text-xs text-gray-500">
        Panduan akan dijelaskan langkah demi langkah seperti penenun ke penenun.
      </p>
    </form>
  )
}

export default TenunGuideForm
