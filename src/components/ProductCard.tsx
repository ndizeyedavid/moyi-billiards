"use client";

import { useState } from "react";

import { HeartIcon, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard() {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <div className="relative max-w-md rounded-xl pt-0">
      <div className="flex h-60 items-center justify-center shadow-lg">
        <Image
          src="/tables/table1.png"
          alt="Pool Table"
          width={400}
          height={240}
          className="w-full h-full object-cover rounded-[16px_16px_0_0]"
        />
      </div>
      <Badge variant="secondary" className="absolute end-4 top-4">
        EU38
      </Badge>

      <Card className="border-none relative -top-5  shadow-lg">
        <CardHeader>
          <CardTitle>Cotton wrapped billiard table</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline">EU38</Badge>
            <Badge variant="outline">Black and White</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Crossing hardwood comfort with off-court flair. &apos;80s-Inspired
            construction, bold details and nothin&apos;-but-net style.
          </p>
        </CardContent>
        <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase">Price</span>
            <span className="text-xl font-semibold">69,000,000 RWF</span>
          </div>
          <Link href={"/explore/2"}>
            <Button size="lg">More Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
