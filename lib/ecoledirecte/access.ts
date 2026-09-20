import type { EcoleDirecteAccount } from "./types";

export type CcoolAccess = {
  allowed: boolean;
  isAdmin: boolean;
  role: "student" | "moderator" | "admin";
  schoolName: string;
  schoolId: string;
  classCode: string;
  classLabel: string;
};

function normalize(value: string | undefined): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function csv(name: string): string[] {
  return (process.env[name] || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getConfiguredRoleForUid(
  uid: string,
  email?: string | null,
): "student" | "moderator" | "admin" {
  const ids = uid.startsWith("ed_")
    ? uid.slice(uid.lastIndexOf("_") + 1)
    : "";
  const normalizedEmail = email ? normalize(email) : "";

  const adminIds = csv("CCOOL_ADMIN_ED_IDS");
  const adminUids = csv("CCOOL_ADMIN_UIDS");
  const adminEmails = csv("CCOOL_ADMIN_EMAILS").map(normalize);

  if (
    (ids && adminIds.includes(ids)) ||
    adminUids.includes(uid) ||
    (!!normalizedEmail && adminEmails.includes(normalizedEmail))
  ) {
    return "admin";
  }

  const moderatorIds = csv("CCOOL_MODERATOR_ED_IDS");
  if ((ids && moderatorIds.includes(ids)) || moderatorIds.includes(uid)) {
    return "moderator";
  }

  return "student";
}

function matchesConfiguredClass(classId: number | undefined): boolean {
  const configured = csv("CCOOL_ALLOWED_CLASS_ID");
  if (configured.length === 0) return false;
  return configured.includes(String(classId ?? ""));
}

function matchesConfiguredSchool(rne: string): boolean {
  const configured = csv("CCOOL_ALLOWED_SCHOOL_RNE");
  if (configured.length === 0) return false;
  return configured.includes(rne);
}

export function evaluateConfiguredAccess(
  uid: string,
  schoolRne: string,
  classId: number | undefined,
  email?: string | null,
  schoolName = "",
  classCode = "",
  classLabel = "",
): CcoolAccess {
  const role = getConfiguredRoleForUid(uid, email);
  const isAdmin = role === "admin";
  const allowed =
    role !== "student" ||
    (matchesConfiguredSchool(schoolRne) &&
      matchesConfiguredClass(classId));

  return {
    allowed,
    isAdmin,
    role,
    schoolName,
    schoolId: schoolRne,
    classCode,
    classLabel,
  };
}

export function evaluateEcoleDirecteAccess(
  account: EcoleDirecteAccount,
): CcoolAccess {
  const profile = account.profile;
  const schoolName = profile?.nomEtablissement || account.nomEtablissement || "";
  const schoolId = profile?.rneEtablissement || "";
  const classId = profile?.classe?.id;
  const classCode = profile?.classe?.code || "";
  const classLabel = profile?.classe?.libelle || "";

  return evaluateConfiguredAccess(
    `ed_${account.codeOgec}_${account.id}`,
    schoolId,
    classId,
    account.email,
    schoolName,
    classCode,
    classLabel,
  );
}

export function accessDeniedMessage(): string {
  return "C-Cool est actuellement réservé aux élèves de 2nde 5 de PCH.";
}
