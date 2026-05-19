import ContactSection from "@/components/sections/ContactSection";

export const metadata = { title: "Contato | Vitor Barreto" };

export default function ContactPage() {
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-background text-foreground">
      <ContactSection />
    </main>
  );
}
