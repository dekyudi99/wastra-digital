import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '../api/AxiosClient'
import TenunGuideForm from './TenunGuideForm'
import TenunGuideContent from './TenunGuideContent'

const TenunGuideSection = () => {
  const [selectedId, setSelectedId] = useState(null)

  // Query 1: Ambil daftar riwayat (Ringan)
  const { data: history, isLoading: listLoading } = useQuery({
    queryKey: ['tenun-guides'],
    queryFn: async () => {
      const res = await axiosClient.get('/ai/seller/tenun-guides')
      return res.data.data.items || []
    }
  })

  // Query 2: Ambil detail panduan (Hanya jika selectedId ada)
  const { data: detail, isFetching: detailLoading } = useQuery({
    queryKey: ['tenun-guide-detail', selectedId],
    queryFn: async () => {
      const res = await axiosClient.get(`/ai/seller/tenun-guides/${selectedId}`)
      return res.data.data
    },
    enabled: !!selectedId, // Query hanya jalan jika selectedId tidak null
  })

  return (
    <div className="space-y-6">
      <TenunGuideForm onResult={(res) => setSelectedId(res.id)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kolom Riwayat */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700">Riwayat Panduan</h3>
          {listLoading && <p className="text-sm animate-pulse">Memuat riwayat...</p>}
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {history?.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedId === item.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <p className="text-sm font-bold">{item.design_name}</p>
                <p className="text-[10px] text-gray-500">{item.created_at}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Detail (Content) */}
        <div className="min-h-[400px]">
          {detailLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm">Menganalisis data master...</p>
            </div>
          ) : detail ? (
            <TenunGuideContent data={detail} />
          ) : (
            <div className="h-full border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Pilih riwayat untuk melihat detail
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TenunGuideSection