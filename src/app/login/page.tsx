"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Lock, Mail, ArrowRight } from "lucide-react";

function LoginForm() {
  const { login, googleLogin, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      router.push(redirect);
    }
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
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email or Phone Number</label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Email or +91 XXXXX XXXXX"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-accent text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Sign In"} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <hr className="w-full border-border-brand" />
        <span className="absolute bg-white px-3 text-[10px] text-secondary font-light uppercase tracking-wider">
          Or Continue With
        </span>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={googleLogin}
        className="w-full py-3.5 px-6 rounded-full border border-border-brand hover:bg-background text-primary text-xs font-bold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5.04c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.4 15 0 12 0 7.3 0 3.3 2.7 1.4 6.6l3.9 3C6.2 7.1 8.9 5.04 12 5.04z"/>
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"/>
          <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3l-3.9-3C.5 8.9 0 10.4 0 12s.5 3.1 1.4 4.8l3.9-3z"/>
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-4.9l-3.9 3C3.3 21.3 7.3 24 12 24z"/>
        </svg>
        Sign in with Google
      </button>

      <div className="mt-8 pt-6 border-t border-border-brand text-[10px] text-secondary font-light space-y-2">
        <span className="font-bold text-primary block uppercase tracking-wider">Demo Access Credentials:</span>
        <div className="flex justify-between">
          <span>Customer Login:</span>
          <span className="font-mono text-primary">alexander@mercer.com or +91 98765 43210</span>
        </div>
        <div className="flex justify-between">
          <span>Customer Password:</span>
          <span className="font-mono text-primary">customer123</span>
        </div>
        <hr className="border-border-brand my-1" />
        <div className="flex justify-between">
          <span>Admin Login:</span>
          <span className="font-mono text-primary">admin@aurapet.com or +91 99999 99999</span>
        </div>
        <div className="flex justify-between">
          <span>Admin Password:</span>
          <span className="font-mono text-primary">admin123</span>
        </div>
        <span className="block text-secondary/60 leading-normal pt-1">
          *Demo credentials are fully locked down. You can also create a new account using the Sign Up link below.
        </span>
      </div>

      <div className="mt-6 text-center text-xs font-light text-secondary">
        Don't have an account?{" "}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          Sign Up
        </Link>
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
