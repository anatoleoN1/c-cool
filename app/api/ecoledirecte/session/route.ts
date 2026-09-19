import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getHomeworkDetail, getHomeworkIndex, getSchedule } from "@/lib/ecoledirecte/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getSession() {
  const jar = await cookies();
  const token = jar.get("c_cool_ed_token")?.value;
  const studentId = Number(jar.get("c_cool_ed_student")?.value);
  if (!token || !Number.isInteger(studentId) || studentId <= 0) {
    throw new Error("Session EcoleDirecte absente.");
  }
  return { token, studentId };
}

export async function GET(request: Request) {
  try {
    const { token, studentId } = await getSession();
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind");

    if (kind === "schedule") {
      const start = url.searchParams.get("start");
      const end = url.searchParams.get("end");
      if (!start || !end) return NextResponse.json({ error: "Dates requises." }, { status: 400 });
      const result = await getSchedule(token, studentId, start, end);
      return NextResponse.json(result.body);
    }

    if (kind === "homework") {
      const result = await getHomeworkIndex(token, studentId);
      return NextResponse.json(result.body);
    }

    if (kind === "homework-detail") {
      const date = url.searchParams.get("date");
      if (!date) return NextResponse.json({ error: "Date requise." }, { status: 400 });
      const result = await getHomeworkDetail(token, studentId, date);
      return NextResponse.json(result.body);
    }

    return NextResponse.json({ error: "Ressource inconnue." }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Session EcoleDirecte indisponible." },
      { status: 401 },
    );
  }
}
