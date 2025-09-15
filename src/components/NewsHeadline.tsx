import { INewsHeadline } from "@/types/NewsHeadline";
import Link from "next/link";
import Image from "next/image";

export default function NewsHeadline({
  id,
  thumbnail,
  title,
  description,
  authorName,
  date,
  views,
}: INewsHeadline) {
  return (
    <Link
      href={"/news/read/" + id}
      className="transition-all hover:-translate-y-3 flex flex-col overflow-hidden h-fit w-[90%] border border-white/10 rounded-lg gap-[32px]"
    >
      {/* thumbnail */}
      <Image
        src={thumbnail}
        className="w-full h-[328px] object-cover"
        alt={title + " Thumbnail"}
        width={500}
        height={328}
      />

      {/* contents */}
      <div className="md:px-[33px] px-[20px] flex flex-col gap-[31px] pb-[34px]">
        {/* div-1 */}
        <div className="flex flex-col gap-[12px]">
          <h3 className="md:text-[30px] text-[23px] font-semibold">{title}</h3>
          <p className="text-[16px] text-white/80 md:w-[70%]">{description}</p>
        </div>

        {/* div-2 */}
        <div className="grid w-full grid-cols-2">
          {/* TODO: grid-col-2 */}
          <div className="flex flex-col gap-2">
            <h5 className="text-white/50">Written by</h5>
            <div className="flex items-center gap-2">
              <div className="size-[28px] rounded-full object-cover bg-gradient-to-br from-pink-500 to-yellow-500 animate-spin" />
              <span>{authorName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-white/50">Published on</h5>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
