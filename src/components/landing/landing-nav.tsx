"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandSignature } from "./landing-atoms";
import { cn } from "@/lib/utils";

const LINKS = [
  { key: "ecossistema", href: "/ecossistema", label: "O Ecossistema" },
  { key: "pilares", href: "/ecossistema#pilares", label: "Os 4 Sistemas" },
  { key: "comparativo", href: "/ecossistema#comparativo", label: "Comparativo" },
  { key: "planos", href: "/planos", label: "Planos" },
  { key: "faq", href: "/ecossistema#faq", label: "Dúvidas" },
] as const;

export function LandingNav({ activeTab = "ecossistema" }: { activeTab?: "ecossistema" | "planos" }) {
  const pathname = usePathname();
  const isPlanos = pathname.includes("/planos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollActive, setScrollActive] = useState<string>(
    activeTab === "planos" ? "planos" : "ecossistema"
  );

  // Na página de planos a seção ativa é derivada da rota, não do scroll.
  const currentActive = isPlanos ? "planos" : scrollActive;

  useEffect(() => {
    if (isPlanos) return;

    const sections = [
      { id: "faq", key: "faq" },
      { id: "precos", key: "planos" },
      { id: "comparativo", key: "comparativo" },
      { id: "pilares", key: "pilares" },
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      if (window.scrollY < 300) {
        setScrollActive("ecossistema");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setScrollActive(section.key);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPlanos]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#F2EEE7]/12 bg-[#291015]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/ecossistema" aria-label="ORDO by Práxis Mentis">
          <BrandSignature tone="light" />
        </Link>

        {/* Navegação: a linha em brass marca a seção ativa. Sem pílulas, sem vidro. */}
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setScrollActive(link.key)}
              className={cn(
                "relative py-1 text-[13px] tracking-wide transition-colors",
                currentActive === link.key
                  ? "text-[#F2EEE7]"
                  : "text-[#F2EEE7]/60 hover:text-[#F2EEE7]"
              )}
            >
              {link.label}
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-full origin-left bg-[#B2966F] transition-transform duration-300",
                  currentActive === link.key ? "scale-x-100" : "scale-x-0"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/login"
            className="text-[13px] text-[#F2EEE7]/60 transition-colors hover:text-[#F2EEE7]"
          >
            Entrar
          </Link>
          <Link
            href="/planos"
            className="rounded-lg border border-[#B2966F] px-5 py-2.5 text-[13px] font-medium text-[#B2966F] transition-colors hover:bg-[#B2966F] hover:text-[#291015]"
          >
            Ver planos
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex size-10 items-center justify-center rounded-lg border border-[#F2EEE7]/20 text-[#F2EEE7] md:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span aria-hidden className="flex flex-col gap-[5px]">
            <span
              className={cn(
                "block h-px w-5 bg-current transition-transform",
                mobileMenuOpen && "translate-y-[6px] rotate-45"
              )}
            />
            <span className={cn("block h-px w-5 bg-current", mobileMenuOpen && "opacity-0")} />
            <span
              className={cn(
                "block h-px w-5 bg-current transition-transform",
                mobileMenuOpen && "-translate-y-[6px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#F2EEE7]/12 bg-[#291015] px-6 py-2 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => {
                setScrollActive(link.key);
                setMobileMenuOpen(false);
              }}
              className={cn(
                "block border-b border-[#F2EEE7]/10 py-4 text-sm",
                currentActive === link.key ? "text-[#B2966F]" : "text-[#F2EEE7]/75"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 py-5">
            <Link
              href="/planos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-[#B2966F] py-3 text-center text-sm font-medium text-[#291015]"
            >
              Ver planos
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg border border-[#F2EEE7]/25 py-3 text-center text-sm text-[#F2EEE7]"
            >
              Entrar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
