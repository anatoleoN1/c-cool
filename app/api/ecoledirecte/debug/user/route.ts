import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("c_cool_ed_token")?.value || "";

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session C-Cool absente." },
      { status: 401 },
    );
  }

  const role = cookieStore.get("c_cool_ed_role")?.value || "student";
  const accountType = cookieStore.get("c_cool_ed_account_type")?.value || "E";

  return NextResponse.json({
    connecte: true,
    compte: {
      type: accountType === "E" ? "eleve" : "ecole-directe",
      role:
        role === "admin" || role === "moderator"
          ? role
          : "student",
      autorisation:
        role === "admin" || role === "moderator" ? "accordee" : "eleve",
    },
  });
}
