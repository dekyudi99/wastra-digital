import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Modal, Form, Input, Select, message, Spin, Radio } from 'antd'
import { ArrowLeftIcon, MapPinIcon, PlusIcon, ShoppingBagIcon,ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { formatPrice } from '../utils/format'
import shippingAddressApi from '../api/ShippingAddressApi'
import orderApi from '../api/OrderApi'
import { provinces, regencies, districts } from '../utils/indonesiaRegions'

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // Ambil data dari state navigasi (dari halaman Cart)
  const { cartItemIds, directProductId, directQuantity, totalAmount, items } = location.state || {};

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedRegency, setSelectedRegency] = useState(null)

  // 1. FETCH ALAMAT DARI API
  const { data: addressResponse, isLoading: loadingAddress } = useQuery({
    queryKey: ["shippingAddresses"],
    queryFn: async () => {
      const res = await shippingAddressApi.get()
      return res.data
    }
  })

  const addresses = addressResponse?.data || []

  // Auto-select alamat pertama jika ada
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  // 2. MUTATION: SIMPAN ALAMAT BARU
  const addAddressMutation = useMutation({
    mutationFn: (newAddr) => shippingAddressApi.store(newAddr),
    onSuccess: (res) => {
      message.success('Alamat berhasil disimpan')
      queryClient.invalidateQueries(["shippingAddresses"])
      setSelectedAddressId(res.data.data.id)
      setIsAddressModalVisible(false)
      form.resetFields()
    }
  })

  // 3. MUTATION: BUAT PESANAN (REDIRECT KE MIDTRANS)
  const createOrderMutation = useMutation({
    mutationFn: (payload) => orderApi.orderFromCart(payload),
    onSuccess: (res) => {
      const paymentUrl = res.data.data[1]; 

      if (paymentUrl) {
        message.loading('Mengarahkan ke halaman pembayaran...', 1.5).then(() => {
          // 🔑 GUNAKAN INI UNTUK REDIRECT KE LUAR
          window.location.href = paymentUrl;
        });
      } else {
        message.error('Gagal mendapatkan tautan pembayaran');
      }
    },
    onError: (err) => {
      message.error(err.response?.data?.message || 'Gagal membuat pesanan')
    }
  })

  const directOrderMutation = useMutation({
    mutationFn: ({ id, payload }) => orderApi.directOrder(id, payload),
    onSuccess: (res) => {
      const paymentUrl = res.data.data[1]; 

      if (paymentUrl) {
        message.loading('Mengarahkan ke halaman pembayaran...', 1.5).then(() => {
          // 🔑 GUNAKAN INI UNTUK REDIRECT KE LUAR
          window.location.href = paymentUrl;
        });
      } else {
        message.error('Gagal mendapatkan tautan pembayaran');
      }
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal buat pesanan')
  });

  const handleCheckout = () => {
    if (!selectedAddressId) return message.warning('Pilih alamat pengiriman');
    
    const address = addresses.find(a => a.id === selectedAddressId);
    const fullAddressString = `${address.alamat_detail}, ${address.kecamatan}, ${address.kabupaten}, ${address.provinsi} ${address.kode_pos}`;

    // CEK: Apakah ini pesanan dari Keranjang atau Langsung?
    if (cartItemIds && cartItemIds.length > 0) {
      // 🛒 PROSES KERANJANG
      createOrderMutation.mutate({
        cart_ids: cartItemIds,
        shipping_address: fullAddressString
      });
    } else {
      // ⚡ PROSES PESAN LANGSUNG
      // Gunakan directOrder (id_produk, payload)
      directOrderMutation.mutate({
        id: directProductId,
        payload: {
          quantity: directQuantity,
          shipping_address: fullAddressString
        }
      });
    }
  }

  // Early Return jika tidak ada item yang di-checkout
  if ((!cartItemIds || cartItemIds.length === 0) && directProductId == null) {
    return (
      <div className="text-center py-20">
        <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl">Tidak ada produk untuk di-checkout</h2>
        <Button onClick={() => navigate('/keranjang')} className="mt-4">Kembali ke Keranjang</Button>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-32">
      <div className="bg-white border-b sticky top-0 z-40 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* SECTION ALAMAT */}
        <Card title={
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-amber-700" /> Alamat Pengiriman</div>
            <Button type="link" onClick={() => setIsAddressModalVisible(true)} icon={<PlusIcon className="w-4 h-4" />}>Tambah</Button>
          </div>
        }>
          {loadingAddress ? <Spin /> : (
            <Radio.Group 
              className="w-full" 
              value={selectedAddressId} 
              onChange={(e) => setSelectedAddressId(e.target.value)}
            >
              <div className="space-y-3">
                {addresses.map(addr => (
                  <Radio key={addr.id} value={addr.id} className="w-full p-3 border rounded-lg">
                    <div className="inline-block ml-2">
                      <p className="font-bold">{addr.received_name} <span className="font-normal text-gray-500">({addr.telepon_number})</span></p>
                      <p className="text-gray-600 text-sm">{addr.alamat_detail}, {addr.kecamatan}, {addr.kabupaten}, {addr.provinsi}</p>
                    </div>
                  </Radio>
                ))}
              </div>
            </Radio.Group>
          )}
        </Card>

        {/* SECTION PRODUK */}
        <Card title="Rincian Produk">
          <div className="space-y-4">
            {items?.map(item => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img src={item.product.image_url?.[0]} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-gray-500">{item.quantity} x {formatPrice(item.product.last_price)}</p>
                </div>
                <p className="font-bold">{formatPrice(item.product.last_price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* RINGKASAN PEMBAYARAN */}
        <Card title="Ringkasan Pembayaran">
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
            <div className="flex justify-between"><span>Biaya Pengiriman</span><span className="text-red-600">Gratis Tapi Ambil Sendiri!</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total Tagihan</span>
              <span className="text-red-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* FOOTER ACTION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Pembayaran</p>
            <p className="text-xl font-bold text-red-600">{formatPrice(totalAmount)}</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            className="bg-amber-800 h-12 px-10 rounded-lg"
            loading={createOrderMutation.isLoading}
            onClick={() => {
              Modal.confirm({
                title: "Konfirmasi Checkout",
                icon: <ExclamationCircleIcon className='h-7 text-amber-600'/>,
                content: `Anda akan melakukan pembayaran untuk pesanan ini. Lanjutkan?`,
                okText: "Ya!",
                cancelText: "Nggak Jadi Deh!",
                onOk: () => {handleCheckout} 
              });
            }}
          >
            Bayar Sekarang
          </Button>
        </div>
      </div>

      {/* MODAL TAMBAH ALAMAT */}
      <Modal 
        title="Tambah Alamat Baru" 
        open={isAddressModalVisible} 
        onCancel={() => setIsAddressModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={(v) => {
          // Map label ke payload API
          const payload = {
            received_name: v.name,
            telepon_number: v.phone,
            provinsi: provinces.find(p => p.id === v.province)?.name,
            kabupaten: regencies[v.province]?.find(r => r.id === v.regency)?.name,
            kecamatan: districts[v.regency]?.find(d => d.id === v.district)?.name,
            kode_pos: v.postalCode,
            alamat_detail: v.streetAddress
          }
          addAddressMutation.mutate(payload)
        }}>
          <Form.Item name="name" label="Nama Penerima" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="phone" label="Nomor Telepon" rules={[{required: true}]}><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="province" label="Provinsi" rules={[{required: true}]}>
              <Select onChange={(v) => {setSelectedProvince(v); setSelectedRegency(null)}} placeholder="Pilih">
                {provinces.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="regency" label="Kabupaten" rules={[{required: true}]}>
              <Select disabled={!selectedProvince} onChange={setSelectedRegency} placeholder="Pilih">
                {selectedProvince && regencies[selectedProvince]?.map(r => <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="district" label="Kecamatan" rules={[{required: true}]}>
            <Select disabled={!selectedRegency} placeholder="Pilih">
              {selectedRegency && districts[selectedRegency]?.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="postalCode" label="Kode Pos" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="streetAddress" label="Alamat Detail" rules={[{required: true}]}><Input.TextArea /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={addAddressMutation.isLoading} className="bg-amber-800">Simpan Alamat</Button>
        </Form>
      </Modal>
    </div>
  )
}

export default Checkout