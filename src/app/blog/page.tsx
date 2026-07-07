"use client";

import { useState } from "react";
import Image from "next/image";
import { blogService } from "@/lib/services/storeService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const blogs = blogService.getBlogs();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Nutrition", "Training", "Health Tips"];

  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="border-b border-border-brand pb-8 mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
              Aura Journal
            </span>
            <h1 className="font-sans font-bold text-4xl text-primary tracking-tight mb-3">
              Pet Care & Lifestyle Column
            </h1>
            <p className="text-sm text-secondary font-light max-w-xl">
              Stay updated with design trends, nutrition guides, training philosophies, and veterinarian-approved articles written for modern pet owners.
            </p>
          </div>

          {/* Categories bar */}
          <div className="flex gap-2.5 mb-10 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "border border-border-brand text-secondary bg-white hover:text-primary hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-border-brand rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full"
              >
                {/* Visual */}
                <div className="relative aspect-video w-full bg-background overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] font-bold text-white bg-primary rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-[10px] text-secondary font-light mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-secondary/70" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-secondary/70" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-primary mb-3 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-secondary font-light leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="border-t border-border-brand pt-4 mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border-brand">
                        <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-primary">{post.author.name}</span>
                    </div>

                    <button
                      onClick={() => alert(`Full article routing is mock-implemented. Under construction for this portfolio template.`)}
                      className="text-[10px] font-bold text-primary hover:text-accent flex items-center gap-1 cursor-pointer"
                    >
                      Read More <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
