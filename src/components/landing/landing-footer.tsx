"use client";

import Link from "next/link";
import { OrdoSymbol } from "@/components/ordo-mark";

export function LandingFooter() {
  return (
    <footer className="bg-[#1E0B10] text-stone-300 py-16 border-t border-[#521D2A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Coluna Marca e Posicionamento */}
          <div className="md:col-span-5 flex flex-col gap-4 text-left">
            <Link href="/ecossistema" className="flex items-center gap-3 group">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#521D2A] text-white shadow-md border border-[#B2966F]/40 group-hover:scale-105 transition-transform">
                <OrdoSymbol className="size-6 text-[#B2966F]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-[0.20em] text-white">
                  ORDO
                </span>
                <span className="text-[9px] tracking-wider text-stone-400 font-sans">
                  by Práxis Mentis
                </span>
              </div>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-sm">
              O ecossistema definitivo de gestão clínica, comercial e de relacionamento para psicólogos, neuropsicólogos e clínicas de saúde mental.
            </p>
            <p className="text-[11px] text-stone-500 font-sans">
              Desenvolvido com rigor ético e conformidade com o CFP e a LGPD.
            </p>
          </div>

          {/* Links Rápidos do Ecossistema */}
          <div className="md:col-span-3 flex flex-col gap-3 text-xs text-left">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-heading">
              O Ecossistema
            </span>
            <Link href="/ecossistema#pilares" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
              <span>💬</span>
              <span>ORDO CRM (WhatsApp & Vendas)</span>
            </Link>
            <Link href="/ecossistema#pilares" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
              <span>📝</span>
              <span>ORDO Forms (Captação & Triagem)</span>
            </Link>
            <Link href="/ecossistema#pilares" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
              <span>📋</span>
              <span>ORDO Manager (Prontuário & Finanças)</span>
            </Link>
            <Link href="/ecossistema#pilares" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
              <span>🤖</span>
              <span>ORDO Analytics (IA Clínica)</span>
            </Link>
          </div>

          {/* Planos e Acesso */}
          <div className="md:col-span-4 flex flex-col gap-3 text-xs text-left">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-heading">
              Planos & Contato
            </span>
            <Link href="/planos" className="text-[#B2966F] font-bold hover:underline flex items-center gap-1">
              <span>💎</span>
              <span>Tabela de Preços & Planos (-20% Anual) ↗</span>
            </Link>
            <Link href="/login" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1">
              <span>🔑</span>
              <span>Entrar no Sistema (Área do Cliente)</span>
            </Link>
            <a
              href="https://wa.me/5567999110001?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20Ecossistema%20ORDO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>🎧</span>
              <span>Suporte & Vendas via WhatsApp ↗</span>
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} ORDO CRM by Práxis Mentis. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/planos" className="hover:text-stone-300">Planos Oficiais</Link>
            <span>•</span>
            <Link href="/ecossistema#faq" className="hover:text-stone-300">Dúvidas Frequentes</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-stone-300">Acesso Restrito</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
