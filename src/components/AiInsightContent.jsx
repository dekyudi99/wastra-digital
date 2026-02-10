const AiInsightContent = ({ data, mode }) => {
  if (!data) return null

  const {
    summary,
    key_insights = [],
    market_pattern,
    top_products_reasoning,
    top_selling_products = [],
    top_products = [],
  } = data

  const products =
    mode === 'buyer'
      ? top_selling_products
      : top_products

  return (
    <div className="space-y-6">

      {/* AI MAIN INSIGHT */}
      <div className="p-5 rounded-lg bg-indigo-50 border border-indigo-100">
        <h3 className="font-semibold text-indigo-700 mb-2">
          Insight AI
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* KEY INSIGHTS */}
      {key_insights.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">
            Poin Penting
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {key_insights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* MARKET PATTERN (BUYER ONLY) */}
      {mode === 'buyer' && market_pattern && (
        <div className="text-sm text-gray-600 italic">
          Pola pasar: {market_pattern}
        </div>
      )}

      {/* DATA PENDUKUNG */}
      {products.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">
            Produk Terkait
          </h4>

          <div className="space-y-3">
            {products.map(p => (
              <div
                key={p.id}
                className="border rounded p-4 bg-white"
              >
                <div className="font-medium">
                  {p.name}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  Harga: Rp {p.final_price ?? p.price}
                </div>

                <div className="text-sm text-gray-600">
                  Rating: {p.rating ?? '-'} | Terjual: {p.sales}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* AI REASONING */}
      {top_products_reasoning && (
        <div className="text-sm text-gray-600 border-t pt-4">
          {top_products_reasoning}
        </div>
      )}
    </div>
  )
}

export default AiInsightContent
