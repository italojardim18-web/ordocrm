"use client";

import Link from "next/link";
import { BrandSignature } from "./landing-atoms";

const SISTEMAS = [
  { label: "ORDO CRM — conversa e vendas", href: "/ecossistema#pilares" },
  { label: "ORDO Forms — captação e triagem", href: "/ecossistema#pilares" },
  { label: "ORDO Manager — prontuário e finanças", href: "/ecossistema#pilares" },
  { label: "ORDO Analytics — inteligência clínica", href: "/ecossistema#pilares" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#F2EEE7]/12 bg-[#181716] py-20 text-[#F2EEE7]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-5">
            <Link href="/ecossistema" aria-label="ORDO by Práxis Mentis">
              <BrandSignature tone="light" />
            </Link>
            <p className="max-w-sm font-heading text-xl font-normal italic text-[#F2EEE7]/85">
              Tudo em seu lugar.
            </p>
            <p className="max-w-sm text-[13px] leading-relaxed text-[#F2EEE7]/55">
              Ecossistema de gestão clínica, comercial e de relacionamento para
              psicólogos, neuropsicólogos e clínicas de saúde mental.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:col-span-4">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B2966F]">
              O ecossistema
            </span>
            {SISTEMAS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] text-[#F2EEE7]/60 transition-colors hover:text-[#F2EEE7]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:col-span-3">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B2966F]">
              Planos e contato
            </span>
            <Link
              href="/planos"
              className="text-[13px] text-[#F2EEE7]/60 transition-colors hover:text-[#F2EEE7]"
            >
              Tabela de planos
            </Link>
            <a
              href="https://wa.me/5567999110001?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20Ecossistema%20ORDO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#F2EEE7]/60 transition-colors hover:text-[#F2EEE7]"
            >
              Suporte e vendas no WhatsApp
            </a>
            <Link
              href="/login"
              className="text-[13px] text-[#F2EEE7]/60 transition-colors hover:text-[#F2EEE7]"
            >
              Entrar no sistema
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[#F2EEE7]/12 pt-8 text-[11px] text-[#F2EEE7]/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ORDO by Práxis Mentis. Todos os direitos reservados.</p>
          <p>Desenvolvido em conformidade com o CFP e a LGPD.</p>
        </div>
      </div>
    </footer>
  );
}
