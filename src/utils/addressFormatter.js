export const buildShippingAddressString = (address) => {
  if (!address) return ''

  return [
    `Nama: ${address.received_name}`,
    `Telp: ${address.telepon_number}`,
    `Provinsi: ${address.provinsi}`,
    `Kabupaten: ${address.kabupaten}`,
    `Kecamatan: ${address.kecamatan}`,
    `Kode Pos: ${address.kode_pos}`,
    `Alamat: ${address.alamat_detail}`,
  ].join(' | ')
}
