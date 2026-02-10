// Data bank account untuk setiap seller/pengrajin
// Setiap seller bisa punya beberapa bank account yang bisa dipilih buyer

export const sellerBankAccounts = {
  'Ibu Made Sari': {
    sellerName: 'Ibu Made Sari',
    banks: [
      {
        id: 'bca',
        name: 'Bank BCA',
        accountNumber: '1234567890',
        accountName: 'Ibu Made Sari',
        logo: '🏦',
        vaPrefix: '81012',
        instructions: [
          'Transfer melalui ATM BCA',
          'Transfer melalui m-BCA',
          'Transfer melalui BCA Mobile',
          'Transfer melalui Internet Banking BCA'
        ]
      },
      {
        id: 'mandiri',
        name: 'Bank Mandiri',
        accountNumber: '0987654321',
        accountName: 'Ibu Made Sari',
        logo: '🏦',
        vaPrefix: '88888',
        instructions: [
          'Transfer melalui ATM Mandiri',
          'Transfer melalui Livin\' by Mandiri',
          'Transfer melalui Mandiri Online'
        ]
      }
    ]
  },
  'Pelangi Weaving': {
    sellerName: 'Pelangi Weaving',
    banks: [
      {
        id: 'bni',
        name: 'Bank BNI',
        accountNumber: '1122334455',
        accountName: 'Pelangi Weaving',
        logo: '🏦',
        vaPrefix: '98888',
        instructions: [
          'Transfer melalui ATM BNI',
          'Transfer melalui BNI Mobile Banking',
          'Transfer melalui BNI Internet Banking'
        ]
      },
      {
        id: 'bri',
        name: 'Bank BRI',
        accountNumber: '5544332211',
        accountName: 'Pelangi Weaving',
        logo: '🏦',
        vaPrefix: '88880',
        instructions: [
          'Transfer melalui ATM BRI',
          'Transfer melalui BRImo',
          'Transfer melalui BRI Internet Banking'
        ]
      }
    ]
  },
  'Ibu Wayan Sari': {
    sellerName: 'Ibu Wayan Sari',
    banks: [
      {
        id: 'mandiri',
        name: 'Bank Mandiri',
        accountNumber: '5555555555',
        accountName: 'Ibu Wayan Sari',
        logo: '🏦',
        vaPrefix: '88888',
        instructions: [
          'Transfer melalui ATM Mandiri',
          'Transfer melalui Livin\' by Mandiri',
          'Transfer melalui Mandiri Online'
        ]
      },
      {
        id: 'bca',
        name: 'Bank BCA',
        accountNumber: '9999999999',
        accountName: 'Ibu Wayan Sari',
        logo: '🏦',
        vaPrefix: '81012',
        instructions: [
          'Transfer melalui ATM BCA',
          'Transfer melalui m-BCA',
          'Transfer melalui BCA Mobile',
          'Transfer melalui Internet Banking BCA'
        ]
      }
    ]
  },
  'Ibu Ketut Sari': {
    sellerName: 'Ibu Ketut Sari',
    banks: [
      {
        id: 'bri',
        name: 'Bank BRI',
        accountNumber: '7777777777',
        accountName: 'Ibu Ketut Sari',
        logo: '🏦',
        vaPrefix: '88880',
        instructions: [
          'Transfer melalui ATM BRI',
          'Transfer melalui BRImo',
          'Transfer melalui BRI Internet Banking'
        ]
      }
    ]
  }
}

// Helper function untuk mendapatkan bank accounts dari seller
export const getSellerBanks = (sellerName) => {
  return sellerBankAccounts[sellerName]?.banks || []
}

// Helper function untuk mendapatkan seller info
export const getSellerInfo = (sellerName) => {
  return sellerBankAccounts[sellerName] || null
}

