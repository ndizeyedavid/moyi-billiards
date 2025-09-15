import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function page() {
  return (
    <>
      <Header />
      <article className="md:w-[75%] px-5 mx-auto mt-[140px] flex flex-col gap-[46px] items-start justify-start">
        <>
          <header className="flex flex-col gap-6">
            <h1 className="md:text-[30px] text-[25px] font-semibold">
              {"Cecelia Ramirez"}
            </h1>

            <div className="mx-2 md:mx-7">
              <div className="flex items-center gap-4">
                <div className="size-[58px] rounded-full object-cover bg-gradient-to-br from-pink-500 to-yellow-500" />
                <div className="flex flex-col gap-1 text-white/90">
                  <span>
                    written by{" "}
                    <span className="text-[#f14d3a] cursor-pointer hover:opacity-90">
                      {"Mabelle Henderson"}
                    </span>
                  </span>
                  <time dateTime={"5/4/2070"}>{new Date().toDateString()}</time>
                </div>
              </div>
            </div>
          </header>

          <img
            src={"/tables/table1.png"}
            className="w-full md:h-[500px] h-[340px] rounded-md object-cover opacity-85 mb-7"
            alt={`${"name"} thumbnail`}
            width={1200}
            height={500}
            loading="eager"
          />

          <section
            className="space-y-7 prose-invert max-w-none text-[18px]"
            style={{ lineHeight: "36px" }}
            dangerouslySetInnerHTML={{
              __html:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat maiores rem sunt sint sequi quia minima. Consequatur aut incidunt expedita hic laborum quasi neque, qui iusto consequuntur maiores repellat veritatis quidem explicabo modi quia nulla suscipit dicta magni iste provident saepe at maxime? In excepturi exercitationem possimus asperiores voluptatum adipisci enim accusantium illo veniam eveniet nostrum, obcaecati molestiae aut natus dicta quidem, deleniti ut a blanditiis non quisquam voluptatibus molestias. Facere sit molestiae officiis ea expedita enim ipsa ipsam cupiditate rerum sunt maiores molestias rem, corrupti soluta recusandae quis quaerat ratione tempore optio. Quidem doloremque beatae et illum deserunt aspernatur.",
            }}
          />
        </>
      </article>
      <Footer />
    </>
  );
}
