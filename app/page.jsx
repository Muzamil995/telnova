import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import BundlesSection from "@/components/landing/BundlesSection";
import WhyUsSection from "@/components/landing/WhyUsSection";
import ProvidersSection from "@/components/landing/ProvidersSection";
import FAQSection from "@/components/landing/FAQSection";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import { C, BD } from "@/components/landing/tokens";

export default function Home() {
  return (
    <div style={{ ...BD, backgroundColor: C.surface, color: C.onSurface }}>
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <ServicesSection />
        <BundlesSection />
        <WhyUsSection />
        <ProvidersSection />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
