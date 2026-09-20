import { NextResponse } from "next/server";
import { adminAuth, adminDb, refreshEcoleDirecteClaims } from "@/lib/firebase/admin";
import { evaluateConfiguredAccess } from "@/lib/ecoledirecte/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    }

    const decoded = await adminAuth().verifyIdToken(match[1]);
    const profileSnapshot = await adminDb().collection("users").doc(decoded.uid).get();
    const profile = profileSnapshot.exists ? profileSnapshot.data() : undefined;

    const schoolRne =
      typeof decoded.schoolRne === "string"
        ? decoded.schoolRne
        : typeof profile?.schoolRne === "string"
          ? profile.schoolRne
          : "";

    const classId =
      typeof profile?.classId === "number"
        ? profile.classId
        : undefined;

    const schoolId =
      typeof decoded.schoolId === "string"
        ? decoded.schoolId
        : typeof profile?.activeSchoolIds?.[0] === "string"
          ? profile.activeSchoolIds[0]
          : "";

    const edStudentId =
      typeof decoded.edStudentId === "string"
        ? decoded.edStudentId
        : "";

    const edAccountType =
      typeof decoded.edAccountType === "string"
        ? decoded.edAccountType
        : "E";

    if (!schoolId || !edStudentId) {
      return NextResponse.json(
        { error: "Informations de compte C-Cool incomplètes." },
        { status: 401 },
      );
    }

    const access = evaluateConfiguredAccess(
      decoded.uid,
      schoolRne,
      classId,
      typeof decoded.email === "string" ? decoded.email : null,
      typeof profile?.schoolName === "string" ? profile.schoolName : "",
      typeof profile?.classCode === "string" ? profile.classCode : "",
      typeof profile?.className === "string" ? profile.className : "",
    );

    await refreshEcoleDirecteClaims({
      uid: decoded.uid,
      schoolId,
      schoolRne,
      edStudentId,
      edAccountType,
      accessGranted: access.allowed,
      role: access.role,
    });

    const response = NextResponse.json({
      ok: true,
      role: access.role,
      accessGranted: access.allowed,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 604800,
    };

    response.cookies.set("c_cool_ed_role", access.role, cookieOptions);

    return response;
  } catch {
    return NextResponse.json(
      { error: "Impossible d'actualiser les autorisations." },
      { status: 401 },
    );
  }
}
