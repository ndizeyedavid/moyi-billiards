"use client";

import * as React from "react";
import Image from "next/image";

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

export default function Slideshow() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Array of table images - you can add more images here as needed
  const tableImages = [
    {
      src: "/tables/table1.png",
      alt: "Billiard Table 1",
      title: "Premium Pool Table",
    },
    {
      src: "/tables/table2.webp",
      alt: "Billiard Table 2",
      title: "Classic Pool Table",
    },
    {
      src: "/tables/table3.png",
      alt: "Billiard Table 3",
      title: "Modern Pool Table",
    },
    {
      src: "/tables/table4.jpeg",
      alt: "Billiard Table 4",
      title: "Premium Pool Table",
    },
  ];

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

  return (
    <div className="mx-auto py-4">
      <Carousel setApi={setApi} className="w-full max-w-4xl">
        <CarouselContent>
          {tableImages.map((table, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={table.src}
                      alt={table.alt}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      priority={index === 0}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white text-lg font-semibold">
                        {table.title}
                      </h3>
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
