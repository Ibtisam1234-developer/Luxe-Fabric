export type Product = {
  id: string;
  name: string;
  price: number;
  fabric: "Silk" | "Cotton" | "Linen" | "Wool" | "Cashmere";
  category: "Women" | "Men";
  color: string;
  image: string;
  alt: string;
};

// Unsplash editorial fashion imagery
export const products: Product[] = [
  { id: "p1", name: "Aurelia Silk Slip Dress", price: 420, fabric: "Silk", category: "Women", color: "Ivory",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    alt: "Model wearing ivory silk slip dress in editorial pose" },
  { id: "p2", name: "Heritage Wool Overcoat", price: 450, fabric: "Wool", category: "Men", color: "Charcoal",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
    alt: "Man wearing charcoal wool overcoat against neutral backdrop" },
  { id: "p3", name: "Linen Atelier Shirt", price: 189, fabric: "Linen", category: "Women", color: "Sand",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=900&q=80",
    alt: "Sand colored linen atelier shirt on minimal background" },
  { id: "p4", name: "Cashmere Crew Knit", price: 380, fabric: "Cashmere", category: "Men", color: "Camel",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
    alt: "Camel cashmere crew neck knit detail" },
  { id: "p5", name: "Cotton Pleated Trouser", price: 220, fabric: "Cotton", category: "Women", color: "Cream",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    alt: "Cream cotton pleated trousers styled with knit" },
  { id: "p6", name: "Avant Linen Blazer", price: 340, fabric: "Linen", category: "Men", color: "Stone",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    alt: "Stone linen blazer portrait" },
  { id: "p7", name: "Silk Scarf Maxi", price: 189, fabric: "Silk", category: "Women", color: "Gold",
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=900&q=80",
    alt: "Gold silk maxi scarf draped" },
  { id: "p8", name: "Wool Tailored Suit", price: 450, fabric: "Wool", category: "Men", color: "Midnight",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80",
    alt: "Midnight wool tailored suit" },
  { id: "p9", name: "Cashmere Wrap Cardigan", price: 410, fabric: "Cashmere", category: "Women", color: "Oat",
    image: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=900&q=80",
    alt: "Oat cashmere wrap cardigan editorial" },
  { id: "p10", name: "Cotton Oxford Shirt", price: 145, fabric: "Cotton", category: "Men", color: "White",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    alt: "White cotton oxford shirt close up" },
  { id: "p11", name: "Linen Wide Leg Pant", price: 198, fabric: "Linen", category: "Women", color: "Clay",
    image: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=900&q=80",
    alt: "Clay linen wide leg pant on model" },
  { id: "p12", name: "Heritage Tweed Jacket", price: 399, fabric: "Wool", category: "Men", color: "Olive",
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    alt: "Olive heritage tweed jacket" },
];

export const collections = [
  { name: "Summer Luxe", tag: "SS26", price: 320,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80" },
  { name: "Urban Edge", tag: "Capsule", price: 280,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80" },
  { name: "Heritage Craft", tag: "Archive", price: 410,
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80" },
  { name: "Avant-Garde", tag: "Couture", price: 520,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80" },
];
