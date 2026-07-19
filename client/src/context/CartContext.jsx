import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

/**
 * Reducer handles all cart state transitions.
 * State shape: { items: [{ _id, name, price, image, qty }] }
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id
              ? { ...i, qty: i.qty + 1 }
              : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

/** Load persisted cart from localStorage or fall back to empty */
const loadInitialState = () => {
  try {
    const saved = localStorage.getItem('quikart_cart');
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('quikart_cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems: state.items,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
