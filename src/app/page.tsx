"use client";

import { useEffect, useState } from "react";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NewsHeadline from "@/components/NewsHeadline";

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
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  featuredImage: string;
  readTime: number;
  publishedAt: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, postsRes] = await Promise.all([
          fetch("/api/public/products?limit=4"),
          fetch("/api/public/blog-posts?limit=3"),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setFeaturedProducts(productsData.products || []);
        }

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setRecentPosts(postsData.blogPosts || []);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <CTA />

      {/* Featured Products Section */}
      <div className="mt-[205px] flex flex-col gap-[96px] items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center md:w-[60%] gap-3">
          <h3 className="text-white text-[33px] md:text-[52px] font-semibold leading-[46px] md:leading-[75px]">
            Where <span className="fun-stuff">Playing</span>
            <br />
            Meets <span className="fun-stuff">Perfection!</span>
          </h3>
          <p className="text-white/55">
            Discover our premium collection of professional billiards tables and
            accessories. Crafted for excellence, designed for champions.
          </p>
        </div>

        <div
          className={`grid grid-rows-1 gap-5 ${
            featuredProducts.length > 0 ? "md:grid-cols-3 lg:grid-cols-3" : ""
          }  px-4`}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-600 h-4 rounded mb-2"></div>
                <div className="bg-gray-600 h-3 rounded w-3/4"></div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          ) : (
            // Fallback to original ProductCard components
            <div className="text-center py-12">
              <h3 className="text-white text-xl font-semibold mb-2">
                No products found
              </h3>
              <p className="text-gray-400">
                Check back soon for our latest billiards equipment
              </p>
            </div>
          )}
        </div>

        <Link
          href="/explore"
          className={featuredProducts.length > 0 ? "" : "hidden"}
        >
          <Button className="flex items-center gap-2 hover:gap-4 px-[15px] py-2">
            <span>See More</span> <MoveRight className="relative top-[2px]" />
          </Button>
        </Link>
      </div>

      {/* Recent Blog Posts Section */}
      {recentPosts.length > 0 && (
        <div className="mt-[96px] px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-white text-[33px] md:text-[42px] font-semibold mb-4">
              Latest <span className="fun-stuff">News</span> & Updates
            </h3>
            <p className="text-white/55 max-w-2xl mx-auto">
              Stay updated with the latest billiards news, tips, and insights
              from our experts.
            </p>
          </div>

          <div className="flex flex-col gap-5 items-center justify-center">
            {recentPosts.map((post) => (
              <NewsHeadline
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.excerpt}
                thumbnail={post.featuredImage || "/tables/table1.png"}
                authorName={post.author}
                date={new Date(post.publishedAt).toLocaleDateString()}
                views={Math.floor(Math.random() * 100) + 10} // Random views for now
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/news">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:gap-4"
              >
                <span>Read More Articles</span>{" "}
                <MoveRight className="relative top-[2px]" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
