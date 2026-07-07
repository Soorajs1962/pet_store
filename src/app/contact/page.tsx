"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Mail, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Where do you ship from?", a: "All Aura Pet products are dispatched from our carbon-neutral logistics facilities located in Copenhagen, Denmark and Seattle, USA." },
    { q: "What is your return policy?", a: "We offer a 30-day trial period on all beds and accessories. If your pet does not adopt the product, return it in original packaging for a full refund." },
    { q: "How does the smart health collar sync data?", a: "The Aura Smart collar features LTE and Wi-Fi synchronization. It uploads health metrics automatically to our mobile application, and does not require manual Bluetooth pairing." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${form.name}. We have received your inquiry and will respond within 12 business hours.`);
    setForm({ name: "", email: "", msg: "" });
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="border-b border-border-brand pb-8 mb-12 text-center md:text-left">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
              Connect With Us
            </span>
            <h1 className="font-sans font-bold text-4xl text-primary tracking-tight mb-3">
              We&apos;re Here to Help
            </h1>
            <p className="text-sm text-secondary font-light max-w-xl">
              Have questions about sizing, ingredients, or smart collar synchronization? Reach out to our design concierge team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="md:col-span-7 bg-white border border-border-brand rounded-3xl p-8 shadow-sm space-y-5">
              <h3 className="font-sans font-bold text-lg text-primary border-b border-border-brand pb-4">
                Send a Message
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.msg}
                  onChange={(e) => setForm({ ...form, msg: e.target.value })}
                  className="w-full text-sm border border-border-brand rounded-2xl p-4 focus:border-primary outline-none resize-none"
                  placeholder="How can we assist you and your pet?"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-primary hover:bg-accent text-white text-xs font-bold transition-all cursor-pointer"
              >
                Send Message
              </button>
            </form>

            {/* Concierge Info & Hours */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-sans font-bold text-base text-primary border-b border-border-brand pb-4">
                  Boutique Concierge
                </h3>
                <div className="space-y-4 text-xs font-light text-secondary">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>742 Evergreen Terrace, Springfield, 97477 USA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span>+1 (555) 892-0192</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span>concierge@aurapet.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border-brand rounded-3xl p-6 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-primary">Business Hours</h4>
                <div className="text-xs text-secondary font-light flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-primary">09:00 - 18:00 EST</span>
                </div>
                <div className="text-xs text-secondary font-light flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-primary">10:00 - 15:00 EST</span>
                </div>
                <div className="text-xs text-secondary font-light flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-secondary">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="font-bold text-2xl text-primary text-center tracking-tight mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-border-brand rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left font-sans font-semibold text-sm text-primary flex items-center justify-between hover:bg-background/20 transition-colors cursor-pointer"
                  >
                    {faq.q}
                    {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="p-5 pt-0 text-xs text-secondary font-light leading-relaxed border-t border-border-brand/40">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Styled Google Maps Placeholders */}
          <div className="bg-white border border-border-brand rounded-3xl overflow-hidden shadow-sm h-80 relative flex items-center justify-center">
            {/* Minimal Map Overlay */}
            <div className="absolute inset-0 bg-[#E5E5E7] opacity-60 flex items-center justify-center font-bold text-secondary font-sans text-xs tracking-wider uppercase select-none">
              [ Interactive Location Studio Map ]
            </div>
            <div className="relative z-10 text-center space-y-2 p-6 bg-white/90 backdrop-blur-sm border border-border-brand rounded-2xl max-w-xs shadow-lg">
              <h4 className="font-bold text-sm text-primary">Aura Pet Studio</h4>
              <p className="text-[10px] text-secondary font-light leading-relaxed">
                Step in for bespoke sizing consultation and custom leatherpatina embossments.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
