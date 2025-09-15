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
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Evolution of Professional Pool Tables",
    slug: "evolution-professional-pool-tables",
    author: "Wilson Moyi",
    date: "2024-01-15",
    status: "Published",
    views: 1247,
    readTime: "5 min read",
    excerpt: "Explore how professional pool tables have evolved over the decades, from traditional designs to modern innovations.",
    category: "History",
    featured: true,
  },
  {
    id: 2,
    title: "Choosing the Right Pool Table for Your Home",
    slug: "choosing-right-pool-table-home",
    author: "Wilson Moyi",
    date: "2024-01-10",
    status: "Published",
    views: 892,
    readTime: "7 min read",
    excerpt: "A comprehensive guide to selecting the perfect pool table that fits your space and budget.",
    category: "Buying Guide",
    featured: false,
  },
  {
    id: 3,
    title: "Pool Table Maintenance: Essential Tips",
    slug: "pool-table-maintenance-tips",
    author: "Wilson Moyi",
    date: "2024-01-08",
    status: "Draft",
    views: 0,
    readTime: "4 min read",
    excerpt: "Learn how to properly maintain your pool table to ensure it lasts for years to come.",
    category: "Maintenance",
    featured: false,
  },
  {
    id: 4,
    title: "Professional Pool Tournament Setup Guide",
    slug: "professional-tournament-setup",
    author: "Wilson Moyi",
    date: "2024-01-05",
    status: "Published",
    views: 634,
    readTime: "6 min read",
    excerpt: "Everything you need to know about setting up a professional pool tournament.",
    category: "Professional",
    featured: true,
  },
  {
    id: 5,
    title: "The Art of Pool Table Craftsmanship",
    slug: "art-pool-table-craftsmanship",
    author: "Wilson Moyi",
    date: "2024-01-03",
    status: "Scheduled",
    views: 0,
    readTime: "8 min read",
    excerpt: "Discover the intricate craftsmanship that goes into creating premium pool tables.",
    category: "Craftsmanship",
    featured: false,
  },
];

const categories = ["All", "History", "Buying Guide", "Maintenance", "Professional", "Craftsmanship"];

const postStats = [
  {
    title: "Total Posts",
    value: "24",
    change: "+3 this month",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Published",
    value: "18",
    change: "+2 this week",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Total Views",
    value: "12.4K",
    change: "+1.2K this month",
    icon: Eye,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    title: "Avg. Read Time",
    value: "6.2 min",
    change: "+0.3 min",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isBlogPostFormOpen, setIsBlogPostFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
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
    if (editingPost) {
      console.log('Update post:', postData);
    } else {
      console.log('Add new post:', postData);
    }
    setIsBlogPostFormOpen(false);
    setEditingPost(null);
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
        {postStats.map((stat, index) => (
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
        ))}
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
            {filteredPosts.map((post, index) => (
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
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views} views
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPost(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
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
    </div>
  );
}
