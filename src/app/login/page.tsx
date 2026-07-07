"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Lock, Mail, ArrowRight } from "lucide-react";

function LoginForm() {
  const { login, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("alexander@mercer.com");
  const [password, setPassword] = useState("••••••••");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@aurapet.com") {
      login(email, "admin");
    } else {
      login(email, "customer");
    }
    router.push(redirect);
  };

  return (
    <div className="max-w-md w-full bg-white border border-border-brand rounded-3xl p-8 sm:p-10 shadow-premium">
      <div className="text-center mb-8">
        <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base tracking-tighter mx-auto mb-4">
          A
        </span>
        <h2 className="font-sans font-bold text-2xl text-primary mb-2">Welcome Back</h2>
        <p className="text-xs text-secondary font-light">
          Sign in to manage orders, wishlists, and store configurations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border border-border-brand rounded-full pl-11 pr-4 py-2.5 focus:border-primary outline-none text-primary"
            />
            <Mail className="w-4 h-4 text-secondary absolute left-4 top-3.5" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm border border-border-brand rounded-full pl-11 pr-4 py-2.5 focus:border-primary outline-none text-primary"
            />
            <Lock className="w-4 h-4 text-secondary absolute left-4 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-accent text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          Sign In <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-border-brand text-[10px] text-secondary font-light space-y-2">
        <span className="font-bold text-primary block uppercase tracking-wider">Demo Access accounts:</span>
        <div className="flex justify-between">
          <span>Customer Demo:</span>
          <span className="font-mono text-primary">alexander@mercer.com</span>
        </div>
        <div className="flex justify-between">
          <span>Admin / Owner Demo:</span>
          <span className="font-mono text-primary">admin@aurapet.com</span>
        </div>
        <span className="block text-secondary/60 leading-normal pt-1">
          *Type any password to log in. Log in as admin to test catalog edits and stock refilling.
        </span>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 flex items-center justify-center px-6">
        <Suspense fallback={
          <div className="max-w-md w-full bg-white border border-border-brand rounded-3xl p-8 text-center shadow-premium">
            <span className="text-secondary font-light animate-pulse">Loading login access...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
