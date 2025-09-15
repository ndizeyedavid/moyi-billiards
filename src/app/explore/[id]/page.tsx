"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  Award,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock product data - in a real app, this would come from an API or database
const getProductById = (id: string) => {
  const products = {
    "1": {
      id: "1",
      name: "Premium Cotton Wrapped Billiard Table",
      price: "69,000,000 RWF",
      originalPrice: "75,000,000 RWF",
      discount: "8% OFF",
      rating: 4.8,
      reviewCount: 24,
      inStock: true,
      category: "Pool Tables",
      brand: "Moyi Billiards",
      images: [
        "/tables/table1.png",
        "/tables/table2.webp",
        "/tables/table3.png",
        "/tables/table4.jpeg",
      ],
      description:
        "Professional-grade billiard table with premium cotton wrapping. Perfect for tournaments and serious players. Features precision-engineered slate bed and championship-quality cushions.",
      features: [
        "Premium cotton cloth surface",
        "3-piece slate bed construction",
        "Championship rubber cushions",
        "Solid hardwood frame",
        "Professional pocket design",
        "Adjustable leg levelers",
      ],
      specifications: {
        Dimensions: "9ft x 4.5ft (2.74m x 1.37m)",
        "Playing Surface": "8ft x 4ft (2.44m x 1.22m)",
        Height: "32 inches (81cm)",
        Weight: "850 lbs (385kg)",
        "Slate Thickness": "1 inch (25mm)",
        "Cloth Material": "Premium Cotton Blend",
        "Frame Material": "Solid Oak Wood",
        "Pocket Style": "Drop pockets with leather nets",
      },
      supplier: {
        name: "Moyi Billiards Rwanda",
        phone: "+250788123456",
        whatsappMessage:
          "Hello! I'm interested in the Premium Cotton Wrapped Billiard Table (Product ID: 1). Could you please provide more information about availability and delivery?",
      },
    },
  };

  return products[id as keyof typeof products] || null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // In a real app, you'd await the params and fetch data
  const product = getProductById("1"); // Using "1" as default for demo

  if (!product) {
    notFound();
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(product.supplier.whatsappMessage);
    const whatsappUrl = `https://wa.me/${product.supplier.phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background pt-24 mt-[30px] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link
              href="/explore"
              className="hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      index === currentImageIndex
                        ? "border-rose-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge
                    variant="outline"
                    className="text-rose-600 border-rose-600"
                  >
                    {product.discount}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {product.price}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.inStock ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <Link href={"https://wa.me/250790194868"}>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                      disabled={!product.inStock}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Contact Supplier on WhatsApp
                    </Button>
                  </Link>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      {isLiked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-rose-600" />
                    <p className="text-xs text-muted-foreground">
                      Free Delivery
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-rose-600" />
                    <p className="text-xs text-muted-foreground">Warranty</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-rose-600" />
                    <p className="text-xs text-muted-foreground">Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-border last:border-0"
                          >
                            <span className="font-medium text-muted-foreground">
                              {key}
                            </span>
                            <span className="text-foreground">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
