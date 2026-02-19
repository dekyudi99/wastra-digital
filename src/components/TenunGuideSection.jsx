import { useEffect, useState } from 'react'
import axiosClient from '../api/AxiosClient'
import TenunGuideForm from './TenunGuideForm'
import TenunGuideContent from './TenunGuideContent'

const TenunGuideSection = () => {
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/ai/seller/tenun-guides')
      setHistory(res.data.data.items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="space-y-6">

      <TenunGuideForm
        onResult={(newGuide) => {
          fetchHistory()
          setSelected(newGuide)
        }}
      />

      <div>
        <h3 className="font-semibold mb-3">Riwayat Panduan</h3>

        {loading && <p className="text-sm">Memuat...</p>}

        {history.length === 0 && (
          <p className="text-sm text-gray-500">
            Belum ada panduan.
          </p>
        )}

        <div className="space-y-2">
          {history.map(item => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="border rounded p-3 cursor-pointer hover:bg-gray-50"
            >
              <div className="font-medium text-sm">
                {item.design_name}
              </div>
              <div className="text-xs text-gray-500">
                {item.motif_width_lungsin}×{item.motif_height_pakan} | {item.motif_colors.join(', ')}
              </div>
              <div className="text-xs text-gray-400">
                {item.created_at}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <TenunGuideContent data={selected} />
      )}
    </div>
  )
}

export default TenunGuideSection
