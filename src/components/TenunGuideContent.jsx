const TenunGuideContent = ({ data }) => {
  if (!data) return null

  const guide = data.ai_result ?? data

  return (
    <div className="space-y-6 border-t pt-6">

      <section className="bg-gray-50 border rounded p-4">
        <strong>{data.design_name}</strong>
        <div className="text-xs text-gray-500">
          {data.motif_width_lungsin}×{data.motif_height_pakan}
        </div>
        <div className="text-xs">
          Warna: {data.motif_colors?.join(', ')}
        </div>

        {data.reference_image_url && (
          <img
            src={data.reference_image_url}
            className="mt-3 rounded border max-w-sm"
          />
        )}
      </section>

      <section>
        <p className="text-sm">{guide.summary}</p>
      </section>

      {guide.weaving_steps?.map(step => (
        <div key={step.row} className="border rounded p-3 text-sm">
          <strong>Baris {step.row}</strong>
          <div>Angkat: {step.angkat_lungsin}</div>
          <div>{step.masukkan_benang_motif ? 'Masukkan benang motif' : 'Tanpa motif'}</div>
          <div>Padatkan: {step.cara_memadatkan}</div>
          <div>Kunci: {step.kunci_pakan_biasa}x</div>
        </div>
      ))}
    </div>
  )
}

export default TenunGuideContent
