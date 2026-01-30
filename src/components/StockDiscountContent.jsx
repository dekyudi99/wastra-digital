import { useState } from 'react'
import ApprovalActions from './ApprovalActions'

const actionBadge = (label, value) => {
  const map = {
    increase: 'bg-green-100 text-green-700',
    decrease: 'bg-orange-100 text-orange-700',
    hold: 'bg-gray-100 text-gray-700',
  }

  const text =
    value === 'increase'
      ? `Naikkan ${label}`
      : value === 'decrease'
      ? `Turunkan ${label}`
      : 'Tahan'

  return (
    <span className={`px-2 py-0.5 rounded text-xs ${map[value] || ''}`}>
      {text}
    </span>
  )
}

const StockDiscountContent = ({ data }) => {
  if (!data?.actions) return null

  return (
    <div className="space-y-6">

      {/* INFO */}
      <p className="text-xs text-gray-500">
        Rekomendasi AI tidak langsung diterapkan.
        Perubahan hanya dilakukan setelah Anda menyetujui.
      </p>

      {/* SUMMARY */}
      {data.summary && (
        <div className="p-4 rounded bg-gray-50 text-sm text-gray-700">
          {data.summary}
        </div>
      )}

      {/* ACTION LIST */}
      <div className="space-y-4">
        {data.actions.map(action => {
          const [approved, setApproved] = useState(false)

          return (
            <div
              key={action.recommendation_id ?? action.product_id}
              className="border rounded-lg p-4 space-y-3"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-semibold">
                  {action.product_name}
                </h3>

                <div className="flex gap-2 flex-wrap">
                  {actionBadge('Stok', action.stock_action)}
                  {actionBadge('Diskon', action.discount_action)}
                </div>
              </div>

              {/* DISCOUNT */}
              {typeof action.suggested_discount === 'number' &&
               action.suggested_discount > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600">Diskon disarankan:</span>{' '}
                  <strong>{action.suggested_discount}%</strong>
                </div>
              )}

              {/* REASON */}
              {action.reason && (
                <div className="text-sm bg-indigo-50 text-indigo-700 p-3 rounded">
                  <strong>Alasan:</strong> {action.reason}
                </div>
              )}

              {/* APPROVAL */}
              <div className="pt-2">
                {!approved && action.recommendation_id && (
                  <ApprovalActions
                    recommendationId={action.recommendation_id}
                    onApproved={() => setApproved(true)}
                  />
                )}

                {approved && (
                  <span className="text-sm text-green-700">
                    ✔ Rekomendasi telah diterapkan
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* GENERAL STRATEGY */}
      {data.general_strategy?.length > 0 && (
        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Strategi Umum
          </h4>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {data.general_strategy.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default StockDiscountContent