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
          <div className="flex flex-col items-center text-center">
            <h1 className="flex items-baseline gap-2 leading-none text-primary-foreground">
              <span className="font-heading text-4xl tracking-[0.24em] font-bold">
                ORDO
              </span>
              <span className="font-heading text-sm tracking-[0.14em] font-semibold opacity-85">
                CRM
              </span>
            </h1>
            <p className="mt-2 text-[0.6875rem] tracking-[0.2em] text-primary-foreground/75 font-sans font-medium text-center">
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
