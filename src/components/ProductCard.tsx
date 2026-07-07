"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Product } from "@/lib/types";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const [hovered, setHovered] = useState(false);

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 8;

  // Calculate discount price if discount exists
  const hasDiscount = !!product.discount;
  const finalPrice = hasDiscount
    ? product.price - (product.price * (product.discount || 0)) / 100
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col w-full bg-white rounded-2xl border border-border-brand overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges and Wishlist */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <div className="flex flex-col gap-1.5 items-start">
          {product.isNew && (
            <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-primary rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-orange-soft rounded-full uppercase tracking-wider">
              -{product.discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-red-500 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2.5 py-1 text-[9px] font-bold text-primary bg-amber-100 rounded-full uppercase tracking-wider border border-amber-200">
              Only {product.stock} Left
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-border-brand flex items-center justify-center text-secondary hover:text-red-500 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full bg-background overflow-hidden block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={product.isFeatured}
        />
        
        {/* Quick View Button overlay (Desktop) */}
        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-4 py-2.5 rounded-full bg-white text-primary text-xs font-semibold shadow-lg border border-border-brand flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating and category */}
        <div className="flex items-center justify-between text-xs text-secondary mb-1">
          <span className="font-light tracking-wide">{product.category}</span>
          <div className="flex items-center gap-0.5 text-orange-soft">
            <Star className="w-3 h-3 fill-orange-soft" />
            <span className="font-medium text-primary ml-0.5">{product.rating}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="font-sans font-semibold text-sm text-primary hover:text-secondary mb-2 line-clamp-1 block transition-colors">
          {product.name}
        </Link>

        {/* Description Snippet */}
        <p className="text-xs text-secondary/80 font-light mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Pricing and CTA */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-brand">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary">
              ₹{finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-secondary line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? "bg-border-brand text-secondary cursor-not-allowed"
                : "bg-primary text-white hover:bg-accent active:scale-95 shadow-sm"
            }`}
            title={isOutOfStock ? "Sold Out" : "Add to Cart"}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
