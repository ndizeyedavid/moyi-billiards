import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function page() {
  return (
    <>
      <Header />

      <div className="md:max-w-7xl w-[90%] mx-auto mt-[120px] mb-[90px]">
        <div className="">
          <h3 className="text-[50px] font-medium">Play</h3>
          <p className="text-xl font-normal text-white/80">
            Level up your skills with our online playground
          </p>
        </div>

        <div className="mt-[50px] rounded-lg overflow-hidden border border-white/10 flex flex-col gap-5">
          <div className="w-full h-[500px] thumbnail">
            <iframe
              src="https://www.onlinegames.io/games/2022/unity3/8-ball-pool-billiard/index.html"
              className="w-full h-full overflow-hidden rounded-md"
            ></iframe>
          </div>
          {/* <img src="/assets/pool1.jpg" className="w-full h-[500px] object-cover" width={500} height={500} alt="Game Preview" /> */}

          <div className="p-2 space-y-4">
            <h3 className="text-xl font-semibold">8 ball poll billiard</h3>
            <p className="text-base font-normal text-white/80">
              A game by Freenova.games
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
