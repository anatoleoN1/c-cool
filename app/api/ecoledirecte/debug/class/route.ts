import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  const schoolCode = cookieStore.get("c_cool_ed_school")?.value || "";
  const schoolName = cookieStore.get("c_cool_ed_school_name")?.value || "";
  const schoolId = cookieStore.get("c_cool_ed_school_id")?.value || "";
  const schoolRne = cookieStore.get("c_cool_ed_school_rne")?.value || "";
  const classIdRaw = cookieStore.get("c_cool_ed_class_id")?.value || "";
  const classCode = cookieStore.get("c_cool_ed_class_code")?.value || "";
  const className = cookieStore.get("c_cool_ed_class_name")?.value || "";

  return NextResponse.json({
    etablissement: {
      nom: schoolName || null,
      code: schoolCode || null,
      id: schoolId || null,
      rne: schoolRne || null,
    },
    classe: {
      nom: className || null,
      code: classCode || null,
      id: classIdRaw ? Number(classIdRaw) : null,
    },
  });
}
