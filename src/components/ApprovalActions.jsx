import { useState } from 'react'
import axiosClient from '../api/AxiosClient'

const ApprovalActions = ({ recommendationId, onApproved }) => {
  const [loading, setLoading] = useState(false)

  const approve = () => {
    if (!recommendationId) return

    setLoading(true)
    axiosClient
      .post(`/ai/recommendation/${recommendationId}/approve`)
      .then(() => onApproved?.())
      .finally(() => setLoading(false))
  }

  return (
    <button
      disabled={loading}
      onClick={approve}
      className="px-3 py-1 text-sm rounded bg-green-600 text-white disabled:opacity-50"
    >
      {loading ? 'Memproses...' : 'Setujui'}
    </button>
  )
}

export default ApprovalActions
