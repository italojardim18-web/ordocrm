"use client";

import { useState } from "react";
import Link from "next/link";
import { OrdoSymbol } from "@/components/ordo-mark";
import { cn } from "@/lib/utils";

export function LandingNav({ activeTab = "ecossistema" }: { activeTab?: "ecossistema" | "planos" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#291015] border-b border-[#521D2A] py-3.5 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Oficial ORDO by Práxis Mentis */}
        <Link href="/ecossistema" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#521D2A] text-white shadow-md transition-transform group-hover:scale-105 border border-[#B2966F]/40">
            <OrdoSymbol className="size-6 text-[#B2966F]" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-heading text-2xl font-bold tracking-[0.20em] text-white">
                ORDO
              </span>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-[#B2966F]">
                Ecossistema
              </span>
            </div>
            <span className="text-[9px] tracking-wider text-stone-300 font-sans mt-0.5">
              by Práxis Mentis
            </span>
          </div>
        </Link>

        {/* Links Centrais de Navegação */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full bg-white/10 p-1.5 backdrop-blur-md border border-white/15 shadow-inner text-xs font-semibold text-stone-200">
          <Link
            href="/ecossistema"
            className={cn(
              "rounded-full px-4 py-2 transition-all",
              activeTab === "ecossistema"
                ? "bg-[#521D2A] text-white font-bold shadow-xs border border-[#B2966F]/50"
                : "hover:bg-white/10 hover:text-white"
            )}
          >
            🏛️ O Ecossistema
          </Link>
          <Link
            href="/ecossistema#pilares"
            className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
          >
            🧩 Os 4 Sistemas
          </Link>
          <Link
            href="/ecossistema#comparativo"
            className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
          >
            ⚖️ Comparativo
          </Link>
          <Link
            href="/planos"
            className={cn(
              "rounded-full px-4 py-2 transition-all flex items-center gap-1.5",
              activeTab === "planos"
                ? "bg-[#521D2A] text-white font-bold shadow-xs border border-[#B2966F]/50"
                : "hover:bg-white/10 hover:text-white"
            )}
          >
            <span>💎 Planos & Preços</span>
            <span className="rounded-full bg-[#B2966F] px-1.5 py-0.2 text-[9px] font-black text-[#291015]">
              -20%
            </span>
          </Link>
          <Link
            href="/ecossistema#faq"
            className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
          >
            ❓ Dúvidas
          </Link>
        </nav>

        {/* Ações Direitas (Login + CTA Começar) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-200 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
          >
            Entrar no Sistema
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B2966F] via-[#C9B18F] to-[#B2966F] px-5 py-2.5 text-xs font-bold text-[#291015] shadow-lg shadow-black/40 transition-all hover:scale-105 hover:shadow-xl border border-[#B2966F]"
          >
            <span>Começar Agora</span>
            <span>↗</span>
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden size-10 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#291015] border-t border-[#521D2A] mt-3 px-4 py-4 flex flex-col gap-3 text-sm text-stone-200 animate-in fade-in slide-in-from-top-4">
          <Link href="/ecossistema" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-white/10">
            🏛️ O Ecossistema
          </Link>
          <Link href="/ecossistema#pilares" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-white/10">
            🧩 Os 4 Sistemas (Forms, CRM, Manager, Analytics)
          </Link>
          <Link href="/ecossistema#comparativo" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-white/10">
            ⚖️ Comparativo de Rotina
          </Link>
          <Link href="/planos" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-white/10 flex items-center justify-between">
            <span>💎 Planos & Preços Oficiais</span>
            <span className="rounded bg-[#B2966F] px-2 py-0.5 text-xs font-bold text-[#291015]">-20% Anual</span>
          </Link>
          <Link href="/ecossistema#faq" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-white/10">
            ❓ Perguntas Frequentes
          </Link>
          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="rounded-xl border border-white/20 text-center py-3 text-xs font-semibold text-white bg-white/5"
            >
              Entrar no Sistema
            </Link>
            <Link
              href="/planos"
              className="rounded-xl bg-gradient-to-r from-[#B2966F] to-[#C9B18F] text-center py-3 text-xs font-bold text-[#291015] shadow-md border border-[#B2966F]"
            >
              Ver Planos & Experimentar ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
