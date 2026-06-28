import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, User } from "./supabase";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signUp: (username: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) await loadProfile(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) await loadProfile(session.user.id);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(id: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (data) setUser({ id: data.id, username: data.username, email: data.email });
  }

  async function signUp(username: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, username, email });
      setUser({ id: data.user.id, username, email });
    }
    return null;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
