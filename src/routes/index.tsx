import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Collections } from "@/components/site/Collections";
import { Story } from "@/components/site/Story";
import { Materials } from "@/components/site/Materials";
import { Products } from "@/components/site/Products";
import { Testimonials } from "@/components/site/Testimonials";
import { Footer } from "@/components/site/Footer";
import { Chatbot } from "@/components/site/Chatbot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAISON LUXE — Redefine Your Fabric" },
      { name: "description", content: "Heritage textiles for the modern wardrobe." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background text-foreground">
      <Nav />
      <Hero />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <Collections />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <Story />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <Materials />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <Products />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <Testimonials />
      <Footer />
      <Chatbot />
    </main>
  );
}
