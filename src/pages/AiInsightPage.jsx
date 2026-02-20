import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '../api/AxiosClient'
import AiSkeleton from '../components/AiSkeleton'
import AiInsightContent from '../components/AiInsightContent'
import HealthScoreContent from '../components/HealthScoreContent'
import StockDiscountContent from '../components/StockDiscountContent'
import TenunGuideSection from '../components/TenunGuideSection'

const AiInsightPage = () => {
  const role = localStorage.getItem('ROLE') === 'artisan' ? 'seller' : 'buyer'
  const [activeTab, setActiveTab] = useState(role === 'seller' ? 'tenun' : 'overview')

  const endpointMap = {
    overview: role === 'seller' ? '/ai/seller' : '/ai/buyer',
    health: '/ai/seller/health-score',
    stock: '/ai/seller/stock-discount',
  }

  // TanStack Query otomatis menghandle fetch & caching
  const { data, isLoading, isError } = useQuery({
    queryKey: ['insight', role, activeTab],
    queryFn: async () => {
      const res = await axiosClient.get(endpointMap[activeTab])
      return res.data.data
    },
    enabled: activeTab !== 'tenun', // Jangan fetch jika di tab tenun (tenun punya query sendiri)
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
  })

  const tabs = [
    { key: 'tenun', label: 'Panduan Tenun', show: role === 'seller' },
    { key: 'overview', label: 'Ringkasan', show: true },
    { key: 'health', label: 'Health Score', show: role === 'seller' },
    { key: 'stock', label: 'Stok & Diskon', show: role === 'seller' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Business Insight</h1>
        <p className="text-sm text-gray-500">Keputusan cerdas berbasis data untuk wastra Anda.</p>
      </header>

      {/* Navigation Tab */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.filter(t => t.show).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.key ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Logic */}
      {isLoading && activeTab !== 'tenun' && <AiSkeleton />}
      
      {isError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          Gagal memuat data. Pastikan koneksi internet Anda stabil.
        </div>
      )}

      <main className="animate-in fade-in duration-500">
        {activeTab === 'tenun' && <TenunGuideSection />}
        {data && activeTab === 'overview' && <AiInsightContent data={data} mode={role} />}
        {data && activeTab === 'health' && <HealthScoreContent data={data} />}
        {data && activeTab === 'stock' && <StockDiscountContent data={data} />}
      </main>
    </div>
  )
}

export default AiInsightPage