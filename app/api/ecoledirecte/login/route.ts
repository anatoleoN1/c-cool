import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { login } from "@/lib/ecoledirecte/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function responseFor(account: {
  id: number; codeOgec: string; typeCompte: string; prenom?: string; nom?: string; identifiant?: string; email?: string; nomEtablissement?: string;
}, customToken: string) {
  const uid = `ed_${account.codeOgec}_${account.id}`;
  return { customToken, user: {
    uid,
    displayName: [account.prenom, account.nom].filter(Boolean).join(" ") || account.identifiant || "Élève",
    email: account.email || null,
    schoolId: account.codeOgec,
    schoolName: account.nomEtablissement || "Établissement",
    edStudentId: account.id,
  }};
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { identifiant?: string; motdepasse?: string };
    if (!body.identifiant?.trim() || !body.motdepasse) {
      return NextResponse.json({ error: "Identifiant et mot de passe requis." }, { status: 400 });
    }
    const result = await login(body.identifiant.trim(), body.motdepasse);
    if (result.kind === "qcm") {
      return NextResponse.json({
        requiresQcm: true,
        pendingToken: result.token,
        question: result.question,
        propositions: result.propositions,
      });
    }

    const account = result.account;
    const uid = `ed_${account.codeOgec}_${account.id}`;
    const customToken = await adminAuth().createCustomToken(uid, {
      role: "student",
      schoolId: account.codeOgec,
      edStudentId: String(account.id),
      edAccountType: account.typeCompte,
    });
    const response = NextResponse.json(responseFor(account, customToken));
    response.cookies.set("c_cool_ed_token", result.token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("c_cool_ed_student", String(account.id), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("c_cool_ed_school", account.codeOgec, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    return response;
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number((error as { status: number }).status) : 502;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Connexion EcoleDirecte impossible." }, { status: status >= 400 && status < 600 ? status : 502 });
  }
}
