import ContactSection from "@/components/sections/ContactSection";

export const metadata = {
  title: "Contato | Vitor Barreto",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="pt-20 lg:pt-0 min-h-screen bg-surface text-on-surface">
      <ContactSection />
    </main>
  );
}
