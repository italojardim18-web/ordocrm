import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { EcosystemShowcase } from "@/components/landing/ecosystem-showcase";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { PricingCalculator } from "@/components/landing/pricing-calculator";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Ecossistema ORDO by Práxis Mentis · Gestão clínica e comercial integrada",
  description:
    "O ecossistema completo para psicólogos, neuropsicólogos e clínicas: ORDO Forms, ORDO CRM, ORDO Manager e ORDO Analytics.",
};

export default function EcosystemPage() {
  return (
    <main className="min-h-screen bg-[#F2EEE7] selection:bg-[#521D2A] selection:text-[#F2EEE7]">
      <LandingNav activeTab="ecossistema" />
      <LandingHero />
      <EcosystemShowcase />
      <ComparisonSection />
      <PricingCalculator showAllSystems={false} />
      <TestimonialsSection />
      <FaqSection />
      <LandingFooter />
    </main>
  );
}
