"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { siteConfig } from "@/config/site";
import { orderService } from "@/lib/services/storeService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight, ArrowLeft, CreditCard, Shield, Truck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart, addToast, user } = useApp();
  const router = useRouter();

  // Multi-step state: 1: Shipping, 2: Payment, 3: Success
  const [step, setStep] = useState(1);

  // Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    postalCode: "",
    country: "",
    email: "",
    phone: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "•••• •••• •••• 4242",
    expiry: "12/28",
    cvv: "•••",
    cardName: ""
  });

  // Auth Redirect Gate
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

  // Sync shipping info if user is loaded
  useEffect(() => {
    if (user) {
      setShippingForm({
        fullName: user.name,
        addressLine1: user.addresses[0]?.addressLine1 || "",
        city: user.addresses[0]?.city || "",
        postalCode: user.addresses[0]?.postalCode || "",
        country: user.addresses[0]?.country || "",
        email: user.email,
        phone: user.phone
      });
      setPaymentForm(prev => ({
        ...prev,
        cardName: user.name
      }));
    }
  }, [user]);

  const [orderNumber, setOrderNumber] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-secondary font-light animate-pulse">Redirecting to login...</span>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => {
    const hasDiscount = !!item.product.discount;
    const finalPrice = hasDiscount
      ? item.product.price - (item.product.price * (item.product.discount || 0)) / 100
      : item.product.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  const shipping = subtotal >= siteConfig.commerce.freeShippingThreshold || subtotal === 0 ? 0 : siteConfig.commerce.defaultShippingCost;
  const total = subtotal + shipping;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    try {
      const order = orderService.createOrder({
        items: cart,
        subtotal,
        shipping,
        discount: 0,
        total,
        shippingAddress: {
          fullName: shippingForm.fullName,
          addressLine1: shippingForm.addressLine1,
          city: shippingForm.city,
          postalCode: shippingForm.postalCode,
          country: shippingForm.country
        }
      });
      setOrderNumber(order.id);
      setStep(3);
      clearCart();
      addToast("Order placed successfully!", "success");
    } catch {
      addToast("Failed to place order. Check stock levels.", "error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-background pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center max-w-lg mx-auto mb-12">
            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
              { num: 3, label: "Confirmation" }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.num
                        ? "bg-primary text-white"
                        : "bg-white border border-border-brand text-secondary"
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 ${
                    step >= s.num ? "text-primary" : "text-secondary"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 transition-all ${
                      step > s.num ? "bg-primary" : "bg-border-brand"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 3 ? (
            /* SUCCESS VIEW */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md mx-auto bg-white border border-border-brand rounded-3xl p-10 text-center shadow-premium"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6 text-accent">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="font-sans font-bold text-2xl text-primary mb-3">
                Thank You for Your Order
              </h2>
              <p className="text-sm text-secondary font-light mb-6">
                Your order <strong className="text-primary font-semibold">#{orderNumber}</strong> has been successfully registered. We will email tracking details as soon as the shipping carrier dispatches the parcel.
              </p>
              <div className="bg-background rounded-2xl p-4 mb-8 text-xs text-left border border-border-brand space-y-2.5">
                <div className="flex justify-between text-secondary">
                  <span>Ship To</span>
                  <span className="font-medium text-primary">{shippingForm.fullName}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Address</span>
                  <span className="font-medium text-primary text-right max-w-[200px] truncate">{shippingForm.addressLine1}</span>
                </div>
                <div className="flex justify-between text-secondary border-t border-border-brand pt-2.5 mt-2.5">
                  <span>Standard Delivery</span>
                  <span className="font-semibold text-primary">Free</span>
                </div>
              </div>
              <Link
                href="/shop"
                className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-accent text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors block text-center"
              >
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            /* DETAILS VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Side */}
              <div className="lg:col-span-7">
                {step === 1 ? (
                  /* STEP 1: SHIPPING */
                  <form onSubmit={handleNextStep} className="bg-white border border-border-brand rounded-3xl p-8 shadow-sm space-y-6">
                    <h3 className="font-sans font-bold text-lg text-primary border-b border-border-brand pb-4">
                      Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.fullName}
                          onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Street Address</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.addressLine1}
                          onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">City</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Postal / ZIP Code</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.postalCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-4 py-3.5 px-6 rounded-full bg-primary hover:bg-secondary text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      Proceed to Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* STEP 2: PAYMENT & BILLING */
                  <form onSubmit={handlePlaceOrder} className="bg-white border border-border-brand rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-border-brand pb-4">
                      <h3 className="font-sans font-bold text-lg text-primary">
                        Payment & Verification
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold text-secondary hover:text-primary flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={paymentForm.cardName}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                          className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Credit Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={paymentForm.cardNumber}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                            className="w-full text-sm border border-border-brand rounded-full pl-11 pr-4 py-2.5 focus:border-primary outline-none"
                          />
                          <CreditCard className="w-4 h-4 text-secondary absolute left-4 top-3.5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentForm.expiry}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                            className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                            className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-2xl p-4 border border-border-brand flex items-start gap-3 text-xs text-secondary/80 leading-relaxed">
                      <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>Payments are secured with industry-standard 256-bit encryption protocols. Aura Pet does not store credentials.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-accent text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      Authorize Payment • {siteConfig.commerce.currencySymbol}{total.toFixed(2)}
                    </button>
                  </form>
                )}
              </div>

              {/* Order Summary Side */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm">
                  <h3 className="font-sans font-bold text-base text-primary border-b border-border-brand pb-4 mb-4">
                    Order Summary
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-6 text-xs text-secondary font-light">
                      Your checkout cart is empty.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                      {cart.map((item) => {
                        const hasDiscount = !!item.product.discount;
                        const finalPrice = hasDiscount
                          ? item.product.price - (item.product.price * (item.product.discount || 0)) / 100
                          : item.product.price;

                        return (
                          <div key={item.product.id} className="flex gap-3 text-xs">
                            <span className="w-6 h-6 rounded-md bg-background border border-border-brand flex items-center justify-center font-bold text-primary shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="flex-1 text-secondary font-light truncate">{item.product.name}</span>
                            <span className="font-bold text-primary">{siteConfig.commerce.currencySymbol}{(finalPrice * item.quantity).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <hr className="border-border-brand my-4" />

                  {/* Calculations */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal</span>
                      <span className="font-medium text-primary">{siteConfig.commerce.currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Standard Shipping</span>
                      <span className="font-medium text-primary">
                        {shipping === 0 ? "Free" : `${siteConfig.commerce.currencySymbol}${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-primary border-t border-border-brand pt-3 mt-3">
                      <span>Grand Total</span>
                      <span>{siteConfig.commerce.currencySymbol}{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-border-brand rounded-2xl p-4 flex gap-3 text-xs font-light text-secondary">
                  <Truck className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-primary block">Carbon Neutral Logistics</span>
                    All packages are dispatched using carbon-offset methodologies.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
