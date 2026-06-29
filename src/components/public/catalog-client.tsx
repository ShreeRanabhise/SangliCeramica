"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { NavCard } from "@/components/ui/nav-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface CatalogClientProps {
  products: any[];
  categories: any[];
  initialCategory?: string;
  initialCollection?: string;
}

export function CatalogClient({ products, categories, initialCategory, initialCollection }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(initialCollection || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCollection = selectedCollection ? p.category?.collection === selectedCollection : true;
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchesSearch && matchesCollection && matchesCategory;
    });
  }, [products, searchQuery, selectedCollection, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCollection(null);
    setSelectedCategory(null);
  };

  const collections = [
    { id: "TILES", name: "Tiles" },
    { id: "SANITARYWARE", name: "Sanitaryware" },
    { id: "DOORS", name: "Doors" },
  ];

  const visibleCategories = selectedCollection 
    ? categories.filter(c => c.collection === selectedCollection)
    : categories;

  const handleCollectionChange = (id: string) => {
    setSelectedCollection(id);
    setSelectedCategory(null); // Reset category when collection changes
  };

  const FilterSidebar = () => (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Collections</h3>
          {selectedCollection && (
            <button onClick={() => { setSelectedCollection(null); setSelectedCategory(null); }} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Clear</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => handleCollectionChange(col.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCollection === col.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Categories</h3>
          {selectedCategory && (
            <button onClick={() => setSelectedCategory(null)} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Clear</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {(searchQuery || selectedCollection || selectedCategory) && (
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground mt-8" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" /> Clear All Filters
        </Button>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* Mobile Filter Toggle */}
      <div className="w-full md:hidden flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 focus-visible:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger>
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <Filter className="h-4 w-4" />
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl overflow-y-auto">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <div className="pb-10">
              <FilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Top Filter Bar */}
      <div className="hidden md:flex flex-col gap-6 bg-card p-6 rounded-2xl border shadow-sm w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 focus-visible:ring-primary/50 transition-all bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-muted-foreground text-sm font-medium shrink-0">
            Showing <span className="text-foreground font-semibold">{filteredProducts.length}</span> products
          </p>
        </div>
        <div className="w-full">
          <FilterSidebar />
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full min-h-[500px]">
        <div className="mb-4 md:hidden flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">
            Showing <span className="text-foreground font-semibold">{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-card border shadow-sm w-full"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <PackageOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-8 max-w-md">We couldn't find any products matching your current filters. Try adjusting them or clear all filters to see more.</p>
            <Button onClick={clearFilters} className="rounded-full px-8">Clear Filters</Button>
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 w-full"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => {
                const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index < 12 ? index * 0.05 : 0 }}
                  >
                    <NavCard href={`/products/${product.slug}`} className="group block h-full">
                      <div className="bg-secondary h-full rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                        <div className="relative aspect-[3/2] bg-white overflow-hidden">
                          {primaryImage ? (
                            <Image 
                              src={primaryImage.url} 
                              alt={product.name} 
                              fill 
                              className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                              <span className="text-muted-foreground text-sm font-medium">No Image</span>
                            </div>
                          )}
                          

                        </div>
                        <div className="p-4 md:p-5 flex flex-col justify-between h-[calc(100%-66%)]">
                          <div>
                            <p className="text-xs md:text-sm text-muted-foreground mb-1">
                              {product.category?.name || "Product"}
                            </p>
                            <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2">{product.size}</p>
                          </div>
                        </div>
                      </div>
                    </NavCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
