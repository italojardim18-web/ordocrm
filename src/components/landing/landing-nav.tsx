"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OrdoSymbol } from "@/components/ordo-mark";
import { cn } from "@/lib/utils";

export function LandingNav({ activeTab = "ecossistema" }: { activeTab?: "ecossistema" | "planos" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#291015]/95 backdrop-blur-md border-b border-[#521D2A]/60 py-3 shadow-xl"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Oficial ORDO by Práxis Mentis */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#521D2A] text-white shadow-md transition-transform group-hover:scale-105 border border-[#B2966F]/30">
            <OrdoSymbol className="size-6 text-[#B2966F]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-heading text-2xl font-bold tracking-[0.20em] text-white">
                ORDO
              </span>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-[#B2966F]">
                Ecossistema
              </span>
            </div>
            <span className="text-[9px] tracking-wider text-stone-300/80 font-sans mt-0.5">
              by Práxis Mentis
            </span>
          </div>
        </Link>

        {/* Links Centrais de Navegação */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/10 p-1.5 backdrop-blur-md border border-white/10 shadow-inner text-xs font-medium text-stone-200">
          <Link
            href="/"
            className={cn(
              "rounded-full px-4 py-2 transition-all",
              activeTab === "ecossistema"
                ? "bg-[#521D2A] text-white font-semibold shadow-xs border border-[#B2966F]/40"
                : "hover:bg-white/10 hover:text-white"
            )}
          >
            🏛️ O Ecossistema
          </Link>
          <a
            href="/#pilares"
            className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
          >
            🧩 Os 4 Sistemas
          </a>
          <a
            href="/#comparativo"
            className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
          >
            ⚖️ Comparativo
          </a>
          <Link
            href="/planos"
            className={cn(
              "rounded-full px-4 py-2 transition-all flex items-center gap-1.5",
              activeTab === "planos"
                ? "bg-[#521D2A] text-white font-semibold shadow-xs border border-[#B2966F]/40"
                : "hover:bg-white/10 hover:text-white"
            )}
          >
            <span>💎 Planos & Preços</span>
            <span className="rounded-full bg-[#B2966F] px-1.5 py-0.2 text-[9px] font-bold text-[#291015]">
              -20%
            </span>
          </Link>
          <a
            href="/#faq"
            className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
          >
            ❓ Dúvidas
          </a>
        </nav>

        {/* Ações Direitas (Login + CTA Começar) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-200 hover:text-white hover:bg-white/10 transition-all"
          >
            Entrar no Sistema
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#521D2A] to-[#722A3B] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#521D2A]/40 transition-all hover:scale-105 hover:shadow-xl border border-[#B2966F]/50"
          >
            <span>Começar Agora</span>
            <span>↗</span>
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden size-10 items-center justify-center rounded-xl bg-white/10 text-white"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#291015] border-b border-[#521D2A] px-4 py-4 flex flex-col gap-3 text-sm text-stone-200 animate-in fade-in slide-in-from-top-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">
            🏛️ O Ecossistema
          </Link>
          <a href="/#pilares" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">
            🧩 Os 4 Sistemas (Forms, CRM, Manager, Analytics)
          </a>
          <a href="/#comparativo" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">
            ⚖️ Comparativo de Rotina
          </a>
          <Link href="/planos" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5 flex items-center justify-between">
            <span>💎 Planos & Preços Oficiais</span>
            <span className="rounded bg-[#B2966F] px-2 py-0.5 text-xs font-bold text-[#291015]">-20% Anual</span>
          </Link>
          <a href="/#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">
            ❓ Perguntas Frequentes
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-xl border border-white/20 text-center py-2.5 text-xs font-semibold text-white"
            >
              Entrar no Sistema
            </Link>
            <Link
              href="/planos"
              className="rounded-xl bg-[#521D2A] text-center py-2.5 text-xs font-bold text-white shadow-md border border-[#B2966F]/50"
            >
              Ver Planos & Experimentar ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
