import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingCalculator } from "@/components/landing/pricing-calculator";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ArcField, Rule, SectionLabel } from "@/components/landing/landing-atoms";

export const metadata: Metadata = {
  title: "Planos e preços · Ecossistema ORDO by Práxis Mentis",
  description:
    "Tabela completa e transparente de planos do ORDO Forms, ORDO CRM, ORDO Manager e do Combo Ecossistema PRO.",
};

export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-[#F2EEE7] selection:bg-[#521D2A] selection:text-[#F2EEE7]">
      <LandingNav activeTab="planos" />

      <section className="relative overflow-hidden bg-[#291015] pt-36 pb-20 text-[#F2EEE7]">
        <ArcField />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionLabel>Estrutura comercial</SectionLabel>
            <h1 className="mt-8 font-heading text-4xl font-normal leading-[1.1] tracking-tight text-[#F2EEE7] sm:text-5xl">
              Cada sistema tem
              <br />
              seu preço. Sem asterisco.
            </h1>
            <div className="mt-8 max-w-md">
              <Rule className="bg-[#B2966F]/40" />
            </div>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#F2EEE7]/70">
              Adquira módulos avulsos conforme o momento do consultório, ou reúna tudo
              no Combo Ecossistema ORDO PRO com 20% de desconto no plano anual.
            </p>
          </div>
        </div>
      </section>

      <PricingCalculator showAllSystems={true} />

      {/* Garantia — afirmação editorial, sem selo nem emoji. */}
      <section className="border-y border-[#181716]/10 bg-white py-20 text-[#181716]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-2xl font-normal leading-snug text-[#291015] sm:text-3xl">
              Sete dias para
              <br />
              mudar de ideia.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm leading-relaxed text-[#181716]/70">
              Experimente qualquer plano do ecossistema. Se nos primeiros sete dias
              você sentir que ele não atende à rotina da sua clínica, devolvemos 100%
              do valor pago. Sem perguntas e sem burocracia.
            </p>
          </div>
        </div>
      </section>

      <FaqSection />
      <LandingFooter />
    </main>
  );
}
