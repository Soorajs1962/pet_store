"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function About() {
  const team = [
    { name: "Julian Vance", role: "Founder & Architect", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { name: "Sophia Sterling", role: "Lead Product Designer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { name: "Dr. Kenji Sato", role: "Veterinary Officer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" }
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1541599540903-216a46ca1df0?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 font-sans">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-20">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">Our Story</span>
          <h1 className="font-sans font-bold text-4xl sm:text-5xl text-primary tracking-tight leading-tight mb-6">
            A New Aesthetic for Pet Living.
          </h1>
          <p className="text-base sm:text-lg text-secondary font-light leading-relaxed text-balance">
            Aura Pet was founded in Copenhagen out of a simple realization: pet products are too often treated as cheap plastic afterthoughts. We set out to design pet accessories that prioritize orthopedic health, clean ingredients, and structural modern beauty.
          </p>
        </section>

        {/* Editorial Story */}
        <section className="bg-white border-t border-b border-border-brand py-20 px-6 mb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-border-brand bg-background">
              <Image
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
                alt="Minimalist design philosophy"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-bold text-3xl text-primary tracking-tight">Inspired by Apple & Nike. Engineered for Wellness.</h2>
              <p className="text-sm text-secondary font-light leading-relaxed">
                We believe that pets are complete family members. Their beds should provide orthopedic pressure relief. Their water fountains should run silently and feature medical filtration. Their toys should interact intelligently, not overstimulate.
              </p>
              <p className="text-sm text-secondary font-light leading-relaxed">
                By fusing sleek industrial design with premium organic fabrics, we build lifestyle goods that pets adore and that owners proudly feature in their modern homes.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-5xl mx-auto px-6 mb-20 text-center">
          <h2 className="font-bold text-2xl text-primary tracking-tight mb-12">The Creative Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {team.map((m, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-border-brand mb-4">
                  <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-sm text-primary leading-tight">{m.name}</h4>
                <span className="text-xs text-secondary mt-1 font-light">{m.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-bold text-2xl text-primary tracking-tight mb-12">Aura Studio Galleries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {gallery.map((src, i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-border-brand bg-white">
                <Image src={src} alt={`Studio pet ${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
