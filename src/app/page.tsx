"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Product } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import CartDrawer from "@/components/CartDrawer";
import { ArrowRight, ChevronRight, Award, Truck, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { products } = useApp();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter products for sections
  const bestSellers = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew || p.id === "prod-5" || p.id === "prod-7").slice(0, 4);

  const categories = [
    { name: "Dogs", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80", count: "12 Products" },
    { name: "Cats", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80", count: "8 Products" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=300&q=80", count: "15 Products" },
    { name: "Treats", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80", count: "5 Products" }
  ];

  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: "Complimentary Delivery",
      desc: "Receive free premium shipping on all orders over $50, packed with care."
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Artisanal Sourcing",
      desc: "Every product in our catalog undergoes rigorous design & health testing."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Global Guarantee",
      desc: "Unhappy with your purchase? We offer a 30-day no-questions return policy."
    }
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "Dog Owner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      quote: "The Aura Smart collar has completely changed how I track my lab's activity. Plus, it looks beautifully premium in our living room compared to cheap plastic collars.",
      rating: 5
    },
    {
      name: "Sophia Loren",
      role: "Persian Cat Parent",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      quote: "My cat immediately adopted the wool felt cave. The texture, the scent, and the minimalist aesthetic are absolutely worth every single penny.",
      rating: 5
    }
  ];

  const instagramPosts = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=350&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=350&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=350&q=80",
    "https://images.unsplash.com/photo-1533733590534-3df2026b91c7?auto=format&fit=crop&w=350&q=80"
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 font-sans">
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center bg-[#E5E5E7] overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80"
              alt="Premium happy pets"
              fill
              priority
              className="object-cover object-center opacity-85 select-none"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA]/95 via-[#FAFAFA]/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16">
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-bold text-secondary uppercase tracking-widest block mb-4"
              >
                A New Standard of Pet Luxury
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-sans font-bold text-5xl md:text-6xl text-primary leading-[1.08] tracking-tight text-balance mb-6"
              >
                Everything Your Pet Loves, Delivered.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-secondary font-light leading-relaxed mb-8 text-balance"
              >
                Premium food, toys, accessories and care products for every furry friend. Inspired by design and engineered for wellness.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/shop"
                  className="px-8 py-3.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-accent active:scale-95 transition-all shadow-md"
                >
                  Shop Now
                </Link>
                <Link
                  href="/shop"
                  className="px-8 py-3.5 rounded-full bg-white/70 backdrop-blur-sm border border-border-brand text-primary text-sm font-semibold hover:bg-white active:scale-95 transition-all"
                >
                  Explore Categories
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="py-20 bg-white border-b border-border-brand px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
                  Curated Catalog
                </span>
                <h2 className="font-bold text-3xl text-primary tracking-tight">
                  Featured Categories
                </h2>
              </div>
              <Link
                href="/shop"
                className="group text-sm font-bold text-primary flex items-center gap-1 hover:text-accent transition-colors"
              >
                View all categories <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  href={`/shop?category=${cat.name}`}
                  className="group relative flex flex-col justify-end h-64 rounded-2xl overflow-hidden bg-background border border-border-brand"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  <div className="relative z-10 p-5 text-white">
                    <h3 className="font-bold text-base mb-1">{cat.name}</h3>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-white/70">
                      {cat.count}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">
                Customer Favorites
              </span>
              <h2 className="font-bold text-3xl text-primary tracking-tight">
                Best Sellers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-20 bg-white border-t border-b border-border-brand px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-5 border border-border-brand">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-base text-primary mb-2.5">{benefit.title}</h3>
                <p className="text-sm text-secondary font-light leading-relaxed max-w-xs">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">
                  Fresh Additions
                </span>
                <h2 className="font-bold text-3xl text-primary tracking-tight">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/shop"
                className="group text-sm font-bold text-primary flex items-center gap-1 hover:text-accent transition-colors"
              >
                Shop New <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="py-20 bg-white border-t border-b border-border-brand px-6">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
              Pet Parent Validation
            </span>
            <h2 className="font-bold text-3xl text-primary tracking-tight mb-16">
              Loved by Pets, Approved by Owners
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-background rounded-3xl p-8 border border-border-brand text-left relative flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex gap-0.5 text-orange-soft mb-5">
                      {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-orange-soft" />
                      ))}
                    </div>
                    <p className="text-primary text-sm font-medium leading-relaxed italic mb-8">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-4.5 border-t border-border-brand pt-5">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border-brand">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary leading-tight">{t.name}</h4>
                      <span className="text-xs text-secondary">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INSTAGRAM GALLERY */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-3">
              Join Our Community
            </span>
            <h2 className="font-bold text-3xl text-primary tracking-tight mb-4">
              #AuraPetMoments
            </h2>
            <p className="text-sm text-secondary font-light mb-12">
              Share your moments with us on social media for a chance to be featured.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {instagramPosts.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border-brand group cursor-pointer">
                  <Image
                    src={src}
                    alt={`Instagram pet ${i}`}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    View Post
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Quick View Modal Container */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
