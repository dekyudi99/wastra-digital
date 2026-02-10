const scoreColor = score => {
  if (score >= 80) return 'bg-green-100 text-green-700'
  if (score >= 60) return 'bg-yellow-100 text-yellow-700'
  if (score >= 40) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

const statusLabel = status => {
  switch (status) {
    case 'healthy': return 'Sehat'
    case 'stable': return 'Stabil'
    case 'weak': return 'Lemah'
    case 'critical': return 'Kritis'
    default: return status
  }
}

const HealthScoreContent = ({ data }) => {
  if (!data?.products) return null

  return (
    <div className="space-y-6">
      
      {/* SUMMARY */}
      {data.summary && (
        <div className="p-4 rounded bg-gray-50 text-sm text-gray-700">
          {data.summary}
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="space-y-4">
        {data.products.map(product => (
          <div
            key={product.product_id}
            className="border rounded-lg p-4 flex flex-col gap-3"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold">
                  {product.product_name}
                </h3>
                <span className="text-xs text-gray-500">
                  Status: {statusLabel(product.status)}
                </span>
              </div>

              <div
                className={`px-3 py-1 rounded text-sm font-semibold ${scoreColor(product.health_score)}`}
              >
                {product.health_score}
              </div>
            </div>

            {/* FACTORS */}
            {product.main_factors?.length > 0 && (
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {product.main_factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}

            {/* ACTION */}
            {product.recommended_action && (
              <div className="text-sm bg-indigo-50 text-indigo-700 p-3 rounded">
                <strong>Saran:</strong> {product.recommended_action}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GENERAL NOTES */}
      {data.general_notes?.length > 0 && (
        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Catatan Umum
          </h4>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {data.general_notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default HealthScoreContent
