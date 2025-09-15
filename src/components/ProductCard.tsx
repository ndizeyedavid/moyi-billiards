"use client";

import { useState } from "react";

import { HeartIcon, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface IProductCard {
  id: string;
  images: string[];
  featured: boolean;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
}

export default function ProductCard({
  id,
  images,
  featured,
  name,
  description,
  price,
  currency,
  category,
}: IProductCard) {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <div className="relative max-w-md rounded-xl pt-0">
      <div className="flex h-60 items-center justify-center shadow-lg">
        <Image
          src={images[0]}
          alt={name}
          width={400}
          height={240}
          className="w-full h-full object-cover rounded-[16px_16px_0_0]"
        />
      </div>
      {featured && (
        <Badge variant="secondary" className="absolute end-4 top-4">
          Featured
        </Badge>
      )}

      <Card className="border-none relative -top-5  shadow-lg">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline">{category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>{description}</CardContent>
        <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase">Price</span>
            <span className="text-xl font-semibold">
              {Number(price).toLocaleString()} {currency}
            </span>
          </div>
          <Link href={`/explore/${id}`}>
            <Button size="lg">More Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
