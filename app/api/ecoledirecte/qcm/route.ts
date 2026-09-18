import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { completeQcm } from "@/lib/ecoledirecte/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { identifiant?: string; motdepasse?: string; choice?: string };
    const pendingToken = (await cookies()).get("c_cool_ed_pending_token")?.value;
    if (!body.identifiant || !body.motdepasse || !pendingToken || !body.choice) {
      return NextResponse.json({ error: "Données QCM incomplètes." }, { status: 400 });
    }

    const result = await completeQcm(body.identifiant, body.motdepasse, pendingToken, body.choice);
    const account = result.account;
    const uid = `ed_${account.codeOgec}_${account.id}`;
    const customToken = await adminAuth().createCustomToken(uid, {
      role: "student",
      schoolId: account.codeOgec,
      edStudentId: String(account.id),
      edAccountType: account.typeCompte,
    });

    const response = NextResponse.json({
      customToken,
      user: {
        uid,
        displayName: [account.prenom, account.nom].filter(Boolean).join(" ") || account.identifiant || "Élève",
        email: account.email || null,
        schoolId: account.codeOgec,
        schoolName: account.nomEtablissement || "Établissement",
        edStudentId: account.id,
      },
    });

    response.cookies.set("c_cool_ed_pending_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
    response.cookies.set("c_cool_ed_token", result.token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("c_cool_ed_student", String(account.id), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("c_cool_ed_school", account.codeOgec, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Validation QCM impossible." }, { status: 401 });
  }
}
