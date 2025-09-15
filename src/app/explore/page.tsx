"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  slug: string;
  featured: boolean;
  stock: number;
}

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/products?limit=50");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(
              data.products?.map((product: Product) => product.category) || []
            )
          ) as string[];
          setCategories(["All", ...uniqueCategories]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />

      <div className="mt-[150px] px-4 max-w-7xl mx-auto flex flex-col gap-[64px] items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center md:w-[60%] gap-3">
          <h3 className="text-white text-[42px] md:text-[52px] font-semibold leading-[71px]">
            Explore Our <span className="fun-stuff">Premium</span>
            <br />
            Billiards <span className="fun-stuff">Collection</span>
          </h3>
          <p className="text-white/55">
            Discover professional-grade billiards tables, accessories, and
            equipment. From tournament-quality tables to precision cues, find
            everything you need.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="w-full flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="w-full text-left">
          <p className="text-gray-400 text-sm">
            {loading
              ? "Loading..."
              : `Showing ${filteredProducts.length} products`}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className="w-full">
          {loading ? (
            // Loading skeleton
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-600 h-4 rounded mb-2"></div>
                  <div className="bg-gray-600 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-white text-xl font-semibold mb-2">
                {searchQuery || selectedCategory !== "All"
                  ? "No products found"
                  : "No products available yet"}
              </h3>
              <p className="text-gray-400">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back soon for our latest billiards equipment"}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredProducts.length > 0 && filteredProducts.length >= 50 && (
          <div className="w-full text-center">
            <Button variant="outline" className="px-8">
              Load More Products
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
