"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  TrendingUp,
  Clock,
  BookOpen,
  X,
} from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getBlogPosts, deleteBlogPost } from "@/lib/actions/blog-posts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BlogPostForm from "@/components/forms/BlogPostForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["All", "History", "Buying Guide", "Maintenance", "Professional", "Craftsmanship", "News"];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isBlogPostFormOpen, setIsBlogPostFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [postStats, setPostStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await getBlogPosts();

      if (response.success && response.data) {
        const posts = response.data.blogPosts || [];
        setBlogPosts(posts);

        // Calculate stats from real data
        const totalPosts = posts.length;
        const publishedPosts = posts.filter((p: any) => p.status === 'Published').length;
        const totalWords = posts.reduce((sum: number, p: any) => sum + (p.wordCount || 0), 0);
        const avgReadTime = posts.length > 0 
          ? Math.round(posts.reduce((sum: number, p: any) => sum + (p.readTime || 0), 0) / posts.length)
          : 0;

        setPostStats([
          {
            title: "Total Posts",
            value: totalPosts.toString(),
            change: `${posts.length} posts`,
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
          },
          {
            title: "Published",
            value: publishedPosts.toString(),
            change: `${Math.round((publishedPosts/totalPosts)*100) || 0}% published`,
            icon: BookOpen,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
          },
          {
            title: "Total Words",
            value: `${(totalWords/1000).toFixed(1)}K`,
            change: "Content created",
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
          },
          {
            title: "Avg. Read Time",
            value: `${avgReadTime} min`,
            change: "Reading time",
            icon: Clock,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
          },
        ]);
      } else {
        setBlogPosts([]);
        setPostStats([]);
        toast.error(response.error || "Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to fetch blog posts");
      setBlogPosts([]);
      setPostStats([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || post.category === filterCategory;
    const matchesStatus = filterStatus === "All" || post.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddPost = () => {
    setEditingPost(null);
    setIsBlogPostFormOpen(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsBlogPostFormOpen(true);
  };

  const handleSavePost = (postData: any) => {
    fetchBlogPosts(); // Refresh the posts list
    setIsBlogPostFormOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const result = await deleteBlogPost(postId);
      if (result.success) {
        toast.success("Blog post deleted successfully");
        fetchBlogPosts();
      } else {
        toast.error(result.error || "Failed to delete blog post");
      }
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  const handlePreviewPost = (post: any) => {
    setPreviewPost(post);
    setIsPreviewOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "default";
      case "Draft":
        return "secondary";
      case "Scheduled":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content and articles
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddPost}>
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-8 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted animate-pulse">
                    <div className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          postStats.map((stat: any, index: number) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Category: {filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["All", "Published", "Draft", "Scheduled"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="flex gap-4">
                      <div className="h-3 bg-muted rounded animate-pulse w-20" />
                      <div className="h-3 bg-muted rounded animate-pulse w-16" />
                      <div className="h-3 bg-muted rounded animate-pulse w-12" />
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse w-20" />
                </div>
              ))
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterCategory !== "All" || filterStatus !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first blog post"}
                </p>
                <Button onClick={handleAddPost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Blog Post
                </Button>
              </div>
            ) : (
              filteredPosts.map((post: any, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      {post.featured && (
                        <Badge variant="outline" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime || 0} min read
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handlePreviewPost(post)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPost(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blog Post Form Modal */}
      <BlogPostForm
        isOpen={isBlogPostFormOpen}
        onClose={() => {
          setIsBlogPostFormOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
        post={editingPost}
      />

      {/* Blog Post Preview Modal */}
      {isPreviewOpen && previewPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Blog Post Preview</h2>
                <Badge variant={getStatusColor(previewPost.status)}>
                  {previewPost.status}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                {/* Featured Image */}
                {previewPost.featuredImage && (
                  <div className="mb-6">
                    <img
                      src={previewPost.featuredImage}
                      alt={previewPost.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {previewPost.featured && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {previewPost.category}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{previewPost.title}</h1>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>By {previewPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(previewPost.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{previewPost.readTime || 0} min read</span>
                    </div>
                  </div>

                  {previewPost.excerpt && (
                    <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-6">
                      {previewPost.excerpt}
                    </p>
                  )}
                </div>

                {/* Post Content */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="whitespace-pre-wrap leading-relaxed"
                    style={{ lineHeight: '1.8' }}
                  >
                    {previewPost.content}
                  </div>
                </div>

                {/* Tags */}
                {previewPost.tags && previewPost.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {previewPost.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Information */}
                <div className="mt-8 pt-6 border-t bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">Post Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                        {previewPost.slug}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Word Count:</span>
                      <span className="ml-2">{previewPost.wordCount || 0} words</span>
                    </div>
                    {previewPost.metaTitle && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">SEO Title:</span>
                        <span className="ml-2">{previewPost.metaTitle}</span>
                      </div>
                    )}
                    {previewPost.metaDescription && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">SEO Description:</span>
                        <span className="ml-2">{previewPost.metaDescription}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-muted/30">
              <div className="text-sm text-muted-foreground">
                Created: {new Date(previewPost.createdAt).toLocaleString()}
                {previewPost.updatedAt && previewPost.updatedAt !== previewPost.createdAt && (
                  <span className="ml-4">
                    Updated: {new Date(previewPost.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsPreviewOpen(false);
                  handleEditPost(previewPost);
                }}>
                  Edit Post
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
