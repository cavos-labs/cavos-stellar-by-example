import { AppHeader } from "@/components/app/AppHeader";
import { EscrowGatewayProvider } from "@/lib/domain/escrowGatewayProvider";

export default function ShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <EscrowGatewayProvider>
      <div className="min-h-screen bg-surface/40 text-ink">
        <AppHeader />
        <main className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-10 md:px-10">
          {children}
        </main>
      </div>
    </EscrowGatewayProvider>
  );
}
