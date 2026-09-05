import Navbar from "../../components/navbarCaregiver";

export default function HomeCaregiver() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="w-full bg-[#314878] px-6 py-10 sm:px-12 sm:py-16 md:px-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-normal leading-snug text-white sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl">
            Seja bem vindo <br className="block sm:hidden" />
            cuidador, ao <br className="block sm:hidden" />
            sistema de <br className="block sm:hidden" />
            cuidados: <br className="block sm:hidden" />
            Promederi
          </h1>
        </div>
      </main>
    </div>
  );
}