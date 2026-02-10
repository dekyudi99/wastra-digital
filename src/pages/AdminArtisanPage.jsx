import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, Button, Space, Spin, Tag, message } from "antd"
import adminApi from "../api/AdminApi"

const AdminArtisanPage = () => {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["artisan-registrations", page],
    queryFn: () => adminApi.listPendaftaran(page),
    keepPreviousData: true,
  })

  const confirmMutation = useMutation({
    mutationFn: (id) => adminApi.confirm(id),
    onSuccess: () => {
      message.success("Pengrajin berhasil dikonfirmasi")
      queryClient.invalidateQueries(["artisan-registrations"])
    },
    onError: () => {
      message.error("Gagal mengkonfirmasi pengrajin")
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    )
  }

  const paginationData = data?.data?.data
  const rows = paginationData?.data || []

  const columns = [
    {
      title: "No",
      render: (_, __, index) =>
        (paginationData.current_page - 1) * paginationData.per_page +
        index +
        1,
    },
    {
      title: "Nama",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Alamat",
      dataIndex: "address",
      render: (val) => val || "-",
    },
    {
      title: "KTP",
      render: (_, record) =>
        record.ktp_url ? (
          <a
            href={record.ktp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Lihat KTP
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Status",
      render: (_, record) =>
        record.isArtisan ? (
          <Tag color="green">Terkonfirmasi</Tag>
        ) : (
          <Tag color="orange">Menunggu</Tag>
        ),
    },
    {
      title: "Aksi",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            disabled={record.isArtisan}
            loading={confirmMutation.isLoading}
            onClick={() => confirmMutation.mutate(record.id)}
          >
            Konfirmasi
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Daftar Pendaftaran Pengrajin
      </h1>

      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        bordered
        pagination={{
          current: paginationData.current_page,
          pageSize: paginationData.per_page,
          total: paginationData.total,
          onChange: (page) => setPage(page),
        }}
      />
    </div>
  )
}

export default AdminArtisanPage