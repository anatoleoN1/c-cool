import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createEcoleDirecteCustomToken } from "@/lib/firebase/admin";
import { completeQcm } from "@/lib/ecoledirecte/client";
import { evaluateEcoleDirecteAccess } from "@/lib/ecoledirecte/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifiant?: string;
      motdepasse?: string;
      choice?: string;
    };

    const cookieStore = await cookies();

    /*
     * Toutes les informations sensibles de la session QCM
     * restent côté serveur.
     */
    const pendingToken =
      cookieStore.get(
        "c_cool_ed_pending_token",
      )?.value;

    const pendingTwoFaToken =
      cookieStore.get(
        "c_cool_ed_pending_2fa",
      )?.value;

    const pendingCookieRaw =
      cookieStore.get(
        "c_cool_ed_pending_cookie",
      )?.value;

    const pendingCookie = pendingCookieRaw
      ? decodeURIComponent(pendingCookieRaw)
      : undefined;

    if (
      !body.identifiant?.trim() ||
      !body.motdepasse ||
      !pendingToken ||
      !pendingTwoFaToken ||
      !pendingCookie ||
      !body.choice
    ) {
      return NextResponse.json(
        {
          error: "Données QCM incomplètes.",
        },
        { status: 400 },
      );
    }

    /*
     * Réponse au QCM puis re-login École Directe.
     */
    const result = await completeQcm(
      body.identifiant.trim(),
      body.motdepasse,
      pendingToken,
      pendingTwoFaToken,
      pendingCookie,
      body.choice,
    );

    const account = result.account;

    const uid = `ed_${account.codeOgec}_${account.id}`;
    const access = evaluateEcoleDirecteAccess(account);

    const customToken =
      await createEcoleDirecteCustomToken(
        uid,
        account.codeOgec,
        String(account.id),
        account.typeCompte,
        access.allowed,
        access.role,
        access.schoolId,
      );

    const response = NextResponse.json({
      customToken,
      user: {
        uid,
        displayName:
          [account.prenom, account.nom]
            .filter(Boolean)
            .join(" ") ||
          account.identifiant ||
          "Élève",
        email: account.email || null,
        schoolId: account.codeOgec,
        schoolRne: account.profile?.rneEtablissement || "",
        schoolName:
          account.nomEtablissement ||
          "Établissement",
        edStudentId: account.id,
        classId: account.profile?.classe?.id,
        classCode: account.profile?.classe?.code,
        className:
          account.profile?.classe?.libelle ||
          account.profile?.classe?.code ||
          undefined,
        accessGranted: access.allowed,
        role: access.role,
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    /*
     * Les informations temporaires du QCM ne sont
     * plus nécessaires après le re-login.
     */
    response.cookies.set(
      "c_cool_ed_pending_token",
      "",
      {
        ...cookieOptions,
        maxAge: 0,
      },
    );

    response.cookies.set(
      "c_cool_ed_pending_2fa",
      "",
      {
        ...cookieOptions,
        maxAge: 0,
      },
    );

    response.cookies.set(
      "c_cool_ed_pending_cookie",
      "",
      {
        ...cookieOptions,
        maxAge: 0,
      },
    );

    /*
     * Session École Directe définitive.
     */
    response.cookies.set(
      "c_cool_ed_token",
      result.token,
      {
        ...cookieOptions,
        maxAge: 604800,
      },
    );

    response.cookies.set(
      "c_cool_ed_student",
      String(account.id),
      {
        ...cookieOptions,
        maxAge: 604800,
      },
    );

    response.cookies.set(
      "c_cool_ed_school",
      account.codeOgec,
      {
        ...cookieOptions,
        maxAge: 604800,
      },
    );
    response.cookies.set("c_cool_ed_role", access.role, { ...cookieOptions, maxAge: 604800 });
    response.cookies.set("c_cool_ed_account_type", account.typeCompte, { ...cookieOptions, maxAge: 604800 });

    response.cookies.set(
      "c_cool_ed_school_name",
      account.profile?.nomEtablissement || account.nomEtablissement || "",
      { ...cookieOptions, maxAge: 604800 },
    );
    response.cookies.set(
      "c_cool_ed_school_id",
      account.profile?.idEtablissement || account.profile?.rneEtablissement || account.codeOgec || "",
      { ...cookieOptions, maxAge: 604800 },
    );
    response.cookies.set(
      "c_cool_ed_school_rne",
      account.profile?.rneEtablissement || "",
      { ...cookieOptions, maxAge: 604800 },
    );
    response.cookies.set(
      "c_cool_ed_class_id",
      String(account.profile?.classe?.id ?? ""),
      { ...cookieOptions, maxAge: 604800 },
    );
    response.cookies.set(
      "c_cool_ed_class_code",
      account.profile?.classe?.code || "",
      { ...cookieOptions, maxAge: 604800 },
    );
    response.cookies.set(
      "c_cool_ed_class_name",
      account.profile?.classe?.libelle || account.profile?.classe?.code || "",
      { ...cookieOptions, maxAge: 604800 },
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Validation QCM impossible.",
      },
      { status: 401 },
    );
  }
}
