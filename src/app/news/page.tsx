"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsHeadline from "@/components/NewsHeadline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

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

export default function NewsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/public/blog-posts?limit=20");
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.blogPosts || []);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.blogPosts?.map((post: BlogPost) => post.category) || [])
          ) as string[];
          setCategories(["All", ...uniqueCategories]);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <main className="md:w-[75%] px-4 mx-auto md:mt-[150px] mt-[40px] flex flex-col gap-[96px] items-start justify-start">
        <header className="flex flex-col items-start justify-start gap-3 text-left">
          <h1 className="text-white text-[42px] md:text-[52px] font-semibold leading-[71px]">
            News & Articles
          </h1>
          <p className="text-white/55">
            Stay updated with the latest billiards news, tips, and insights from our experts
          </p>
        </header>

        {/* Search and Filter Section */}
        <div className="w-full flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <section
          className="flex flex-col items-center gap-[64px] w-full"
          aria-label="News articles"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full animate-pulse">
                <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-600 h-6 rounded mb-2"></div>
                <div className="bg-gray-600 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-600 h-3 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
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
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-white text-xl font-semibold mb-2">
                {searchQuery || selectedCategory !== "All" 
                  ? "No articles found" 
                  : "No articles available yet"}
              </h3>
              <p className="text-gray-400">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back soon for the latest billiards news and insights"}
              </p>
            </div>
          )}
        </section>

        {/* Load More Button */}
        {filteredPosts.length > 0 && filteredPosts.length >= 20 && (
          <div className="w-full text-center">
            <Button variant="outline" className="px-8">
              Load More Articles
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
