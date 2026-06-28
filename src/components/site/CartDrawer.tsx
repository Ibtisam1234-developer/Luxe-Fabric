import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

type Props = { open: boolean; onClose: () => void; onCheckout: () => void };

export function CartDrawer({ open, onClose, onCheckout }: Props) {
  const { items, remove, update, total, count } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-[95] w-full max-w-md glass-strong shadow-luxe flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="size-5 text-gold" />
                <span className="font-display text-xl text-cream">Your Bag</span>
                <span className="glass rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-cream/70">{count} items</span>
              </div>
              <button onClick={onClose} className="grid place-items-center size-9 rounded-full hover:bg-white/10 transition">
                <X className="size-4 text-cream" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-cream/40">
                  <ShoppingBag className="size-12 opacity-30" />
                  <p className="text-sm uppercase tracking-[0.2em]">Your bag is empty</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 glass rounded-2xl p-4"
                    >
                      <img src={item.image} alt={item.alt}
                        className="w-20 h-24 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-cream font-display text-base truncate">{item.name}</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-cream/50 mt-0.5">{item.fabric} · {item.color}</p>
                        <p className="text-gold font-display text-lg mt-2">${item.price}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 glass rounded-full px-1 py-1">
                            <button onClick={() => update(item.id, item.qty - 1)}
                              className="grid place-items-center size-6 rounded-full hover:bg-white/10 transition">
                              <Minus className="size-3 text-cream" />
                            </button>
                            <span className="text-cream text-sm w-4 text-center">{item.qty}</span>
                            <button onClick={() => update(item.id, item.qty + 1)}
                              className="grid place-items-center size-6 rounded-full hover:bg-white/10 transition">
                              <Plus className="size-3 text-cream" />
                            </button>
                          </div>
                          <button onClick={() => remove(item.id)}
                            className="grid place-items-center size-8 rounded-full hover:bg-red-500/20 text-cream/40 hover:text-red-400 transition">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-cream/60">Total</span>
                  <span className="font-display text-2xl text-gradient-gold">${total.toLocaleString()}</span>
                </div>
                <button onClick={onCheckout}
                  className="w-full bg-gold text-ink rounded-full py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-cream transition">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
