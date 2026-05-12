import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import PopularCourses from "@/components/landing/PopularCourses";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PopularCourses />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}