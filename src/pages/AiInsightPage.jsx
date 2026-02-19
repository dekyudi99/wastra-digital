import { useEffect, useState } from 'react'
import axiosClient from '../api/AxiosClient'
import AiSkeleton from '../components/AiSkeleton'
import AiInsightContent from '../components/AiInsightContent'
import HealthScoreContent from '../components/HealthScoreContent'
import StockDiscountContent from '../components/StockDiscountContent'
import TenunGuideSection from '../components/TenunGuideSection'

const INSIGHT = {
  OVERVIEW: 'overview',
  HEALTH: 'health',
  STOCK: 'stock',
  TENUN: 'tenunGuide',
}

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
  const [mode, setMode] = useState('buyer')
  const [insightType, setInsightType] = useState(INSIGHT.OVERVIEW)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Tentukan role & default tab
  useEffect(() => {
    const role = localStorage.getItem('ROLE')

    if (role === 'artisan') {
      setMode('seller')
      setInsightType(INSIGHT.TENUN) // pengrajin langsung ke Tenun
    } else {
      setMode('buyer')
      setInsightType(INSIGHT.OVERVIEW)
    }
  }, [])

  // Fetch insight non-tenun
  useEffect(() => {
    if (insightType === INSIGHT.TENUN) return

    const endpoint = endpointMap[mode]?.[insightType]
    if (!endpoint) return

    const controller = new AbortController()

    setLoading(true)

    axiosClient
      .get(endpoint, { signal: controller.signal })
      .then(res => setData(res.data.data))
      .catch(e => {
        if (e.name !== 'CanceledError') console.error(e)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [mode, insightType])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* NAV SELLER */}
      {mode === 'seller' && (
        <div className="flex gap-2 flex-wrap">
          {[
            [INSIGHT.TENUN, 'Panduan Tenun'],
            [INSIGHT.OVERVIEW, 'Ringkasan'],
            [INSIGHT.HEALTH, 'Health Score'],
            [INSIGHT.STOCK, 'Stok & Diskon'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setInsightType(key)
                if (key !== INSIGHT.TENUN) setData(null)
              }}
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

      {/* BUYER */}
      {mode === 'buyer' && (
        <p className="text-sm text-gray-500">
          Insight dihasilkan dari data penjualan & ulasan produk.
        </p>
      )}

      {loading && <AiSkeleton />}

      {/* CONTENT */}
      {data && insightType === INSIGHT.OVERVIEW && (
        <AiInsightContent data={data} mode={mode} />
      )}

      {mode === 'seller' && data && insightType === INSIGHT.HEALTH && (
        <HealthScoreContent data={data} />
      )}

      {mode === 'seller' && data && insightType === INSIGHT.STOCK && (
        <StockDiscountContent data={data} />
      )}

      {mode === 'seller' && insightType === INSIGHT.TENUN && (
        <TenunGuideSection />
      )}
    </div>
  )
}

export default AiInsightPage