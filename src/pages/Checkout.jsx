import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Modal, Form, Input, Select, message, Spin, Radio, Space, Popconfirm } from 'antd'
import { ArrowLeftIcon, MapPinIcon, PlusIcon, ShoppingBagIcon, PencilSquareIcon, TrashIcon, CreditCardIcon } from '@heroicons/react/24/outline'
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
  
  const { cartItemIds, directProductId, directQuantity, totalAmount, items } = location.state || {};

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('midtrans') // Default Midtrans/Transfer
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedRegency, setSelectedRegency] = useState(null)

  // 1. FETCH ALAMAT
  const { data: addressResponse, isLoading: loadingAddress } = useQuery({
    queryKey: ["shippingAddresses"],
    queryFn: async () => {
      const res = await shippingAddressApi.get()
      return res.data
    }
  })

  const addresses = addressResponse?.data || []

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  // 2. MUTATIONS
  const addressMutation = useMutation({
    mutationFn: (payload) => 
      editingAddressId 
        ? shippingAddressApi.update(editingAddressId, payload) 
        : shippingAddressApi.store(payload),
    onSuccess: () => {
      message.success(`Alamat berhasil ${editingAddressId ? 'diperbarui' : 'disimpan'}`)
      queryClient.invalidateQueries(["shippingAddresses"])
      closeAddressModal()
    }
  })

  const deleteAddressMutation = useMutation({
    mutationFn: (id) => shippingAddressApi.delete(id),
    onSuccess: () => {
      message.success('Alamat dihapus')
      queryClient.invalidateQueries(["shippingAddresses"])
    }
  })

  const createOrderMutation = useMutation({
    mutationFn: (payload) => orderApi.orderFromCart(payload),
    onSuccess: (res) => handleOrderSuccess(res),
    onError: (err) => message.error(err.response?.data?.message || 'Gagal membuat pesanan')
  })

  const directOrderMutation = useMutation({
    mutationFn: ({ id, payload }) => orderApi.directOrder(id, payload),
    onSuccess: (res) => handleOrderSuccess(res),
    onError: (err) => message.error(err.response?.data?.message || 'Gagal buat pesanan')
  });

  // LOGIKA HANDLERS
  const handleOrderSuccess = (res) => {
    // Jika COD, biasanya langsung ke success page. Jika transfer, ke Midtrans.
    if (paymentMethod === 'cod') {
      message.success('Pesanan COD berhasil dibuat!');
      navigate('/pesanan/list'); // Sesuaikan route Anda
    } else {
      const paymentUrl = res.data.data[1];
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        message.error('Gagal mendapatkan tautan pembayaran');
      }
    }
  }

  const openEditModal = (addr) => {
    setEditingAddressId(addr.id);
    
    // Cari ID untuk Select berdasarkan nama (karena data API Anda menyimpan string nama)
    const provObj = provinces.find(p => p.name === addr.provinsi);
    const regObj = provObj ? regencies[provObj.id]?.find(r => r.name === addr.kabupaten) : null;
    const distObj = regObj ? districts[regObj.id]?.find(d => d.name === addr.kecamatan) : null;

    setSelectedProvince(provObj?.id);
    setSelectedRegency(regObj?.id);

    form.setFieldsValue({
      name: addr.received_name,
      phone: addr.telepon_number,
      province: provObj?.id,
      regency: regObj?.id,
      district: distObj?.id,
      postalCode: addr.kode_pos,
      streetAddress: addr.alamat_detail
    });
    setIsAddressModalVisible(true);
  }

  const closeAddressModal = () => {
    setIsAddressModalVisible(false);
    setEditingAddressId(null);
    form.resetFields();
  }

  const handleCheckout = () => {
    if (!selectedAddressId) return message.warning('Pilih alamat pengiriman');
    
    const address = addresses.find(a => a.id === selectedAddressId);
    const fullAddressString = `${address.alamat_detail}, ${address.kecamatan}, ${address.kabupaten}, ${address.provinsi} ${address.kode_pos}`;

    const commonPayload = {
      shipping_address: fullAddressString,
      payment_method: paymentMethod
    };

    if (cartItemIds?.length > 0) {
      createOrderMutation.mutate({ ...commonPayload, cart_ids: cartItemIds });
    } else {
      directOrderMutation.mutate({
        id: directProductId,
        payload: { ...commonPayload, quantity: directQuantity }
      });
    }
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-32">
      {/* Header */}
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
            <Radio.Group className="w-full" value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div key={addr.id} className="relative group border rounded-lg p-3">
                    <Radio value={addr.id} className="w-full">
                      <div className="inline-block ml-2 pr-12">
                        <p className="font-bold">{addr.received_name} <span className="font-normal text-gray-500">({addr.telepon_number})</span></p>
                        <p className="text-gray-600 text-sm">{addr.alamat_detail}, {addr.kecamatan}, {addr.kabupaten}, {addr.provinsi}</p>
                      </div>
                    </Radio>
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <PencilSquareIcon 
                        className="w-5 h-5 text-blue-500 cursor-pointer" 
                        onClick={() => openEditModal(addr)} 
                      />
                      <Popconfirm title="Hapus alamat ini?" onConfirm={() => deleteAddressMutation.mutate(addr.id)}>
                        <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            </Radio.Group>
          )}
        </Card>

        {/* SECTION METODE PEMBAYARAN */}
        <Card title={<div className="flex items-center gap-2"><CreditCardIcon className="w-5 h-5 text-amber-700" /> Metode Pembayaran</div>}>
          <Radio.Group 
            className="w-full" 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Space direction="vertical" className="w-full text-black">
              <div className={`p-4 border rounded-lg cursor-pointer flex justify-between ${paymentMethod === 'midtrans' ? 'border-amber-600 bg-amber-50' : ''}`} onClick={() => setPaymentMethod('midtrans')}>
                <Radio value="midtrans">
                  <p className='text-black'>Transfer Bank / E-Wallet (Midtrans)</p>
                </Radio>
              </div>
              <div className={`p-4 border rounded-lg cursor-pointer flex justify-between ${paymentMethod === 'cod' ? 'border-amber-600 bg-amber-50' : ''}`} onClick={() => setPaymentMethod('cod')}>
                <Radio value="cod">
                  <span className='text-black'>Bayar di Tempat (COD)</span>
                </Radio>
              </div>
            </Space>
          </Radio.Group>
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
            className="bg-amber-800 h-12 px-10 rounded-lg border-none"
            loading={createOrderMutation.isPending || directOrderMutation.isPending}
            onClick={handleCheckout}
          >
            {paymentMethod === 'cod' ? 'Buat Pesanan' : 'Bayar Sekarang'}
          </Button>
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT ALAMAT */}
      <Modal 
        title={editingAddressId ? "Edit Alamat" : "Tambah Alamat Baru"} 
        open={isAddressModalVisible} 
        onCancel={closeAddressModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(v) => {
          const payload = {
            received_name: v.name,
            telepon_number: v.phone,
            provinsi: provinces.find(p => p.id === v.province)?.name,
            kabupaten: regencies[v.province]?.find(r => r.id === v.regency)?.name,
            kecamatan: districts[v.regency]?.find(d => d.id === v.district)?.name,
            kode_pos: v.postalCode,
            alamat_detail: v.streetAddress
          }
          addressMutation.mutate(payload)
        }}>
          <Form.Item name="name" label="Nama Penerima" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="phone" label="Nomor Telepon" rules={[{required: true}]}><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="province" label="Provinsi" rules={[{required: true}]}>
              <Select onChange={(v) => {setSelectedProvince(v); setSelectedRegency(null); form.setFieldsValue({regency: null, district: null})}} placeholder="Pilih">
                {provinces.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="regency" label="Kabupaten" rules={[{required: true}]}>
              <Select disabled={!selectedProvince} onChange={(v) => {setSelectedRegency(v); form.setFieldsValue({district: null})}} placeholder="Pilih">
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
          <Button type="primary" htmlType="submit" block loading={addressMutation.isPending} className="bg-amber-800 border-none">
            {editingAddressId ? 'Simpan Perubahan' : 'Simpan Alamat'}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}

export default Checkout