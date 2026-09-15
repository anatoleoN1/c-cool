import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="app-shell">
      <Sidebar />

      <section className="content">
        <header className="topbar">
          <MobileMenu />

          <div className="topbar-title">
            <p className="eyebrow">C-Cool</p>
            <h1>Ma classe</h1>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
