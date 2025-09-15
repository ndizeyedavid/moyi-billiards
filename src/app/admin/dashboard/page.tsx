import { motion } from "framer-motion";
import {
  ShoppingBag,
  FileText,
  MessageSquare,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  Settings,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  getDashboardStats, 
  getRecentProducts, 
  getRecentBlogPosts, 
  getRecentContacts 
} from "@/lib/actions/dashboard";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, products, posts, contacts] = await Promise.all([
          getDashboardStats(),
          getRecentProducts(3),
          getRecentBlogPosts(3),
          getRecentContacts(3)
        ]);

        setDashboardData(stats);
        setRecentProducts(products);
        setRecentPosts(posts);
        setRecentContacts(contacts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardStats = dashboardData ? [
    {
      title: "Total Products",
      value: dashboardData.totalProducts.toString(),
      change: `${dashboardData.activePosts} active`,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Blog Posts",
      value: dashboardData.totalBlogPosts.toString(),
      change: `${dashboardData.publishedPosts} published`,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Contact Forms",
      value: dashboardData.totalContacts.toString(),
      change: `${dashboardData.newContacts} new`,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Team Members",
      value: dashboardData.totalTeamMembers.toString(),
      change: "Active team",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              dashboardStats.map((stat, index) => (
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

          {/* Content Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Recent Products</TabsTrigger>
              <TabsTrigger value="posts">Recent Posts</TabsTrigger>
              <TabsTrigger value="contacts">Contact Forms</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                      ))
                    ) : recentProducts.length > 0 ? (
                      recentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="object-cover rounded-lg"
                                />
                              ) : (
                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {product.price.toLocaleString()} RWF
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(product.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                product.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {product.status}
                            </Badge>
                            <Link href={`/admin/dashboard/products`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No products found. Create your first product!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Blog Post Management</CardTitle>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Post
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                      ))
                    ) : recentPosts.length > 0 ? (
                      recentPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{post.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                By {post.author} • {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">
                                  {post.readTime ? `${post.readTime} min read` : 'Draft'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                post.status === "Published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {post.status}
                            </Badge>
                            <Link href={`/admin/dashboard/posts`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No blog posts found. Create your first post!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                              <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                      ))
                    ) : recentContacts.length > 0 ? (
                      recentContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{contact.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {contact.email}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                {contact.subject}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(contact.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                contact.status === "New"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {contact.status}
                            </Badge>
                            <Link href={`/admin/dashboard/contacts`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No contact submissions found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
