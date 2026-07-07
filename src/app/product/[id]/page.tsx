"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Product } from "@/lib/types";
import { productService } from "@/lib/services/storeService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import CartDrawer from "@/components/CartDrawer";
import { Heart, ShoppingBag, Plus, Minus, Star, ChevronRight, Truck, RefreshCw, ShieldCheck, MessageSquare } from "lucide-react";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart, toggleWishlist, isInWishlist, trackProductView, products } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Dynamic zoom effect state
  const [zoomStyle, setZoomStyle] = useState({ display: "none", backgroundPosition: "0% 0%" });

  // Load product
  useEffect(() => {
    const found = productService.getProductById(id);
    if (found) {
      setProduct(found);
      setSelectedImage(found.image);
      setQuantity(1);
      // Track views
      trackProductView(found.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background pt-28">
          <span className="text-secondary font-light mb-4">Finding your luxury pet item...</span>
          <Link href="/shop" className="text-xs font-bold underline text-primary">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  
  const hasDiscount = !!product.discount;
  const finalPrice = hasDiscount
    ? product.price - (product.price * (product.discount || 0)) / 100
    : product.price;

  // Frequently bought together bundle (Mocking 2 products from shop)
  const bundledProducts = products
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .slice(0, 2);

  // Related Products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 bg-background pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-secondary mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors font-medium text-primary">
              {product.category}
            </Link>
          </div>

          {/* Core Product Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 bg-white border border-border-brand rounded-3xl p-6 sm:p-10 shadow-premium">
            {/* Gallery / Images Column */}
            <div className="flex flex-col gap-4">
              {/* Main Image with Zoom */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-square w-full rounded-2xl overflow-hidden bg-background border border-border-brand cursor-zoom-in"
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                
                {/* Zoom overlay */}
                <div
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: "200%",
                    backgroundRepeat: "no-repeat"
                  }}
                  className="absolute inset-0 z-10 pointer-events-none transition-shadow duration-300"
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
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
                        alt={`${product.name} gallery ${i}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info / Purchasing Column */}
            <div className="flex flex-col">
              {/* Category, Rating, Stock */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-sans text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-sm">
                  <div className="flex items-center gap-0.5 text-orange-soft">
                    <Star className="w-4 h-4 fill-orange-soft" />
                  </div>
                  <span className="font-bold text-primary">{product.rating}</span>
                  <span className="text-secondary/70">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-sans font-bold text-3xl sm:text-4xl text-primary leading-tight tracking-tight mb-4">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ₹{finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-secondary line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <hr className="border-border-brand mb-6" />

              {/* Purchase Actions */}
              <div className="space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Quantity */}
                  {!isOutOfStock && (
                    <div className="flex items-center justify-between border border-border-brand rounded-full px-3 py-2 bg-background shrink-0">
                      <button
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-primary disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-semibold text-primary select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-primary disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Add to Cart */}
                  <button
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product, quantity)}
                    className={`flex-1 py-4 px-8 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? "bg-border-brand text-secondary cursor-not-allowed"
                        : "bg-primary text-white hover:bg-accent shadow-sm"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-12 h-12 rounded-full border border-border-brand flex items-center justify-center hover:bg-background transition-colors cursor-pointer ${
                      isLiked ? "text-red-500 bg-red-50/55 border-red-200" : "text-secondary"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Value propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border-brand text-xs text-secondary font-light">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary shrink-0" /> Free delivery over ₹50
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary shrink-0" /> 30-day premium return
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" /> Fully secure payment
                </div>
              </div>
            </div>
          </div>

          {/* TABS (Description, Specifications, Reviews) */}
          <div className="mb-16 bg-white border border-border-brand rounded-3xl p-6 sm:p-10 shadow-premium">
            <div className="flex border-b border-border-brand mb-8 overflow-x-auto">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "reviews", label: "Reviews" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-secondary hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "description" && (
              <div className="prose text-sm text-secondary font-light leading-relaxed max-w-none">
                <p className="mb-4">{product.description}</p>
                <p>Designed with meticulous attention to detail. Every product from Aura Pet utilizes luxury materials that ensure durability and absolute comfort, perfectly adapting to the lifestyle of pet lovers who appreciate fine modern aesthetics.</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-lg">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key} className="border-b border-border-brand last:border-b-0">
                        <td className="py-3 pr-4 font-light text-secondary w-1/3">{key}</td>
                        <td className="py-3 font-semibold text-primary">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {product.reviewsCount === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-8 h-8 text-secondary/40 mx-auto mb-2" />
                    <span className="text-sm text-secondary font-light">No reviews posted yet. Be the first to review!</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border-brand max-w-sm">
                      <div className="text-center shrink-0">
                        <span className="text-3xl font-bold text-primary">{product.rating}</span>
                        <span className="text-[10px] text-secondary uppercase tracking-wider block">Out of 5</span>
                      </div>
                      <div className="text-xs">
                        <div className="flex gap-0.5 text-orange-soft mb-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-orange-soft" />
                          ))}
                        </div>
                        <span className="text-secondary font-light">Based on verified pet parent purchases.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FREQUENTLY BOUGHT TOGETHER */}
          {bundledProducts.length > 0 && (
            <div className="mb-16 bg-white border border-border-brand rounded-3xl p-6 sm:p-10 shadow-premium">
              <h3 className="font-sans font-bold text-lg text-primary mb-6">
                Frequently Bought Together
              </h3>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6">
                {/* Product A */}
                <div className="flex items-center gap-4 border border-border-brand rounded-2xl p-4 flex-1">
                  <div className="relative w-16 h-16 bg-background rounded-xl overflow-hidden border border-border-brand">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-primary line-clamp-1">{product.name}</span>
                    <span className="text-xs font-bold text-secondary">₹{finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center text-xl text-secondary font-light shrink-0">+</div>

                {/* Bundle Items */}
                {bundledProducts.map((p, idx) => (
                  <div key={p.id} className="flex flex-row items-center gap-6 flex-1">
                    <div className="flex items-center gap-4 border border-border-brand rounded-2xl p-4 flex-1">
                      <div className="relative w-16 h-16 bg-background rounded-xl overflow-hidden border border-border-brand">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link href={`/product/${p.id}`} className="font-semibold text-sm text-primary hover:text-secondary line-clamp-1">{p.name}</Link>
                        <span className="text-xs font-bold text-secondary">₹{p.price.toFixed(2)}</span>
                      </div>
                    </div>
                    {idx < bundledProducts.length - 1 && (
                      <div className="text-center text-xl text-secondary font-light shrink-0">+</div>
                    )}
                  </div>
                ))}

                <div className="text-center text-xl text-secondary font-light shrink-0">=</div>

                {/* Add Bundle CTA */}
                <div className="shrink-0 text-center">
                  <div className="text-sm font-bold text-primary mb-2">
                    Total: ₹{(finalPrice + bundledProducts.reduce((acc, p) => acc + p.price, 0)).toFixed(2)}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      bundledProducts.forEach((p) => addToCart(p, 1));
                    }}
                    className="px-6 py-2.5 rounded-full bg-primary hover:bg-accent text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Add Bundle to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div>
              <h3 className="font-sans font-bold text-xl text-primary mb-8">
                Related Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
