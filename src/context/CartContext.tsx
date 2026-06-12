import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../lib/products';

export interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const hydrateCartItems = (): CartItemType[] => {
  const saved = localStorage.getItem('mishfa_cart');

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as CartItemType[];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>(hydrateCartItems);

  useEffect(() => {
    const syncCartProducts = async () => {
      if (items.length === 0) {
        return;
      }

      try {
        const currentProducts = await fetchProducts({
          activeOnly: true,
          ids: items.map((item) => item.product.id),
        });

        const productsById = Object.fromEntries(
          currentProducts.map((product) => [product.id, product])
        );

        setItems((prevItems) => {
          const nextItems = prevItems
            .map((item) => {
              const currentProduct = productsById[item.product.id];

              if (!currentProduct) {
                return null;
              }

              return {
                ...item,
                product: currentProduct,
              };
            })
            .filter((item): item is CartItemType => Boolean(item));

          const hasChanged =
            nextItems.length !== prevItems.length ||
            nextItems.some((item, index) => item.product !== prevItems[index]?.product);

          return hasChanged ? nextItems : prevItems;
        });
      } catch (error) {
        console.error('Failed to sync cart products:', error);
      }
    };

    void syncCartProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('mishfa_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
