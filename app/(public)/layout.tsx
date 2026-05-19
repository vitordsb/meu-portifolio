import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* Sidebar tem w-60 em lg+; topbar tem altura fixa em mobile.
          Aplico padding-left no lg+ pra não cobrir conteúdo. */}
      <div className="lg:pl-60">{children}</div>
    </>
  );
}
