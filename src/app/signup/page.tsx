"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";

export default function SignUp() {
  const { addToast } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // Email or Phone number
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          phone,
          password
        })
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        addToast(data.error || "Registration failed.", "error");
        return;
      }

      addToast("Account created! Please sign in using your credentials.", "success");
      router.push(`/login?redirect=/account`);
    } catch {
      setLoading(false);
      addToast("An error occurred during registration.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-border-brand rounded-3xl p-8 sm:p-10 shadow-premium">
          <div className="text-center mb-8">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base tracking-tighter mx-auto mb-4">
              A
            </span>
            <h2 className="font-sans font-bold text-2xl text-primary mb-2">Create Account</h2>
            <p className="text-xs text-secondary font-light">
              Register to save addresses, track orders, and join our club.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm border border-border-brand rounded-full pl-11 pr-4 py-2.5 focus:border-primary outline-none text-primary"
                />
                <User className="w-4 h-4 text-secondary absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@malhotra.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-sm border border-border-brand rounded-full pl-11 pr-4 py-2.5 focus:border-primary outline-none text-primary"
                />
                <Mail className="w-4 h-4 text-secondary absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 9876543210 (without +91)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm border border-border-brand rounded-full pl-11 pr-4 py-2.5 focus:border-primary outline-none text-primary"
                />
                <Phone className="w-4 h-4 text-secondary absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter a secure password"
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
              {loading ? "Registering..." : "Create Account"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-light text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
