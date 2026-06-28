import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "./products";

export type CartItem = Product & { qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx>(null!);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (p: Product) =>
    setItems(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const update = (id: string, qty: number) =>
    setItems(prev => qty < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty } : i));

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, update, clear, total, count }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
