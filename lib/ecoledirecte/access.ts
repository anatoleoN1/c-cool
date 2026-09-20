import type { EcoleDirecteAccount } from "./types";

export type CcoolAccess = {
  allowed: boolean;
  isAdmin: boolean;
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

function isAdminAccount(account: EcoleDirecteAccount): boolean {
  const uid = `ed_${account.codeOgec}_${account.id}`;
  const ids = csv("CCOOL_ADMIN_ED_IDS");
  const uids = csv("CCOOL_ADMIN_UIDS");
  const emails = csv("CCOOL_ADMIN_EMAILS").map(normalize);

  return (
    ids.includes(String(account.id)) ||
    uids.includes(uid) ||
    (!!account.email && emails.includes(normalize(account.email)))
  );
}

function matchesConfiguredClass(code: string, label: string): boolean {
  const configured = csv("CCOOL_ALLOWED_CLASS");
  if (configured.length === 0) {
    return normalize(label).includes("2nde5") || normalize(code) === "2nd5";
  }

  const normalizedCode = normalize(code);
  const normalizedLabel = normalize(label);

  return configured.some((expected) => {
    const normalizedExpected = normalize(expected);
    return (
      normalizedExpected === normalizedCode ||
      normalizedExpected === normalizedLabel ||
      normalizedLabel.includes(normalizedExpected) ||
      normalizedCode.includes(normalizedExpected)
    );
  });
}

function matchesConfiguredSchool(
  schoolId: string,
  schoolName: string,
): boolean {
  const configured = csv("CCOOL_ALLOWED_SCHOOL");
  if (configured.length === 0) {
    return normalize(schoolName).includes("paulclaudeldhulst") ||
      normalize(schoolName).includes("paulclaudel") ||
      normalize(schoolName) === "pch";
  }

  const normalizedId = normalize(schoolId);
  const normalizedName = normalize(schoolName);

  return configured.some((expected) => {
    const normalizedExpected = normalize(expected);
    return (
      normalizedExpected === normalizedId ||
      normalizedExpected === normalizedName ||
      normalizedName.includes(normalizedExpected)
    );
  });
}

export function evaluateEcoleDirecteAccess(
  account: EcoleDirecteAccount,
): CcoolAccess {
  const profile = account.profile;
  const schoolName = profile?.nomEtablissement || account.nomEtablissement || "";
  const schoolId =
    profile?.rneEtablissement ||
    account.codeOgec ||
    "";
  const classCode = profile?.classe?.code || "";
  const classLabel = profile?.classe?.libelle || "";

  const isAdmin = isAdminAccount(account);
  const allowed =
    isAdmin ||
    (matchesConfiguredSchool(schoolId, schoolName) &&
      matchesConfiguredClass(classCode, classLabel));

  return {
    allowed,
    isAdmin,
    schoolName,
    schoolId,
    classCode,
    classLabel,
  };
}

export function accessDeniedMessage(): string {
  return "C-Cool est actuellement réservé aux élèves de 2nde 5 de PCH.";
}
