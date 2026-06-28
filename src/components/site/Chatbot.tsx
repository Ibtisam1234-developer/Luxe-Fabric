import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ShoppingBag, Loader2, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: typeof products;
};

const SYSTEM_PROMPT = `You are Luxe, a sophisticated AI style assistant for MAISON LUXE — a luxury textile and clothing brand. 
You help customers discover and purchase clothing from our collection.

Our products are:
${products.map(p => `- ${p.name} (ID: ${p.id}): ${p.fabric}, ${p.color}, $${p.price}, Category: ${p.category}`).join("\n")}

Your role:
1. Recommend products based on customer needs (season, occasion, budget, style preference)
2. When a customer wants to add an item, respond with EXACTLY this JSON at the END of your message (after your text):
   [ADD_TO_CART:{"id":"product_id"}]
3. You can add multiple items: [ADD_TO_CART:{"id":"p1"}][ADD_TO_CART:{"id":"p2"}]
4. Be warm, elegant, and concise. Speak like a luxury fashion consultant.
5. Keep responses under 120 words unless describing multiple products.
6. When recommending products, mention their name, fabric, and price naturally.
7. If asked about something outside fashion/our products, gently redirect to shopping.`;

const GEMINI_KEY = "AIzaSyC1HfaOvAd1u_3wT4SO1t-PA0wDvOahFrc";

async function callGemini(history: Message[], userText: string, attempt = 0): Promise<string> {
  const contents = [
    ...history.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: userText }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
      }),
    }
  );

  // Rate limited — wait and retry up to 3 times
  if (res.status === 429) {
    if (attempt >= 3) return "I'm receiving too many requests right now. Please wait a moment and try again.";
    const wait = (attempt + 1) * 5000; // 5s, 10s, 15s
    await new Promise(r => setTimeout(r, wait));
    return callGemini(history, userText, attempt + 1);
  }

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't process that.";
}

function parseAddToCart(text: string) {
  const regex = /\[ADD_TO_CART:\{"id":"([^"]+)"\}\]/g;
  const ids: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) ids.push(match[1]);
  return ids;
}

function cleanText(text: string) {
  return text.replace(/\[ADD_TO_CART:\{"id":"[^"]+"\}\]/g, "").trim();
}

function ProductCard({ product, onAdd }: { product: typeof products[0]; onAdd: () => void }) {
  return (
    <div className="flex items-center gap-3 glass rounded-xl p-3 mt-2">
      <img src={product.image} alt={product.name} className="w-14 h-16 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-cream text-sm font-display truncate">{product.name}</p>
        <p className="text-[10px] uppercase tracking-[0.15em] text-cream/50">{product.fabric}</p>
        <p className="text-gold font-display">${product.price}</p>
      </div>
      <button onClick={onAdd}
        className="flex-shrink-0 grid place-items-center size-8 rounded-full bg-gold text-ink hover:bg-cream transition">
        <ShoppingBag className="size-3.5" />
      </button>
    </div>
  );
}

export function Chatbot() {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Welcome to MAISON LUXE. I'm Luxe, your personal style consultant. What are you looking for today — a special occasion, a wardrobe staple, or perhaps something in a particular fabric?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function handleAdd(productId: string) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    add(product);
    setAddedIds(prev => new Set([...prev, productId]));
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const raw = await callGemini(messages, text);
      const cartIds = parseAddToCart(raw);
      const clean = cleanText(raw);

      // Auto-add items Gemini decided to add
      const addedProducts = cartIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) as typeof products;

      cartIds.forEach(id => handleAdd(id));

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: clean,
        products: addedProducts.length > 0 ? addedProducts : undefined,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "I apologise, I'm having a moment. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(s => !s)}
        className="fixed bottom-6 right-6 z-[80] flex items-center gap-2.5 bg-gold text-ink rounded-full shadow-gold px-5 py-3.5 font-medium text-sm hover:bg-cream transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="size-4" />
              </motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle className="size-4" />
              </motion.span>
          }
        </AnimatePresence>
        <span className="hidden sm:inline">{open ? "Close" : "Style Assistant"}</span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-[80] w-[360px] max-w-[calc(100vw-2rem)] h-[520px] flex flex-col glass-strong rounded-3xl shadow-luxe overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-ink to-ink/80">
              <div className="grid place-items-center size-9 rounded-full bg-gold/20">
                <Sparkles className="size-4 text-gold" />
              </div>
              <div>
                <p className="text-cream font-display text-base">Luxe</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-cream/50">Style Consultant · AI</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-cream/50">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.role === "user"
                    ? "bg-gold text-ink rounded-2xl rounded-br-sm px-4 py-2.5 text-sm"
                    : "glass rounded-2xl rounded-bl-sm px-4 py-2.5 text-cream/90 text-sm leading-relaxed"
                  }`}>
                    {msg.text}
                    {/* Product cards shown when Gemini adds items */}
                    {msg.products?.map(p => (
                      <ProductCard key={p.id} product={p}
                        onAdd={() => handleAdd(p.id)} />
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="size-3.5 text-gold animate-spin" />
                    <span className="text-cream/60 text-xs">Luxe is thinking…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {["I need something for winter", "Show me silk options", "Under $200 please"].map(q => (
                  <button key={q} onClick={() => { setInput(q); }}
                    className="glass rounded-full px-3 py-1.5 text-[11px] text-cream/70 hover:text-gold transition">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask Luxe anything…"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/50 transition"
              />
              <button onClick={send} disabled={!input.trim() || loading}
                className="grid place-items-center size-10 rounded-full bg-gold text-ink hover:bg-cream transition disabled:opacity-40 flex-shrink-0">
                <Send className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
