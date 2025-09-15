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
  Tag,
  ChevronRight,
  MessageCircle,
  Loader2,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  status: string;
  publishedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  readTime: number | null;
  wordCount: number | null;
  createdAt: string;
  updatedAt: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  readTime: number | null;
  publishedAt: string;
  category: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleId, setArticleId] = useState<string>("");

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

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setArticleId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const [articleResponse, relatedResponse] = await Promise.all([
          fetch(`/api/public/blog/${articleId}`),
          fetch(`/api/public/blog/related/${articleId}`),
        ]);

        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          setArticle(articleData.blogPost);
        } else if (articleResponse.status === 404) {
          notFound();
        }

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedArticles(relatedData.relatedPosts);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-[130px] pb-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    notFound();
  }

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
                  {article.excerpt || article.metaDescription || ""}
                </p>
              </div>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                      <span className="text-rose-600 font-semibold text-lg">
                        {article.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {article.author}
                    </p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12" />

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(
                        article.publishedAt || article.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {article.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                  )}
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
            {article.featuredImage && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

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
                  <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-semibold text-2xl">
                      {article.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      About {article.author}
                    </h3>
                    <p className="text-muted-foreground">
                      Content creator and billiards expert at Moyi Billiards,
                      sharing insights about pool tables and the billiards
                      industry.
                    </p>
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
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/news/read/${relatedArticle.id}`}
                >
                  <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      {relatedArticle.featuredImage ? (
                        <div className="relative aspect-video overflow-hidden rounded-t-lg">
                          <Image
                            src={relatedArticle.featuredImage}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                          <Tag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        {relatedArticle.excerpt && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {relatedArticle.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{relatedArticle.readTime || 5} min read</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
