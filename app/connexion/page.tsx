import AuthForm from "@/components/auth/AuthForm";
import LegalFooter from "@/components/legal/LegalFooter";

export const metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : "/";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-mark">C</div>
          <span>C-Cool</span>
        </div>

        <p className="section-label">Espace personnel</p>
        <h1>Apprendre ensemble, simplement.</h1>
        <p className="auth-intro">
          Connectez-vous pour accéder à votre travail, vos révisions et aux ressources de votre classe.
        </p>

        <AuthForm nextPath={nextPath} />
      </section>

      <LegalFooter compact />
    </main>
  );
}
