"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useApp();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in dollars
  const [couponError, setCouponError] = useState("");

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const hasDiscount = !!item.product.discount;
    const finalPrice = hasDiscount
      ? item.product.price - (item.product.price * (item.product.discount || 0)) / 100
      : item.product.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const total = Math.max(0, subtotal + shipping - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "AURAPET10") {
      setAppliedDiscount(subtotal * 0.1);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-primary z-50 cursor-pointer"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border-brand"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-brand flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-sans font-bold text-lg text-primary">Your Cart</h3>
            <span className="bg-background text-primary text-xs font-semibold px-2 py-0.5 rounded-full border border-border-brand">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-background flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-secondary/60" />
              </div>
              <h4 className="font-bold text-primary mb-2">Cart is empty</h4>
              <p className="text-sm text-secondary max-w-xs mb-6">
                Explore our catalog of premium lifestyle pet products.
              </p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-accent transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const hasDiscount = !!item.product.discount;
              const finalPrice = hasDiscount
                ? item.product.price - (item.product.price * (item.product.discount || 0)) / 100
                : item.product.price;
              
              return (
                <div key={item.product.id} className="flex gap-4 pb-6 border-b border-border-brand">
                  <div className="relative w-20 h-20 bg-background rounded-xl overflow-hidden border border-border-brand shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <Link
                        href={`/product/${item.product.id}`}
                        onClick={() => setCartOpen(false)}
                        className="font-sans font-semibold text-sm text-primary hover:text-secondary line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-secondary hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-accent font-semibold tracking-wide uppercase mb-2 block">
                      {item.product.category}
                    </span>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border-brand rounded-full px-1.5 py-0.5 bg-background scale-90 origin-left">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:text-primary cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:text-primary cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary block">
                          ₹{(finalPrice * item.quantity).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-secondary line-through">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="border-t border-border-brand bg-background/50 p-6 space-y-4">
            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (AURAPET10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 text-xs border border-border-brand rounded-full px-4 py-2 bg-white outline-none focus:border-primary text-primary font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {appliedDiscount > 0 && (
              <span className="text-[10px] text-accent font-semibold block">
                Coupon applied successfully: 10% Discount!
              </span>
            )}
            {couponError && (
              <span className="text-[10px] text-red-500 font-semibold block">
                {couponError}
              </span>
            )}

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-accent font-medium">
                  <span>Discount</span>
                  <span>-₹{appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary border-t border-border-brand pt-2">
                <span>Estimated Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-accent text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-center block"
            >
              Checkout Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
