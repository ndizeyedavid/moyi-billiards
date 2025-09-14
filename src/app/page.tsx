// @ts-ignore
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Header />
      <Hero />
      <CTA />

      <div className="mt-[205px] flex flex-col gap-[96px] items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center md:w-[60%] gap-3">
          <h3 className="text-white text-[33px] md:text-[52px] font-semibold leading-[46px] md:leading-[75px]">
            Where <span className="fun-stuff">Playing</span>
            <br />
            Meets <span className="fun-stuff">Perfection!</span>
          </h3>
          <p className="text-white/55">
            Say hello to the Store. A home for Extensions published by our
            community of Developers using our API. Find extensions to the tools
            you use in your day-to-day
          </p>
        </div>

        <div className="grid grid-rows-1 gap-5 md:grid-cols-3">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>

        <Link href="/explore">
          <Button className="flex items-center gap-2 hover:gap-4 px-[15px] py-2">
            <span>See More</span> <MoveRight className="relative top-[2px]" />
          </Button>
        </Link>
      </div>

      {/* <Footer /> */}
    </>
  );
}
