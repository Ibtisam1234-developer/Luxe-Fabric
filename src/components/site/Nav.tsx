import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, User, X, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { AuthModal } from "./AuthModal";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "Materials", href: "#materials" },
  { label: "Shop", href: "#shop" },
  { label: "Story", href: "#story" },
  { label: "Journal", href: "#testimonials" },
];

export function Nav() {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className={`flex items-center justify-between rounded-full px-5 md:px-7 py-3 transition-all duration-500 ${scrolled ? "glass-strong shadow-luxe" : "glass"}`}>
            <a href="#top" className="font-display text-lg md:text-xl tracking-[0.18em] text-cream">
              MAISON<span className="text-gold">·</span>LUXE
            </a>

            <nav className="hidden md:flex items-center gap-9">
              {links.map(l => (
                <a key={l.href} href={l.href}
                  className="text-sm tracking-[0.12em] uppercase text-cream/80 hover:text-gold transition-colors">
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* User button */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => user ? setShowUserMenu(s => !s) : setShowAuth(true)}
                  className="flex items-center gap-2 glass rounded-full px-3 py-2 hover:bg-white/10 transition"
                >
                  <User className="size-4 text-cream" />
                  {user && (
                    <span className="text-[11px] uppercase tracking-[0.1em] text-cream/80 max-w-[80px] truncate">
                      {user.username}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-12 glass-strong rounded-2xl p-2 min-w-[160px] shadow-luxe"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-cream/50">Signed in as</p>
                        <p className="text-cream text-sm font-display truncate">{user.username}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-cream/70 hover:text-cream hover:bg-white/10 text-sm transition"
                      >
                        <LogOut className="size-3.5" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative grid place-items-center size-10 rounded-full hover:bg-white/5 transition"
              >
                <ShoppingBag className="size-4 text-cream" />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 size-4 grid place-items-center rounded-full bg-gold text-[10px] font-medium text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                className="md:hidden grid place-items-center size-10 rounded-full hover:bg-white/5"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5 text-cream" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex items-center justify-between p-6">
                <span className="font-display tracking-[0.18em] text-cream">MAISON·LUXE</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X className="size-6 text-cream" />
                </button>
              </div>
              <motion.nav
                initial="hidden" animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                className="flex flex-col items-center justify-center gap-8 pt-16"
              >
                {links.map(l => (
                  <motion.a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    className="font-display text-4xl text-cream hover:text-gold transition">
                    {l.label}
                  </motion.a>
                ))}
                <motion.button
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  onClick={() => { setMenuOpen(false); user ? signOut() : setShowAuth(true); }}
                  className="flex items-center gap-2 glass rounded-full px-5 py-3 text-cream text-sm mt-4"
                >
                  <User className="size-4" />
                  {user ? `${user.username} · Sign out` : "Sign in"}
                </motion.button>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Modals */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>

      <CartDrawer
        open={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
      />

      <AnimatePresence>
        {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
      </AnimatePresence>
    </>
  );
}
