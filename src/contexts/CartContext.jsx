import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
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
  ])

  const toggleSelect = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const getSelectedItems = () => {
    return cartItems.filter(item => item.selected)
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      toggleSelect, 
      updateQuantity, 
      removeItem,
      getSelectedItems
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

