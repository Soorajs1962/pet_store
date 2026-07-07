"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Product } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import CartDrawer from "@/components/CartDrawer";
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

function ShopContent() {
  const { products } = useApp();
  const searchParams = useSearchParams();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(300); // Max price
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const itemsPerPage = 8;

  // Categories list derived dynamically
  const categoriesList = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  // Sync with URL params (search, category)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("All");
    }

    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery("");
    }

    setCurrentPage(1);
  }, [searchParams]);

  // Filter and Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    const matchesRating = product.rating >= minRating;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesRating && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    // Default (featured)
    return b.rating - a.rating;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setPriceRange(300);
    setMinRating(0);
    setSortBy("featured");
    setSearchQuery("");
    setCurrentPage(1);
    window.history.pushState(null, "", "/shop");
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 font-sans bg-background pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Description */}
          <div className="border-b border-border-brand pb-8 mb-10">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">
              Aura Catalog
            </span>
            <h1 className="font-sans font-bold text-4xl text-primary tracking-tight mb-3">
              Explore Our Collection
            </h1>
            <p className="text-sm text-secondary font-light max-w-xl">
              From orthopedic memory foam beds to cellular GPS tracking, discover designs curated for luxury durability and modern wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* FILTER SIDEBAR (Desktop) */}
            <div className="lg:col-span-1 space-y-8 bg-white border border-border-brand rounded-2xl p-6 h-fit shadow-sm">
              <div className="flex items-center justify-between border-b border-border-brand pb-4">
                <span className="text-sm font-bold text-primary flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Search filter */}
              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-3">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-sm border border-border-brand rounded-full px-4 py-2.5 outline-none focus:border-primary text-primary"
                />
              </div>

              {/* Categories filter */}
              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-3">
                  Category
                </label>
                <div className="flex flex-col gap-2">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-primary text-white font-semibold"
                          : "text-secondary hover:bg-background hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div>
                <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-wider mb-3">
                  <span>Max Price</span>
                  <span className="text-primary font-bold">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-primary bg-border-brand h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-secondary/60 mt-1">
                  <span>₹10</span>
                  <span>₹300</span>
                </div>
              </div>

              {/* Ratings filter */}
              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-3">
                  Minimum Rating
                </label>
                <div className="flex flex-col gap-2">
                  {[0, 4.5, 4.8].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setMinRating(rate);
                        setCurrentPage(1);
                      }}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                        minRating === rate
                          ? "bg-primary text-white font-semibold"
                          : "text-secondary hover:bg-background hover:text-primary"
                      }`}
                    >
                      {rate === 0 ? "All Ratings" : `${rate}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRODUCT GRID & SORTING */}
            <div className="lg:col-span-3 space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-border-brand rounded-2xl p-4 shadow-sm">
                <span className="text-xs text-secondary font-light">
                  Showing <strong className="text-primary font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedProducts.length)}</strong> of <strong className="text-primary font-semibold">{sortedProducts.length}</strong> items
                </span>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-secondary" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs text-primary font-semibold bg-transparent outline-none border border-border-brand rounded-full py-1.5 px-3 focus:border-primary"
                  >
                    <option value="featured">Best Matches</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {currentProducts.length === 0 ? (
                <div className="bg-white border border-border-brand rounded-3xl py-20 px-6 text-center shadow-sm">
                  <h3 className="font-bold text-lg text-primary mb-2">No products found</h3>
                  <p className="text-sm text-secondary font-light max-w-sm mx-auto mb-6">
                    We couldn&apos;t find any items matching your selected filter guidelines. Try resetting your search parameters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-accent transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-border-brand">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full border border-border-brand flex items-center justify-center text-secondary hover:text-primary hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        currentPage === i + 1
                          ? "bg-primary text-white"
                          : "border border-border-brand text-secondary hover:text-primary hover:bg-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full border border-border-brand flex items-center justify-center text-secondary hover:text-primary hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
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

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-secondary font-light animate-pulse">Loading Aura Catalog...</span>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
