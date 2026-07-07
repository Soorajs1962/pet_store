"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-brand pt-16 pb-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        {/* Brand Col */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm tracking-tighter">
              A
            </span>
            <span className="font-bold text-lg tracking-tight text-primary">
              AURA<span className="font-light text-secondary">PET</span>
            </span>
          </Link>
          <p className="text-secondary text-sm max-w-sm mb-6 leading-relaxed">
            Redefining pet wellness through premium, minimal design. We create beautiful products for modern pets and the homes they live in.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all" aria-label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all" aria-label="Twitter">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all" aria-label="Facebook">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Shop</h4>
          <ul className="flex flex-col gap-3 text-sm">
            {["Beds", "Accessories", "Food", "Treats", "Toys", "Health"].map((cat) => (
              <li key={cat}>
                <Link href={`/shop?category=${cat}`} className="text-secondary hover:text-primary transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Company</h4>
          <ul className="flex flex-col gap-3 text-sm">
            {["About Our Brand", "Pet Care Blog", "Contact Us", "Affiliates", "Press Kit"].map((link) => (
              <li key={link}>
                <Link
                  href={link.includes("Blog") ? "/blog" : link.includes("About") ? "/about" : link.includes("Contact") ? "/contact" : "/about"}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Col */}
        <div>
          <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Stay Connected</h4>
          <p className="text-secondary text-xs mb-4 leading-relaxed">
            Subscribe to receive styling guides, pet wellness columns, and product launch invitations.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to Aura Pet!");
            }}
            className="flex items-center border border-border-brand rounded-full p-1 bg-background focus-within:border-primary transition-all"
          >
            <input
              type="email"
              placeholder="Your email"
              required
              className="flex-1 bg-transparent px-3 text-xs outline-none text-primary placeholder:text-secondary/50 font-light"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border-brand flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-4">
        <span>© {new Date().getFullYear()} Aura Pet Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a>
        </div>
      </div>
    </footer>
  );
}
