import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Steps } from 'antd'
import { BuildingOffice2Icon, UserIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { AUTH_STORAGE_KEYS, ROLE_DESCRIPTIONS_ID, ROLE_LABELS_ID, USER_ROLES } from '../utils/authRoles'

const roleCards = [
  {
    role: USER_ROLES.CUSTOMER,
    title: ROLE_LABELS_ID[USER_ROLES.CUSTOMER],
    desc: ROLE_DESCRIPTIONS_ID[USER_ROLES.CUSTOMER],
    icon: <UserIcon className="w-6 h-6 text-wastra-brown-700" />,
  },
  {
    role: USER_ROLES.ARTISAN,
    title: ROLE_LABELS_ID[USER_ROLES.ARTISAN],
    desc: ROLE_DESCRIPTIONS_ID[USER_ROLES.ARTISAN],
    icon: <WrenchScrewdriverIcon className="w-6 h-6 text-wastra-brown-700" />,
  },
  {
    role: USER_ROLES.ADMIN,
    title: ROLE_LABELS_ID[USER_ROLES.ADMIN],
    desc: ROLE_DESCRIPTIONS_ID[USER_ROLES.ADMIN],
    icon: <BuildingOffice2Icon className="w-6 h-6 text-wastra-brown-700" />,
  },
]

const AuthOnboarding = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/masuk'

  const initialRole = useMemo(() => {
    const fromStorage = localStorage.getItem(AUTH_STORAGE_KEYS.ROLE)
    if (fromStorage) return fromStorage
    return USER_ROLES.CUSTOMER
  }, [])

  const [step, setStep] = useState(0)
  const [role, setRole] = useState(initialRole)

  const saveRole = (nextRole) => {
    setRole(nextRole)
    localStorage.setItem(AUTH_STORAGE_KEYS.ROLE, nextRole)
  }

  return (
    <div className="bg-wastra-brown-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-wastra-brown-800">Mulai di Wastra Digital</h1>
            <p className="text-wastra-brown-600 mt-2">
              Pilih peran Anda agar tampilan dan alur lebih sesuai kebutuhan.
            </p>
          </div>

          <Card className="border border-wastra-brown-100 rounded-2xl">
            <Steps
              current={step}
              items={[
                { title: 'Pilih Peran' },
                { title: 'Ringkasan' },
                { title: 'Masuk / Daftar' },
              ]}
            />

            {step === 0 && (
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleCards.map((r) => {
                    const selected = r.role === role
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => saveRole(r.role)}
                        className={[
                          'text-left rounded-2xl border p-5 transition-all',
                          selected
                            ? 'border-wastra-brown-400 bg-white shadow-sm'
                            : 'border-wastra-brown-100 bg-white hover:border-wastra-brown-200',
                        ].join(' ')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-wastra-brown-50 border border-wastra-brown-100 flex items-center justify-center">
                            {r.icon}
                          </div>
                          {selected && (
                            <span className="text-xs px-2 py-1 rounded-full bg-wastra-brown-50 text-wastra-brown-700 border border-wastra-brown-100">
                              Dipilih
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="font-semibold text-wastra-brown-800">{r.title}</div>
                          <div className="text-sm text-wastra-brown-600 mt-1">{r.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    type="primary"
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                    onClick={() => setStep(1)}
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-8">
                <div className="rounded-2xl border border-wastra-brown-100 bg-wastra-brown-50 p-6">
                  <div className="text-sm text-wastra-brown-600">Peran Anda</div>
                  <div className="text-2xl font-semibold text-wastra-brown-800 mt-1">
                    {ROLE_LABELS_ID[role]}
                  </div>
                  <div className="text-wastra-brown-600 mt-2">
                    {ROLE_DESCRIPTIONS_ID[role]}
                  </div>

                  <ul className="mt-4 text-sm text-wastra-brown-700 list-disc pl-5 space-y-1">
                    {role === USER_ROLES.ARTISAN && (
                      <>
                        <li>Tambah & kelola produk tenun</li>
                        <li>Kelola profil pengrajin</li>
                        <li>Panduan sederhana untuk literasi digital</li>
                      </>
                    )}
                    {role === USER_ROLES.CUSTOMER && (
                      <>
                        <li>Jelajahi katalog & detail produk</li>
                        <li>Simpan favorit (UI)</li>
                        <li>Beli dengan alur yang jelas (checkout menyusul)</li>
                      </>
                    )}
                    {role === USER_ROLES.ADMIN && (
                      <>
                        <li>Kelola produk & pengrajin (UI admin)</li>
                        <li>Pantau ringkasan aktivitas</li>
                        <li>Kontrol konten platform</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button onClick={() => setStep(0)}>Kembali</Button>
                  <Button
                    type="primary"
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                    onClick={() => setStep(2)}
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8">
                <div className="rounded-2xl border border-wastra-brown-100 bg-white p-6">
                  <div className="text-sm text-wastra-brown-600">Lanjut sebagai</div>
                  <div className="text-xl font-semibold text-wastra-brown-800 mt-1">
                    {ROLE_LABELS_ID[role]}
                  </div>
                  <div className="text-wastra-brown-600 mt-2">
                    Silakan masuk atau buat akun baru.
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="primary"
                    size="large"
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                    onClick={() => navigate(`${redirect}?role=${role}`)}
                  >
                    Masuk
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate(`/daftar?role=${role}`)}
                    className="border-wastra-brown-200 text-wastra-brown-700"
                  >
                    Daftar
                  </Button>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button onClick={() => setStep(1)}>Kembali</Button>
                  <Button type="link" onClick={() => navigate('/')} className="text-wastra-brown-600">
                    Lewati dulu
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthOnboarding





