"use client";

import * as React from "react";
import Image from "next/image";
import { getProducts } from "@/lib/actions/products";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: string;
  name: string;
  images: string[];
  price: any; // Using any to handle Decimal type from database
  currency: string;
  featured: boolean;
}

export default function Slideshow() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch products from database
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        if (response.success && response.data) {
          // Filter for featured products or products with images, limit to 6 for slideshow
          const productsWithImages = response.data.products
            .filter((product: any) => product.images && product.images.length > 0)
            .slice(0, 6);
          setProducts(productsWithImages);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const progress = count > 0 ? (current * 100) / count : 0;

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (loading) {
    return (
      <div className="mx-auto py-4">
        <div className="w-full max-w-4xl">
          <Card>
            <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden">
              <div className="animate-pulse bg-muted w-full h-full rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Loading products...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto py-4">
        <div className="w-full max-w-4xl">
          <Card>
            <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden">
              <div className="text-center">
                <p className="text-muted-foreground">No products with images found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-4">
      <Carousel setApi={setApi} className="w-full max-w-4xl">
        <CarouselContent>
          {products.map((product: Product, index: number) => (
            <CarouselItem key={product.id}>
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      priority={index === 0}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white text-lg font-semibold">
                        {product.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {Number(product.price).toLocaleString()} {product.currency}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-[calc(100%+0.5rem)] translate-y-0 left-0" />
        <CarouselNext className="top-[calc(100%+0.5rem)] translate-y-0 left-2 translate-x-full" />
      </Carousel>
      <Progress value={progress} className="mt-4 w-24 ml-auto" />
    </div>
  );
}
