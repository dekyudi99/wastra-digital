import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'wastra.cart'

// Helper functions untuk localStorage
const getCartFromStorage = () => {
  try {
    const item = localStorage.getItem(STORAGE_KEY)
    return item ? JSON.parse(item) : []
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return []
  }
}

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load from localStorage on init, fallback to empty array
    const savedCart = getCartFromStorage()
    // If no saved cart, use default mock data for demo
    return savedCart.length > 0 ? savedCart : [
      {
        id: 1,
        name: 'Kain Endek Sidemen Motif Geometris',
        price: 350000,
        quantity: 2,
        image: '/product-1.jpg',
        thumbnail: 'https://via.placeholder.com/120x120?text=Endek',
        selected: false,
        seller: 'Ibu Made Sari'
      },
      {
        id: 2,
        name: 'Kain Songket Emas Klasik',
        price: 850000,
        quantity: 1,
        image: '/product-2.jpg',
        thumbnail: 'https://via.placeholder.com/120x120?text=Songket',
        selected: false,
        seller: 'Pelangi Weaving'
      },
      {
        id: 3,
        name: 'Kain Endek Modern Pattern',
        price: 420000,
        quantity: 3,
        image: '/product-3.jpg',
        thumbnail: 'https://via.placeholder.com/120x120?text=Endek+Modern',
        selected: false,
        seller: 'Ibu Wayan Sari'
      },
    ]
  })

  // Sync cart to localStorage whenever cartItems changes
  useEffect(() => {
    saveCartToStorage(cartItems)
  }, [cartItems])

  const toggleSelect = (id) => {
    setCartItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }
    setCartItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const getSelectedItems = () => {
    return cartItems.filter(item => item.selected)
  }

  const removeSelectedItems = () => {
    setCartItems(prevItems => prevItems.filter(item => !item.selected))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      toggleSelect, 
      updateQuantity, 
      removeItem,
      getSelectedItems,
      removeSelectedItems,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

