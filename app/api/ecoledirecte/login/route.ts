import { NextResponse } from "next/server";
import { createEcoleDirecteCustomToken } from "@/lib/firebase/admin";
import { login } from "@/lib/ecoledirecte/client";
import { evaluateEcoleDirecteAccess } from "@/lib/ecoledirecte/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function responseFor(
  account: {
    id: number;
    codeOgec: string;
    typeCompte: string;
    prenom?: string;
    nom?: string;
    identifiant?: string;
    email?: string;
    nomEtablissement?: string;
    profile?: {
      classe?: {
        id?: number;
        code?: string;
        libelle?: string;
      };
    };
  },
  customToken: string,
  access: { allowed: boolean; isAdmin: boolean },
) {
  const uid = `ed_${account.codeOgec}_${account.id}`;

  return {
    customToken,
    user: {
      uid,
      displayName:
        [account.prenom, account.nom].filter(Boolean).join(" ") ||
        account.identifiant ||
        "Élève",
      email: account.email || null,
      schoolId: account.codeOgec,
      schoolName: account.nomEtablissement || "Établissement",
      edStudentId: account.id,
      classId: account.profile?.classe?.id,
      classCode: account.profile?.classe?.code,
      className: account.profile?.classe?.libelle || account.profile?.classe?.code || undefined,
      accessGranted: access.allowed,
      role: access.isAdmin ? "admin" : "student",
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifiant?: string;
      motdepasse?: string;
    };

    if (!body.identifiant?.trim() || !body.motdepasse) {
      return NextResponse.json(
        {
          error: "Identifiant et mot de passe requis.",
        },
        { status: 400 },
      );
    }

    const result = await login(
      body.identifiant.trim(),
      body.motdepasse,
    );

    /*
     * École Directe demande une vérification QCM.
     *
     * On conserve côté serveur :
     * - le token JSON initial ;
     * - le 2FA-Token ;
     * - les cookies de session.
     *
     * Aucun de ces éléments n'est exposé au navigateur.
     */
    if (result.kind === "qcm") {
      const response = NextResponse.json({
        requiresQcm: true,
        question: result.question,
        propositions: result.propositions,
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 600,
      };

      response.cookies.set(
        "c_cool_ed_pending_token",
        result.token,
        cookieOptions,
      );

      response.cookies.set(
        "c_cool_ed_pending_2fa",
        result.twoFaToken,
        cookieOptions,
      );

      response.cookies.set(
        "c_cool_ed_pending_cookie",
        encodeURIComponent(result.cookie),
        cookieOptions,
      );

      return response;
    }

    /*
     * Connexion directe réussie sans QCM.
     */
    const account = result.account;

    const uid = `ed_${account.codeOgec}_${account.id}`;
    const access = evaluateEcoleDirecteAccess(account);

    const customToken = await createEcoleDirecteCustomToken(
      uid,
      account.codeOgec,
      String(account.id),
      account.typeCompte,
      access.allowed,
      access.isAdmin,
    );

    const response = NextResponse.json(
      responseFor(account, customToken, access),
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 604800,
    };

    response.cookies.set(
      "c_cool_ed_token",
      result.token,
      cookieOptions,
    );

    response.cookies.set(
      "c_cool_ed_student",
      String(account.id),
      cookieOptions,
    );

    response.cookies.set(
      "c_cool_ed_school",
      account.codeOgec,
      cookieOptions,
    );

    return response;
  } catch (error) {
    const status =
      error instanceof Error && "status" in error
        ? Number(
            (error as { status: number }).status,
          )
        : 502;

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Connexion EcoleDirecte impossible.",
      },
      {
        status:
          status >= 400 && status < 600
            ? status
            : 502,
      },
    );
  }
}
