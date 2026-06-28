import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Package } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type Props = { onClose: () => void };

type Step = "form" | "loading" | "success";

export function CheckoutModal({ onClose }: Props) {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    name: user?.username ?? "",
    email: user?.email ?? "",
    address: "",
    city: "",
    postal: "",
    country: "",
  });
  const [error, setError] = useState("");

  function set(k: keyof typeof form, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setStep("loading");
    try {
      const { error: dbErr } = await supabase.from("orders").insert({
        user_id: user?.id ?? null,
        customer_name: form.name,
        customer_email: form.email,
        address: form.address,
        city: form.city,
        postal_code: form.postal,
        country: form.country,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total,
        status: "pending",
      });
      if (dbErr) throw new Error(dbErr.message);
      clear();
      setStep("success");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setStep("form");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-lg glass-strong rounded-3xl p-8 shadow-luxe my-8"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-5 right-5 grid place-items-center size-8 rounded-full hover:bg-white/10 transition">
          <X className="size-4 text-cream" />
        </button>

        <AnimatePresence mode="wait">
          {step === "success" ? (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-8 gap-5"
            >
              <div className="grid place-items-center size-20 rounded-full bg-gold/20">
                <CheckCircle2 className="size-10 text-gold" />
              </div>
              <h2 className="font-display text-4xl text-cream">Order Placed!</h2>
              <p className="text-cream/60 max-w-xs text-sm leading-relaxed">
                Thank you for your order. We'll send a confirmation to <span className="text-gold">{form.email}</span> shortly.
              </p>
              <div className="glass rounded-2xl p-4 flex items-center gap-3 mt-2">
                <Package className="size-5 text-gold flex-shrink-0" />
                <span className="text-cream/70 text-sm">Your items will be carefully packed and shipped within 3–5 business days.</span>
              </div>
              <button onClick={onClose}
                className="mt-4 bg-gold text-ink rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-cream transition">
                Continue Shopping
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2">Checkout</div>
              <h2 className="font-display text-3xl text-cream mb-1">Shipment Details</h2>
              <p className="text-cream/50 text-sm mb-7">Fill in where to send your order</p>

              {/* Order summary */}
              <div className="glass rounded-2xl p-4 mb-6 space-y-1.5 max-h-36 overflow-y-auto">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-cream/70 truncate mr-4">{i.name} ×{i.qty}</span>
                    <span className="text-gold font-display flex-shrink-0">${(i.price * i.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-cream/50">Total</span>
                  <span className="font-display text-lg text-gradient-gold">${total.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name" value={form.name} onChange={v => set("name", v)} placeholder="Jane Doe" required colSpan="2" />
                  <Field label="Email" type="email" value={form.email} onChange={v => set("email", v)} placeholder="jane@email.com" required colSpan="2" />
                  <Field label="Street Address" value={form.address} onChange={v => set("address", v)} placeholder="123 Atelier Lane" required colSpan="2" />
                  <Field label="City" value={form.city} onChange={v => set("city", v)} placeholder="Milano" required />
                  <Field label="Postal Code" value={form.postal} onChange={v => set("postal", v)} placeholder="20121" required />
                  <Field label="Country" value={form.country} onChange={v => set("country", v)} placeholder="Italy" required colSpan="2" />
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button type="submit" disabled={step === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-ink rounded-full py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-cream transition disabled:opacity-60">
                  {step === "loading" && <Loader2 className="size-4 animate-spin" />}
                  Place Order
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, required, colSpan }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder: string; required?: boolean; colSpan?: string;
}) {
  return (
    <div className={colSpan === "2" ? "col-span-2" : ""}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/60 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition" />
    </div>
  );
}
