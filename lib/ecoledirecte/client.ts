"use server";

import type {
  EcoleDirecteAccount,
  EcoleDirecteEnvelope,
  EcoleDirecteHomeworkDetail,
  EcoleDirecteHomeworkIndex,
  EcoleDirecteScheduleItem,
} from "./types";

const BASE_URL = "https://api.ecoledirecte.com/v3";
const API_VERSION = process.env.ECOLEDIRECTE_API_VERSION || "7.12.1";
const USER_AGENT =
  process.env.ECOLEDIRECTE_USER_AGENT ||
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

export class EcoleDirecteError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly status = 502,
  ) {
    super(message);
  }
}

function decodeBase64(value: string | undefined): string {
  if (!value) return "";
  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return value;
  }
}

async function readJson<T>(response: Response): Promise<EcoleDirecteEnvelope<T>> {
  const body = (await response.json()) as EcoleDirecteEnvelope<T>;
  if (!response.ok) throw new EcoleDirecteError("EcoleDirecte est indisponible.", undefined, 502);
  return body;
}

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT";
    token?: string;
    gtk?: string;
    data?: unknown;
  } = {},
): Promise<EcoleDirecteEnvelope<T>> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("v", API_VERSION);

  const headers: HeadersInit = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  };
  if (options.token) headers["X-Token"] = options.token;
  if (options.gtk) headers["X-Gtk"] = options.gtk;

  let body: string | undefined;
  if (options.data !== undefined) {
    headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    body = `data=${encodeURIComponent(JSON.stringify(options.data))}`;
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body,
    cache: "no-store",
  });

  return readJson<T>(response);
}

function extractGtk(response: Response): string | null {
  const cookie = response.headers.get("set-cookie") || "";
  const match = cookie.match(/(?:^|[,;\\s])GTK=([^;]+)/i);
  return match?.[1] ?? null;
}

export async function login(
  identifiant: string,
  motdepasse: string,
): Promise<
  | { kind: "success"; token: string; account: EcoleDirecteAccount }
  | { kind: "qcm"; token: string; question: string; propositions: Array<{ encoded: string; label: string }> }
> {
  const gtkResponse = await fetch(
    `${BASE_URL}/login.awp?gtk=1&v=${encodeURIComponent(API_VERSION)}`,
    { headers: { "User-Agent": USER_AGENT }, cache: "no-store" },
  );
  const gtk = extractGtk(gtkResponse);
  if (!gtk) throw new EcoleDirecteError("EcoleDirecte n’a pas fourni le cookie GTK.");

  const result = await request<{ accounts: EcoleDirecteAccount[] }>(
    `/login.awp?isRelogin=0`,
    {
      method: "POST",
      gtk,
      data: { identifiant, motdepasse, isRelogin: false, uuid: "" },
    },
  );

  if (result.code === 250) {
    const challenge = await request<{ question: string; propositions: string[] }>(
      "/connexion/doubleauth.awp",
      { method: "POST", token: result.token, data: {} },
    );
    return {
      kind: "qcm",
      token: result.token || "",
      question: decodeBase64(challenge.data.question),
      propositions: (challenge.data.propositions || []).map((encoded) => ({ encoded, label: decodeBase64(encoded) })),
    };
  }

  if (result.code !== 200 || !result.token || !result.data?.accounts?.length) {
    throw new EcoleDirecteError(result.message || "Identifiant ou mot de passe invalide.", result.code, 401);
  }

  const account =
    result.data.accounts.find((item) => item.typeCompte === "E") ||
    result.data.accounts[0];

  return { kind: "success", token: result.token, account };
}

export async function completeQcm(
  identifiant: string,
  motdepasse: string,
  pendingToken: string,
  encodedChoice: string,
): Promise<{ token: string; account: EcoleDirecteAccount }> {
  const answer = await request<{ cn: string; cv: string }>(
    "/connexion/doubleauth.awp",
    { method: "POST", token: pendingToken, data: { choix: encodedChoice } },
  );

  if (answer.code !== 200 || !answer.data?.cn || !answer.data?.cv) {
    throw new EcoleDirecteError(answer.message || "Réponse QCM refusée.", answer.code, 401);
  }

  const gtkResponse = await fetch(
    `${BASE_URL}/login.awp?gtk=1&v=${encodeURIComponent(API_VERSION)}`,
    { headers: { "User-Agent": USER_AGENT }, cache: "no-store" },
  );
  const gtk = extractGtk(gtkResponse);
  if (!gtk) throw new EcoleDirecteError("EcoleDirecte n’a pas fourni le cookie GTK.");

  const result = await request<{ accounts: EcoleDirecteAccount[] }>(
    "/login.awp",
    {
      method: "POST",
      gtk,
      data: {
        identifiant,
        motdepasse,
        isRelogin: false,
        uuid: "",
        fa: [{ cn: answer.data.cn, cv: answer.data.cv }],
      },
    },
  );

  if (result.code !== 200 || !result.token || !result.data?.accounts?.length) {
    throw new EcoleDirecteError(result.message || "La seconde connexion EcoleDirecte a échoué.", result.code, 401);
  }

  const account =
    result.data.accounts.find((item) => item.typeCompte === "E") ||
    result.data.accounts[0];

  return { token: result.token, account };
}

export function getSchedule(token: string, studentId: number, dateStart: string, dateEnd: string) {
  return request<EcoleDirecteScheduleItem[]>(
    `/E/${studentId}/emploidutemps.awp`,
    { method: "POST", token, data: { dateDebut: dateStart, dateFin: dateEnd, avecTrous: false } },
  );
}

export function getHomeworkIndex(token: string, studentId: number) {
  return request<EcoleDirecteHomeworkIndex>(
    `/Eleves/${studentId}/cahierdetexte.awp`,
    { method: "GET", token },
  );
}

export function getHomeworkDetail(token: string, studentId: number, date: string) {
  return request<EcoleDirecteHomeworkDetail>(
    `/Eleves/${studentId}/cahierdetexte/${date}.awp`,
    { method: "GET", token },
  );
}
