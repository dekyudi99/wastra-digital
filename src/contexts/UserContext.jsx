import { createContext, useContext, useState, useEffect } from 'react'
import { AUTH_STORAGE_KEYS, USER_ROLES } from '../utils/authRoles'

const UserContext = createContext()

// Storage keys
const STORAGE_KEYS = {
  USER: 'wastra.user',
  ORDERS: 'wastra.orders',
  ADDRESSES: 'wastra.addresses',
  WISHLIST: 'wastra.wishlist',
}

// Helper functions untuk localStorage
const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export const UserProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    const savedUser = getFromStorage(STORAGE_KEYS.USER)
    if (savedUser) {
      // Set role juga di localStorage untuk kompatibilitas
      localStorage.setItem(AUTH_STORAGE_KEYS.ROLE, savedUser.role)
    }
    return savedUser
  })

  // Orders state
  const [orders, setOrders] = useState(() => getFromStorage(STORAGE_KEYS.ORDERS, []))

  // Addresses state
  const [addresses, setAddresses] = useState(() => getFromStorage(STORAGE_KEYS.ADDRESSES, []))

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => getFromStorage(STORAGE_KEYS.WISHLIST, []))

  // Sync dengan localStorage setiap kali state berubah
  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEYS.USER, user)
      localStorage.setItem(AUTH_STORAGE_KEYS.ROLE, user.role)
    }
  }, [user])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ORDERS, orders)
  }, [orders])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ADDRESSES, addresses)
  }, [addresses])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WISHLIST, wishlist)
  }, [wishlist])

  // Auth functions
  const login = (userData) => {
    const userWithDefaults = {
      ...userData,
      id: userData.id || Date.now(),
      createdAt: userData.createdAt || new Date().toISOString(),
      avatar: userData.avatar || null,
    }
    setUser(userWithDefaults)
    return userWithDefaults
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(AUTH_STORAGE_KEYS.ROLE)
  }

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateAvatar = (avatarUrl) => {
    setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null)
  }

  // Order functions
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: orderData.id || `WD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      createdAt: orderData.createdAt || new Date().toISOString(),
      status: orderData.status || 'pending', // Gunakan status dari orderData jika ada, default pending
      trackingNumber: orderData.trackingNumber || null,
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const updateOrderStatus = (orderId, status, trackingNumber = null) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status, 
              trackingNumber, 
              updatedAt: new Date().toISOString(),
              cancelledAt: status === 'cancelled' ? new Date().toISOString() : order.cancelledAt
            }
          : order
      )
    )
  }

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  // Address functions
  const addAddress = (addressData) => {
    let newAddress
    setAddresses(prev => {
      newAddress = {
        ...addressData,
        id: Date.now(),
        isDefault: prev.length === 0, // First address is default
        createdAt: new Date().toISOString(),
      }
      return [...prev, newAddress]
    })
    return newAddress
  }

  const updateAddress = (addressId, updates) => {
    setAddresses(prev =>
      prev.map(addr =>
        addr.id === addressId ? { ...addr, ...updates, updatedAt: new Date().toISOString() } : addr
      )
    )
  }

  const deleteAddress = (addressId) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId))
  }

  const setDefaultAddress = (addressId) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    )
  }

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault) || addresses[0] || null
  }

  // Wishlist functions
  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist(prev => [...prev, { ...product, addedAt: new Date().toISOString() }])
      return true
    }
    return false
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      return false
    } else {
      addToWishlist(product)
      return true
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Check user role
  const hasRole = (role) => {
    return user?.role === role
  }

  const value = {
    // User
    user,
    isAuthenticated,
    hasRole,
    login,
    logout,
    updateUser,
    updateAvatar,

    // Orders
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById,

    // Addresses
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,

    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

