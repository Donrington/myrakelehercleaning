import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeSection from "@/components/MarqueeSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import EvidenceSection from "@/components/EvidenceSection";
import BookingSection from "@/components/BookingSection";
import FooterSection from "@/components/FooterSection";
import BookingTrigger from "@/components/BookingTrigger";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <EvidenceSection />
      <BookingSection />
      <FooterSection />
      <BookingTrigger />
      <BackToTop />
    </main>
  );
}
