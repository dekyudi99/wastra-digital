import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, Button, Space, Spin, Tag, message, Modal } from "antd"
import adminApi from "../api/AdminApi"

const AdminActiveArtisanList = () => {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  // 1. Fetching Data
  const { data, isLoading } = useQuery({
    queryKey: ["active-artisans", page],
    queryFn: () => adminApi.activeArtisanList(page),
    // keepPreviousData sudah diganti menjadi placeholderData di TanStack v5, 
    // namun jika Anda masih di v4, keepPreviousData tetap bisa digunakan.
  })

  // 2. Mutation untuk Mengaktifkan (Confirm)
  const confirmMutation = useMutation({
    mutationFn: (id) => adminApi.confirm(id),
    onSuccess: () => {
      message.success("Status pengrajin berhasil diaktifkan!")
      queryClient.invalidateQueries(["active-artisans"])
    },
    onError: () => message.error("Gagal mengaktifkan pengrajin"),
  })

  // 3. Mutation untuk Menonaktifkan (Deactivate/Reject)
  const rejectMutation = useMutation({
    mutationFn: (id) => adminApi.deactive(id),
    onSuccess: () => {
      message.success("Status pengrajin berhasil dinonaktifkan!")
      queryClient.invalidateQueries(["active-artisans"])
    },
    onError: () => message.error("Gagal menonaktifkan pengrajin"),
  })

  const paginationData = data?.data?.data
  const rows = paginationData?.data || []

  const columns = [
    {
      title: "No",
      key: "no",
      width: 60,
      render: (_, __, index) =>
        (paginationData?.current_page - 1) * paginationData?.per_page + index + 1,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Alamat",
      dataIndex: "address",
      key: "address",
      render: (val) => val || "-",
    },
    {
      title: "KTP",
      key: "ktp",
      render: (_, record) =>
        record.ktp_url ? (
          <a
            href={record.ktp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Lihat KTP
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "orange";
        let text = "Menunggu";
        if (status === 'approved') { color = "green"; text = "Aktif"; }
        if (status === 'rejected') { color = "red"; text = "Nonaktif"; }
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status !== 'approved' ? (
            <Button
              type="primary"
              className="bg-green-600 border-none"
              loading={confirmMutation.isPending}
              onClick={() =>
                Modal.confirm({
                  title: "Aktifkan Pengrajin",
                  content: `Apakah Anda yakin ingin mengaktifkan ${record.name}?`,
                  okText: "Ya, Aktifkan",
                  onOk: () => confirmMutation.mutate(record.id),
                })
              }
            >
              Aktifkan
            </Button>
          ) : (
            <Button
              type="primary"
              danger
              loading={rejectMutation.isPending}
              onClick={() =>
                Modal.confirm({
                  title: "Nonaktifkan Pengrajin",
                  content: `Apakah Anda yakin ingin menonaktifkan ${record.name}?`,
                  okText: "Ya, Nonaktifkan",
                  okType: "danger",
                  cancelText: "Batal",
                  onOk: () => rejectMutation.mutate(record.id),
                })
              }
            >
              Nonaktifkan
            </Button>
          )}
        </Space>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Memuat data..." />
      </div>
    )
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manajemen Status Pengrajin
        </h1>
        <Tag color="blue">Total: {paginationData?.total || 0} Pengrajin</Tag>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <Table
          columns={columns}
          dataSource={rows}
          rowKey="id"
          className="overflow-x-auto"
          pagination={{
            current: paginationData?.current_page,
            pageSize: paginationData?.per_page,
            total: paginationData?.total,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            position: ['bottomCenter']
          }}
        />
      </div>
    </div>
  )
}

export default AdminActiveArtisanList