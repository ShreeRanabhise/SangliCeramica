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
}

export function CatalogClient({ products, categories }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
        <div className="flex flex-col gap-2">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.id && (
                <motion.div layoutId="active-cat-indicator" className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
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
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
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

      {/* Desktop Sidebar Filters */}
      <div className="hidden md:block w-64 shrink-0 space-y-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 focus-visible:ring-primary/50 transition-all bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterSidebar />
      </div>

      {/* Product Grid */}
      <div className="flex-1 w-full min-h-[500px]">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">
            Showing <span className="text-foreground font-semibold">{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-card border shadow-sm"
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
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
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
                      <div className="bg-card h-full rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                        <div className="relative aspect-[3/2] bg-muted overflow-hidden">
                          {primaryImage ? (
                            <Image 
                              src={primaryImage.url} 
                              alt={product.name} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                              <span className="text-muted-foreground text-sm font-medium">No Image</span>
                            </div>
                          )}
                          
                          {/* Optional Category Badge Overlay */}
                          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-full border shadow-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
                              {product.brand?.name || product.category?.name || "Uncategorized"}
                            </p>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-1">{product.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            {product.size && (
                              <p className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                                Size: {product.size}
                              </p>
                            )}
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
