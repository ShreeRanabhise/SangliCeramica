"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CatalogClientProps {
  products: any[];
  categories: any[];
  brands: any[];
}

export function CatalogClient({ products, categories, brands }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCollection = selectedCollection ? p.category?.collection === selectedCollection : true;
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      const matchesBrand = selectedBrand ? p.brandId === selectedBrand : true;
      return matchesSearch && matchesCollection && matchesCategory && matchesBrand;
    });
  }, [products, searchQuery, selectedCollection, selectedCategory, selectedBrand]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCollection(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
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

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Mobile Filter Toggle */}
      <div className="w-full md:hidden flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Filters */}
      <div className={`w-full md:w-64 shrink-0 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Collections</h3>
            {selectedCollection && (
              <button onClick={() => { setSelectedCollection(null); setSelectedCategory(null); }} className="text-xs text-muted-foreground hover:text-primary">Clear</button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {collections.map((col) => (
              <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="collection" 
                  checked={selectedCollection === col.id}
                  onChange={() => handleCollectionChange(col.id)}
                  className="rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors">{col.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Categories</h3>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-xs text-muted-foreground hover:text-primary">Clear</button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {visibleCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Brands</h3>
            {selectedBrand && (
              <button onClick={() => setSelectedBrand(null)} className="text-xs text-muted-foreground hover:text-primary">Clear</button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="brand" 
                  checked={selectedBrand === brand.id}
                  onChange={() => setSelectedBrand(brand.id)}
                  className="rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        {(searchQuery || selectedCollection || selectedCategory || selectedBrand) && (
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" /> Clear All Filters
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <div className="flex-1 w-full">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/20">
            <Filter className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
              return (
                <Link key={product.id} href={`/catalog/${product.slug}`} className="group block">
                  <div className="bg-card rounded-xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      {primaryImage ? (
                        <Image 
                          src={primaryImage.url} 
                          alt={product.name} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                      )}
                      {product.brand && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-md shadow-sm">
                            {product.brand.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{product.category?.name}</p>
                      <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
