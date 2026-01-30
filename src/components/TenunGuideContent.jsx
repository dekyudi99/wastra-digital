const TenunGuideContent = ({ data }) => {
  if (!data) return null

  const {
    summary,
    loom_setup,
    weaving_steps = [],
    tips_penenun = [],
    kesalahan_umum = [],
  } = data

  return (
    <div className="space-y-8">

      {/* RINGKASAN */}
      <section className="bg-gray-50 border rounded p-5">
        <h2 className="font-semibold mb-2">
          Ringkasan Panduan
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          {summary}
        </p>
      </section>

      {/* SETUP ALAT TENUN */}
      {loom_setup && (
        <section className="border rounded p-5">
          <h3 className="font-semibold mb-3">
            Persiapan Alat & Lungsin
          </h3>

          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              Total benang lungsin:{' '}
              <strong>{loom_setup.total_lungsin}</strong>
            </li>
            <li>
              Awal area motif (lungsin ke-):{' '}
              <strong>{loom_setup.motif_start_lungsin}</strong>
            </li>
            <li>
              Lebar motif:{' '}
              <strong>{loom_setup.motif_width_lungsin}</strong>{' '}
              lungsin
            </li>
            <li>
              Tinggi motif:{' '}
              <strong>{loom_setup.motif_height_pakan}</strong>{' '}
              pakan
            </li>
            <li>
              Benang motif:{' '}
              <strong>{loom_setup.motif_thread}</strong>
            </li>
          </ul>
        </section>
      )}

      {/* LANGKAH MENENUN */}
      <section>
        <h3 className="font-semibold mb-4">
          Langkah Menenun Motif (Baris per Baris)
        </h3>

        {weaving_steps.length === 0 && (
          <p className="text-sm text-gray-500">
            Langkah menenun belum tersedia.
          </p>
        )}

        <div className="space-y-4">
          {weaving_steps.map(step => (
            <div
              key={step.row}
              className="border rounded p-4"
            >
              <div className="font-semibold mb-2">
                Baris ke-{step.row}
              </div>

              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Angkat lungsin:</strong>{' '}
                  {step.angkat_lungsin}
                </li>

                <li>
                  <strong>Benang motif:</strong>{' '}
                  {step.masukkan_benang_motif
                    ? 'Masukkan benang motif'
                    : 'Tidak memasukkan benang motif'}
                </li>

                <li>
                  <strong>Memadatkan:</strong>{' '}
                  {step.cara_memadatkan}
                </li>

                <li>
                  <strong>Kunci pakan biasa:</strong>{' '}
                  {step.kunci_pakan_biasa} kali
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS PENENUN */}
      {tips_penenun.length > 0 && (
        <section className="bg-green-50 border rounded p-5">
          <h3 className="font-semibold mb-2">
            Tips Penenun
          </h3>

          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {tips_penenun.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {/* KESALAHAN UMUM */}
      {kesalahan_umum.length > 0 && (
        <section className="bg-red-50 border rounded p-5">
          <h3 className="font-semibold mb-2">
            Kesalahan yang Perlu Dihindari
          </h3>

          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {kesalahan_umum.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default TenunGuideContent
