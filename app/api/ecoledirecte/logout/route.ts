import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  for (const name of ["c_cool_ed_token", "c_cool_ed_student", "c_cool_ed_school", "c_cool_ed_school_name", "c_cool_ed_school_id", "c_cool_ed_school_rne", "c_cool_ed_class_id", "c_cool_ed_class_code", "c_cool_ed_class_name", "c_cool_ed_role", "c_cool_ed_account_type", "c_cool_ed_pending_token", "c_cool_ed_pending_2fa", "c_cool_ed_pending_cookie"]) {
    response.cookies.set(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  }
  return response;
}
