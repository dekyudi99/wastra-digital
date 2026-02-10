import { useEffect, useState } from 'react'
import axiosClient from '../api/AxiosClient'
import AiSkeleton from '../components/AiSkeleton'
import AiInsightContent from '../components/AiInsightContent'
import HealthScoreContent from '../components/HealthScoreContent'
import StockDiscountContent from '../components/StockDiscountContent'
import TenunGuideForm from '../components/TenunGuideForm'
import TenunGuideContent from '../components/TenunGuideContent'

const endpointMap = {
  buyer: {
    overview: '/ai/buyer',
  },
  seller: {
    overview: '/ai/seller',
    health: '/ai/seller/health-score',
    stock: '/ai/seller/stock-discount',
  },
}

const AiInsightPage = () => {
  const [mode, setMode] = useState('buyer') // buyer | seller
  const [insightType, setInsightType] = useState('overview')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // tentukan mode dari role
  useEffect(() => {
    const role = localStorage.getItem('ROLE')
    if (role === 'artisan') {
      setMode('seller')
      setInsightType('overview')
    } else {
      setMode('buyer')
      setInsightType('overview')
    }
  }, [])

  // fetch insight (kecuali tenun)
  useEffect(() => {
    if (insightType === 'tenun') {
      setData(null)
      return
    }

    const endpoint = endpointMap[mode]?.[insightType]
    if (!endpoint) return

    setLoading(true)
    axiosClient
      .get(endpoint)
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [mode, insightType])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* NAV KHUSUS SELLER */}
      {mode === 'seller' && (
        <div className="flex gap-2 flex-wrap">
          {[
            ['overview', 'Ringkasan'],
            ['health', 'Health Score'],
            ['stock', 'Stok & Diskon'],
            ['tenun', 'Panduan Tenun'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setInsightType(key)}
              className={`px-3 py-1 rounded text-sm ${
                insightType === key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* BUYER TIDAK PUNYA NAV */}
      {mode === 'buyer' && (
        <p className="text-sm text-gray-500">
          Insight dihasilkan dari data penjualan & ulasan produk.
        </p>
      )}

      {loading && <AiSkeleton />}

      {/* RENDER CONTENT */}
      {data && insightType === 'overview' && (
        <AiInsightContent data={data} mode={mode} />
      )}

      {mode === 'seller' && data && insightType === 'health' && (
        <HealthScoreContent data={data} />
      )}

      {mode === 'seller' && data && insightType === 'stock' && (
        <StockDiscountContent data={data} />
      )}

      {mode === 'seller' && insightType === 'tenun' && (
        <>
          <TenunGuideForm onResult={setData} />
          {data && <TenunGuideContent data={data} />}
        </>
      )}
    </div>
  )
}

export default AiInsightPage