"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Product } from "@/lib/types";
import { X, Star, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useApp();
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Sync selected image when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      
      // Lock background scroll when modal opens
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      // Re-enable scroll when unmounting or closing
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  
  const hasDiscount = !!product.discount;
  const finalPrice = hasDiscount
    ? product.price - (product.price * (product.discount || 0)) / 100
    : product.price;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-primary/45 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-premium border border-border-brand max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white/50 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 pt-0">
            {/* Gallery Column */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-background border border-border-brand">
                <Image
                  src={selectedImage || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden bg-background border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImage === img ? "border-primary" : "border-border-brand hover:border-secondary"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumb ${i}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="flex flex-col">
              {/* Category and Rating */}
              <div className="flex items-center justify-between text-xs text-secondary mb-3">
                <span className="font-medium tracking-wider uppercase text-accent">{product.category}</span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 text-orange-soft">
                    <Star className="w-4 h-4 fill-orange-soft" />
                  </div>
                  <span className="font-semibold text-primary">{product.rating}</span>
                  <span className="text-secondary/70">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-sans font-bold text-2xl text-primary mb-3 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-bold text-primary">
                  ₹{finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-secondary line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-secondary leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="bg-background rounded-2xl p-4 mb-6 border border-border-brand">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2.5">
                  Product Details
                </span>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-secondary font-light">{key}</span>
                      <span className="text-primary font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center border border-border-brand rounded-full px-2 py-1 bg-background shrink-0">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-primary select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Add to Cart */}
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                  className={`flex-1 w-full py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? "bg-border-brand text-secondary cursor-not-allowed"
                      : "bg-primary text-white hover:bg-accent shadow-sm"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? "Sold Out" : `Add to Cart • ₹${(finalPrice * quantity).toFixed(2)}`}
                </button>
              </div>

              {/* Extra Details */}
              <div className="mt-6 flex justify-between items-center text-xs text-secondary/80">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent" /> Free shipping on orders over ₹50
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="font-semibold text-primary hover:text-secondary underline transition-all cursor-pointer"
                >
                  {isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
