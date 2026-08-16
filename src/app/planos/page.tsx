import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingCalculator } from "@/components/landing/pricing-calculator";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Planos & Preços Oficiais · Ecossistema ORDO by Práxis Mentis",
  description:
    "Tabela completa e transparente de planos e preços do ORDO Forms, ORDO CRM, ORDO Manager e Combo Ecossistema PRO.",
};

export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F6] selection:bg-[#521D2A] selection:text-white pt-16">
      <LandingNav activeTab="planos" />

      {/* Header Superior da Página de Preços */}
      <section className="bg-gradient-to-b from-[#291015] to-[#3B151F] py-20 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge className="bg-[#B2966F] text-[#291015] text-xs px-3 py-1 mb-4 font-bold">
            Transparência & Liberdade de Escolha
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-stone-100">
            Estrutura Comercial & Planos Oficiais
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-300 font-sans max-w-2xl mx-auto">
            Adquira módulos individuais de acordo com o momento do seu consultório ou economize com a integração total do <strong>Combo Ecossistema ORDO PRO</strong>.
          </p>
        </div>
      </section>

      {/* Tabela Interativa Completa */}
      <PricingCalculator showAllSystems={true} />

      {/* Garantia de 7 Dias em Destaque */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-4xl">🛡️</span>
          <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#291015]">
            Garantia Incondicional de 7 Dias
          </h2>
          <p className="mt-2 text-sm text-stone-600 font-sans max-w-xl">
            Experimente qualquer plano do ecossistema ORDO. Se nos primeiros 7 dias você sentir que ele não atende à rotina da sua clínica, você recebe 100% do seu dinheiro de volta. Sem perguntas.
          </p>
        </div>
      </section>

      <FaqSection />
      <LandingFooter />
    </main>
  );
}
