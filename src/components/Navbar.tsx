"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Heart, User, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart, wishlist, setCartOpen } = useApp();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHeroPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "glass-nav shadow-sm py-4"
            : isHeroPage
            ? "bg-transparent py-6 border-b border-transparent"
            : "bg-background py-5 border-b border-border-brand"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform duration-200">
              A
            </span>
            <span className="font-sans font-bold text-lg tracking-tight text-primary">
              AURA<span className="font-light text-secondary">PET</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${
                    isActive ? "text-primary font-semibold" : "text-secondary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile */}
            <Link
              href="/account"
              className="text-secondary hover:text-primary transition-colors hidden sm:block"
              aria-label="Account profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="text-secondary hover:text-primary transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="text-secondary hover:text-primary transition-colors relative cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-secondary hover:text-primary transition-colors md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 pt-24 bg-white/98 backdrop-blur-lg flex flex-col p-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`border-b border-border-brand pb-4 transition-colors ${
                    pathname === link.href ? "text-primary font-bold" : "text-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-border-brand pb-4 text-secondary flex items-center gap-2"
              >
                <User className="w-5 h-5" /> Account Profile / Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              className="bg-white rounded-2xl shadow-premium border border-border-brand max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 border-b border-border-brand pb-3">
                <Search className="w-6 h-6 text-secondary" />
                <input
                  type="text"
                  placeholder="Search pet beds, treats, smart collars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg text-primary bg-transparent outline-none placeholder:text-secondary/50 font-light"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                      setSearchOpen(false);
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Bed", "Collar", "Salmon", "Scratching Post"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        window.location.href = `/shop?search=${encodeURIComponent(tag)}`;
                        setSearchOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-secondary bg-background hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
