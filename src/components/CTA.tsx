import { Crown, Verified } from "lucide-react";
import Slideshow from "./Slideshow";

export default function CTA() {
  return (
    <div className="flex flex-col gap-[96px] items-center justify-center mt-[105px] md:mt-[90px]">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <h3 className="text-white leading-[30px] text-[30px] md:text-[52px] font-semibold flex flex-col md:flex-row items-center gap-1.5">
          It&apos;s as awesome as{" "}
          <span className="text-[#59d499] flex items-center justify-center gap-1">
            Winning{" "}
            <Verified className="w-[30px] h-[30px] md:w-[52px] md:h-[52px]" />
          </span>
        </h3>
        <p className="text-white/60 md:w-[60%] text-[12px] md:text-[18px] ">
          Say hello to the Store. A home for Extensions published by our
          community of Developers using our API. Find extensions to the tools
          you use in your day-to-day
        </p>
      </div>

      {/* Ad container */}
      <div
        className="flex flex-col md:flex-row gap-4 items-center justify-between w-[90%] mx-auto rounded-md p-[20px] md:p-[34px]"
        style={{
          background:
            "linear-gradient(105deg, #d35cae 0%, #5e1180 30%, #131649 80%)",
        }}
      >
        <div className="md:w-[40%] flex flex-col gap-[20px]">
          {/* icon card */}
          <div className="p-2 rounded-md w-fit h-fit bg-white/30">
            <Crown className="w-[40px] h-[40px]" />
          </div>
          <h3 className="text-[28px] font-semibold">One up the competition</h3>
          <p className="text-white/45 md:text-[17px] text-[15px]">
            At Moyi Billiards, we provide top-quality tables, gear, and expert
            services to help you stay ahead of the competition. Elevate your
            game with us.
          </p>
        </div>

        <div className="w-full">
          <Slideshow />
        </div>
      </div>
    </div>
  );
}
