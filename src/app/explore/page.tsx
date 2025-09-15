import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default function page() {
  return (
    <>
      <Header />

      <div className="mt-[205px] flex flex-col gap-[96px] items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center md:w-[60%] gap-3">
          <h3 className="text-white text-[42px] md:text-[52px] font-semibold leading-[71px]">
            Put the <span className="fun-stuff">Fun</span>
            <br />
            into <span className="fun-stuff">Fun</span>tastic!
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
      </div>

      <Footer />
    </>
  );
}
