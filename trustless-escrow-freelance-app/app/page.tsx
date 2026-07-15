import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductMock } from "@/components/ProductMock";
import { HowItWorks } from "@/components/HowItWorks";
import { StackStrip } from "@/components/StackStrip";
import { ContributeCta } from "@/components/ContributeCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white text-ink">
      <Header />
      <Hero />
      <ProductMock />
      <HowItWorks />
      <StackStrip />
      <ContributeCta />
      <Footer />
    </main>
  );
}
