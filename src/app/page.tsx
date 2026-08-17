import { getSessionContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { EcosystemShowcase } from "@/components/landing/ecosystem-showcase";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { PricingCalculator } from "@/components/landing/pricing-calculator";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default async function HomePage() {
  const context = await getSessionContext();

  // Se o usuário já estiver logado no CRM, entra direto no Pipeline
  if (context) {
    redirect("/pipeline");
  }

  // Se for visitante público, apresenta a Landing Page Comercial do Ecossistema
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
