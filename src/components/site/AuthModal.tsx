import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

type Props = { onClose: () => void };

export function AuthModal({ onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const err = mode === "in"
      ? await signIn(email, password)
      : await signUp(username, email, password);
    setLoading(false);
    if (err) setError(err);
    else onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-sm glass-strong rounded-3xl p-8 shadow-luxe"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 grid place-items-center size-8 rounded-full hover:bg-white/10 transition">
          <X className="size-4 text-cream" />
        </button>

        <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
          {mode === "in" ? "Welcome back" : "Create account"}
        </div>
        <h2 className="font-display text-3xl text-cream mb-7">
          {mode === "in" ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={submit} className="space-y-4">
          {mode === "up" && (
            <Field label="Username" type="text" value={username}
              onChange={setUsername} placeholder="your_name" required />
          )}
          <Field label="Email" type="email" value={email}
            onChange={setEmail} placeholder="you@email.com" required />
          <div className="relative">
            <Field label="Password" type={showPw ? "text" : "password"} value={password}
              onChange={setPassword} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPw(s => !s)}
              className="absolute right-4 top-9 text-cream/50 hover:text-cream transition">
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold text-ink rounded-full py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-cream transition mt-2 disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "in" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-cream/50 text-sm">
          {mode === "in" ? "No account?" : "Already have one?"}{" "}
          <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(""); }}
            className="text-gold hover:underline">
            {mode === "in" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/60 mb-2">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition"
      />
    </div>
  );
}
