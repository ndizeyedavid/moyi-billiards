import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsHeadline from "@/components/NewsHeadline";

export default function page() {
  return (
    <>
      <Header />
      <main className="md:w-[75%] px-4 mx-auto md:mt-[150px] mt-[40px] flex flex-col gap-[96px] items-start justify-start">
        <header className="flex flex-col items-start justify-start gap-3 text-left">
          <h1 className="text-white text-[42px] md:text-[52px] font-semibold leading-[71px]">
            News
          </h1>
          <p className="text-white/55">
            We&apos;ve got amazing announcements plus great sport news
          </p>
        </header>

        <section
          className="flex flex-col items-center gap-[64px]"
          aria-label="News articles"
        >
          <NewsHeadline
            // key={news.$id}
            id={"1wsasd"}
            title={"Mellow me"}
            description={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro quod, velit doloremque dolorem dolores, voluptate, quibusdam ipsam ratione excepturi perspiciatis dicta eius soluta. Labore iste cupiditate asperiores aut doloribus excepturi."
            }
            thumbnail={"/tables/table1.png"}
            authorName={"Wilison Moyi"}
            date={new Date().toDateString()}
            views={19}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
