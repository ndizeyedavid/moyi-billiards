"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  User,
  Tag,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock article data - in a real app, this would come from an API or database
const getArticleById = (id: string) => {
  const articles = {
    "1wsasd": {
      id: "1wsasd",
      title:
        "The Evolution of Professional Pool Tables: A Deep Dive into Modern Craftsmanship",
      description:
        "Discover how pool table manufacturing has evolved over the decades, from traditional craftsmanship to modern precision engineering.",
      content: `
        <p>The world of professional pool tables has undergone a remarkable transformation over the past few decades. What once relied purely on traditional woodworking techniques now incorporates cutting-edge technology and precision engineering to create tables that meet the exacting standards of professional tournaments.</p>

        <h2>The Foundation: Slate Bed Technology</h2>
        <p>At the heart of every premium pool table lies the slate bed - a crucial component that determines the table's playing characteristics. Modern slate beds are precision-machined to tolerances of less than 0.1mm, ensuring a perfectly level playing surface that remains consistent across the entire table.</p>

        <p>The process begins with carefully selected slate quarried from specific regions known for their dense, uniform stone. Each piece undergoes rigorous quality testing before being shaped and polished to exacting specifications.</p>

        <h2>Cushion Innovation</h2>
        <p>The rubber cushions that line the rails of a pool table have also seen significant advancement. Modern cushions use specially formulated rubber compounds that provide consistent rebound characteristics across a wide temperature range. This ensures that the table plays the same whether it's in a climate-controlled tournament hall or a basement game room.</p>

        <h2>Cloth Technology</h2>
        <p>The cloth covering the playing surface has evolved from simple wool fabrics to sophisticated blends that incorporate synthetic fibers for enhanced durability and consistent ball roll. Premium tournament cloths now feature directional weaves that minimize ball drift and ensure predictable ball behavior.</p>

        <h2>Precision Manufacturing</h2>
        <p>Today's pool table manufacturing combines traditional craftsmanship with modern precision tools. Computer-controlled machinery ensures that every component meets exact specifications, while skilled craftsmen apply the finishing touches that give each table its unique character.</p>

        <p>The result is a playing surface that not only looks beautiful but performs at the highest level, providing players with the consistent, predictable gameplay that serious billiards demands.</p>

        <h2>The Future of Pool Tables</h2>
        <p>As technology continues to advance, we can expect to see even more innovations in pool table design and manufacturing. From smart tables that can track ball movement to new materials that offer enhanced performance characteristics, the future of professional pool tables looks brighter than ever.</p>
      `,
      thumbnail: "/tables/table1.png",
      authorName: "Wilson Moyi",
      authorAvatar: "/thumb.png",
      authorBio:
        "Master craftsman and founder of Moyi Billiards, with over 15 years of experience in premium pool table manufacturing.",
      publishedDate: "2024-01-15",
      readingTime: 8,
      views: 1247,
      tags: ["Pool Tables", "Craftsmanship", "Technology", "Professional"],
      category: "Industry Insights",
    },
  };

  return articles[id as keyof typeof articles] || null;
};

const relatedArticles = [
  {
    id: "2",
    title: "Choosing the Right Pool Table for Your Space",
    thumbnail: "/tables/table2.webp",
    readingTime: 5,
  },
  {
    id: "3",
    title: "Maintenance Tips for Professional Pool Tables",
    thumbnail: "/tables/table3.png",
    readingTime: 6,
  },
  {
    id: "4",
    title: "The Art of Pool Table Installation",
    thumbnail: "/tables/table4.jpeg",
    readingTime: 7,
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  // In a real app, you'd await the params and fetch data
  const article = getArticleById("1wsasd"); // Using default ID for demo

  if (!article) {
    notFound();
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${article.title}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
        break;
    }
  };

  return (
    <>
      <Header />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-rose-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-background pt-[130px] pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link
              href="/news"
              className="hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{article.category}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate">{article.title}</span>
          </motion.div>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Title and Meta */}
            <header className="space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="border-rose-500/20 bg-rose-500/5"
                >
                  <Tag className="h-3.5 w-3.5 mr-1 text-rose-500" />
                  {article.category}
                </Badge>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {article.title}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={article.authorAvatar}
                      alt={article.authorName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {article.authorName}
                    </p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12" />

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(article.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="space-y-6 text-foreground leading-relaxed"
              />
            </div>

            {/* Author Bio */}
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src={article.authorAvatar}
                    alt={article.authorName}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      About {article.authorName}
                    </h3>
                    <p className="text-muted-foreground">{article.authorBio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Share this article:</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                  className="hover:bg-blue-600 hover:text-white hover:border-blue-600"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                  className="hover:bg-blue-400 hover:text-white hover:border-blue-400"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("linkedin")}
                  className="hover:bg-blue-700 hover:text-white hover:border-blue-700"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("copy")}
                  className="hover:bg-gray-600 hover:text-white hover:border-gray-600"
                >
                  <Copy className="h-4 w-4" />
                  {isSharing ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </motion.article>

          {/* Related Articles */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedArticle.thumbnail}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-rose-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{relatedArticle.readingTime} min read</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border-rose-200 dark:border-rose-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Interested in Our Pool Tables?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Discover our premium collection of professional-grade pool
                  tables, crafted with the same attention to detail described in
                  this article.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-rose-600 hover:bg-rose-700">
                    <Link href="/explore">View Our Collection</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>

      <Footer />
    </>
  );
}
