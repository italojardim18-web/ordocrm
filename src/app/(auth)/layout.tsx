export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-primary p-4">
      <main className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-light tracking-[0.3em] text-primary-foreground uppercase">
          Praxis Mentis
        </h1>
        {children}
      </main>
      <p className="mt-8 text-xs text-primary-foreground/60">
        CRM para operações comerciais por conversa
      </p>
    </div>
  );
}
