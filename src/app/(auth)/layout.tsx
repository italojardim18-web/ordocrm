import { OrdoSymbol } from "@/components/ordo-mark";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-sidebar p-4">
      <main className="w-full max-w-sm">
        {/* Assinatura vertical: símbolo, wordmark e origem — nesta hierarquia. */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <OrdoSymbol className="size-14 text-primary-foreground" title="" />
          <div className="flex flex-col items-center">
            <h1 className="font-heading text-3xl tracking-[0.22em] text-primary-foreground font-bold">
              ORDO CRM
            </h1>
            <p className="mt-1.5 text-[0.625rem] tracking-[0.18em] text-primary-foreground/75">
              by Práxis mentis
            </p>
          </div>
        </div>
        {children}
      </main>
      <p className="mt-10 font-heading text-sm text-primary-foreground/70 italic">
        Tudo em seu lugar.
      </p>
    </div>
  );
}
