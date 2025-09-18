"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Package,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Filter,
  Eye,
  Star,
  Upload,
  Save,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Camera,
  FileText,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const quickStartSteps = [
    {
      icon: Package,
      title: "Add Your First Product",
      description:
        "Start by adding pool tables to your inventory with detailed specifications and multiple images.",
      action: "Go to Products → Add New Product",
    },
    {
      icon: Users,
      title: "Manage Team Members",
      description:
        "Add your staff members with roles and permissions to collaborate effectively.",
      action: "Go to Team → Add Team Member",
    },
    {
      icon: MessageSquare,
      title: "Handle Customer Inquiries",
      description:
        "Respond to customer contacts and track communication history.",
      action: "Go to Contacts → View Messages",
    },
    {
      icon: BarChart3,
      title: "Monitor Performance",
      description:
        "Check your dashboard analytics to track business metrics and growth.",
      action: "View Dashboard Overview",
    },
  ];

  const features = [
    {
      category: "Product Management",
      icon: Package,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
      items: [
        {
          title: "Add Products",
          description:
            "Create detailed product listings with specifications, pricing, and multiple images",
          tips: [
            "Use high-quality images (up to 5 per product)",
            "Include detailed specifications",
            "Set appropriate categories and status",
          ],
        },
        {
          title: "Edit Products",
          description:
            "Update existing products with new information, prices, or images",
          tips: [
            "Click the edit icon on any product card",
            "All existing data pre-fills for easy updates",
            "Changes are saved immediately",
          ],
        },
        {
          title: "Inventory Tracking",
          description: "Monitor stock levels and get alerts for low inventory",
          tips: [
            "Set stock quantities accurately",
            "Monitor low stock alerts",
            "Update inventory regularly",
          ],
        },
        {
          title: "Product Categories",
          description:
            "Organize products by type: Professional, Standard, Premium, Compact",
          tips: [
            "Choose appropriate categories",
            "Use consistent naming",
            "Filter by category for easy management",
          ],
        },
      ],
    },
    {
      category: "Team Management",
      icon: Users,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20",
      items: [
        {
          title: "Add Team Members",
          description:
            "Register staff with personal and professional information",
          tips: [
            "Include emergency contacts",
            "Set clear roles and departments",
            "Upload profile photos",
          ],
        },
        {
          title: "Role Management",
          description: "Assign roles and permissions based on responsibilities",
          tips: [
            "Define clear role boundaries",
            "Regular permission reviews",
            "Document role responsibilities",
          ],
        },
        {
          title: "Performance Tracking",
          description: "Monitor team activity and performance metrics",
          tips: [
            "Track last active times",
            "Monitor task completion",
            "Provide regular feedback",
          ],
        },
      ],
    },
    {
      category: "Customer Communications",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20",
      items: [
        {
          title: "Contact Management",
          description:
            "Handle customer inquiries and support requests efficiently",
          tips: [
            "Respond promptly to new messages",
            "Use priority levels effectively",
            "Track conversation history",
          ],
        },
        {
          title: "Reply System",
          description: "Send professional responses with scheduling options",
          tips: [
            "Use templates for common responses",
            "Schedule sends for optimal timing",
            "Always send copies to yourself",
          ],
        },
        {
          title: "Status Tracking",
          description: "Monitor inquiry progress from new to closed",
          tips: [
            "Update status regularly",
            "Use categories for organization",
            "Follow up on pending items",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin Help Center</h1>
                  <p className="text-muted-foreground">
                    Complete guide to using your Moyi Billiards dashboard
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <BookOpen className="h-3 w-3" />
              User Guide
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={
                    activeSection === "getting-started" ? "default" : "ghost"
                  }
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection("getting-started")}
                >
                  <Target className="h-4 w-4" />
                  Getting Started
                </Button>
                <Button
                  variant={activeSection === "features" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection("features")}
                >
                  <Package className="h-4 w-4" />
                  Features Guide
                </Button>
                <Button
                  variant={activeSection === "tips" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection("tips")}
                >
                  <Lightbulb className="h-4 w-4" />
                  Tips & Tricks
                </Button>
                <Button
                  variant={activeSection === "examples" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSection("examples")}
                >
                  <Camera className="h-4 w-4" />
                  Visual Examples
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <HelpCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">
                        Welcome to Your Admin Dashboard!
                      </h2>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        This comprehensive guide will help you master every
                        aspect of your Moyi Billiards admin dashboard. From
                        managing products and team members to handling customer
                        communications, we'll walk you through each feature with
                        detailed explanations and helpful tips.
                      </p>
                      <div className="flex gap-3">
                        {/* <Button className="gap-2" onClick={() => setActiveSection("getting-started")}>
                          <Target className="h-4 w-4" />
                          Start Learning
                        </Button> */}
                        <Link
                          href="https://drive.google.com/file/d/1Nocwelyf4eLmK0tHvVMnMs3hjzKwR6tj/view?usp=drive_link"
                          target="_blank"
                        >
                          <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Download PDF Guide
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Start Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-green-600" />
                    <div>
                      <CardTitle>Quick Start Guide</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get up and running in 4 simple steps
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickStartSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg border bg-card"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <step.icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {step.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {step.action}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle>Features Overview</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Detailed guide to all dashboard features
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {features.map((feature, index) => (
                      <AccordionItem
                        key={index}
                        value={`feature-${index}`}
                        className="border rounded-lg"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${feature.color}`}>
                              <feature.icon className="h-5 w-5" />
                            </div>
                            <span className="font-semibold">
                              {feature.category}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {feature.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="border-l-2 border-muted pl-4"
                              >
                                <h4 className="font-medium mb-2">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {item.description}
                                </p>
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">
                                    💡 Pro Tips:
                                  </p>
                                  {item.tips.map((tip, tipIndex) => (
                                    <p
                                      key={tipIndex}
                                      className="text-xs text-muted-foreground pl-4"
                                    >
                                      • {tip}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Visual Examples Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Camera className="h-6 w-6 text-purple-600" />
                    <div>
                      <CardTitle>Visual Examples & Screenshots</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Step-by-step visual guides for common tasks
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Example placeholders for screenshots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">
                        How to Add a New Product
                      </h4>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                        <Image
                          src="/help/product-form.png"
                          alt="Product Form"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Dashboard Overview</h4>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                        <Image
                          src="/help/dashboard-overview.png"
                          alt="Dashboard Overview"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Managing Team Members</h4>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                        <Image
                          src="/help/team-members.png"
                          alt="Team Members"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">
                        Handling Customer Contacts
                      </h4>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                        <Image
                          src="/help/contact-form.png"
                          alt="Customer Contacts"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tips & Best Practices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                    <div>
                      <CardTitle>Tips & Best Practices</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Expert recommendations for optimal dashboard usage
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-700 dark:text-green-400">
                        ✅ Do's
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>
                            Upload high-quality product images (minimum 1200px
                            width)
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>
                            Update inventory levels regularly to avoid
                            overselling
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>
                            Respond to customer inquiries within 24 hours
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>
                            Use detailed product descriptions with
                            specifications
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>
                            Set up team member profiles with clear roles
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-700 dark:text-red-400">
                        ❌ Don'ts
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>
                            Don't delete products with existing orders
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>
                            Don't use low-quality or blurry product images
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>Don't ignore low stock alerts</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>
                            Don't leave customer messages unread for days
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>
                            Don't forget to backup important data regularly
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
                    <p className="text-muted-foreground mb-6">
                      Can't find what you're looking for? Our support team is
                      here to help you succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="mailto:davidndizeye101@gmail.com">
                        <Button className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
