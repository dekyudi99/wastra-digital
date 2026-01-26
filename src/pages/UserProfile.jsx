import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Upload, Avatar, message, Tabs, Spin } from 'antd'
import { UserIcon, CameraIcon, ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { ROLE_LABELS_ID } from '../utils/authRoles'
import userApi from '../api/UserApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { TabPane } = Tabs

const UserProfile = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [previewImage, setPreviewImage] = useState(null)
  const [fileList, setFileList] = useState([])

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.profile,
  })

  const user = userData?.data?.data

  // Sinkronisasi form saat data user dimuat
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: ROLE_LABELS_ID[user.role],
      })
    }
  }, [user, form])

  // MUTATION: Update Profile
  const updateProfile = useMutation({
    mutationFn: (data) => userApi.update(data),
    onSuccess: () => {
      message.success('Profil berhasil diperbarui')
      queryClient.invalidateQueries(["userProfile"])
      setFileList([])
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal update profil')
  })

  // MUTATION: Change Password
  const updatePassword = useMutation({
    mutationFn: (data) => userApi.changePassword(data),
    onSuccess: () => {
      message.success('Password berhasil diubah')
      passwordForm.resetFields()
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal ubah password')
  })

  const handleUpdateProfile = (values) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('phone', values.phone)
    if (fileList.length > 0) {
      formData.append('profile_picture', fileList[0].originFileObj)
    }
    updateProfile.mutate(formData)
  }

  const handleChangePassword = (values) => {
    updatePassword.mutate({
      current_password: values.currentPassword,
      new_password: values.newPassword,
      confirm_password: values.confirmPassword
    })
  }

  const handlePreview = (info) => {
    // Ambil file terakhir yang diunggah
    const file = info.fileList[info.fileList.length - 1];
    
    if (file && file.originFileObj) {
      // Membuat URL sementara untuk pratinjau
      const url = URL.createObjectURL(file.originFileObj);
      setPreviewImage(url);
      setFileList([file]); // Simpan file untuk dikirim saat onFinish
      
      // Opsional: Bersihkan memori saat komponen unmount atau foto diganti lagi
      return () => URL.revokeObjectURL(url);
    }
  };

  if (isLoading) return <div className="text-center py-20"><Spin size="large" /></div>

  return (
    <div className="bg-wastra-brown-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-600">
          <ArrowLeftIcon className="w-5 h-5" /> Kembali
        </button>

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white rounded-xl shadow-sm p-6">
          <TabPane tab="Profil" key="profile">
            <div className="text-center mb-8">
              <Upload
                listType="picture-circle"
                showUploadList={false}
                beforeUpload={() => false} // Mencegah upload otomatis
                onChange={handlePreview}
              >
                <div className="relative">
                  <Avatar
                    size={120}
                    // Prioritas: 1. Foto yang baru dipilih (preview) 2. Foto dari API 3. Default Icon
                    src={previewImage || user?.profile}
                    icon={!(previewImage || user?.profile) && <UserIcon className="w-12 h-12" />}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-wastra-brown-600 p-2 rounded-full">
                    <CameraIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Upload>
              {fileList.length > 0 && <p className="text-orange-600 text-xs mt-2">Pratinjau: Jangan lupa klik simpan</p>}
              {previewImage && (
                <Button 
                  type="primary" 
                  danger 
                  size="small"
                  onClick={() => {
                    setPreviewImage(null);
                    setFileList([]);
                  }}
                  className='bg-black'
                >
                  Batal Ganti Foto
                </Button>
              )}
            </div>

            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input size="large" disabled />
              </Form.Item>
              <Form.Item name="phone" label="Nomor Telepon" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
              <Form.Item name="role" label="Peran">
                <Input size="large" disabled />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={updateProfile.isLoading} className="bg-wastra-brown-600">
                Simpan Perubahan
              </Button>
            </Form>
          </TabPane>

          <TabPane tab="Ubah Password" key="password">
            <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
              <Form.Item name="currentPassword" label="Password Saat Ini" rules={[{ required: true }]}>
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item name="newPassword" label="Password Baru" rules={[{ required: true, min: 8 }]}>
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item 
                name="confirmPassword" 
                label="Konfirmasi Password" 
                dependencies={['newPassword']}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                      return Promise.reject(new Error('Password tidak cocok'))
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={updatePassword.isLoading} className="bg-wastra-brown-600">
                Update Password
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default UserProfile