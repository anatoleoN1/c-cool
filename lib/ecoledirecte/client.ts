import type {
  EcoleDirecteAccount,
  EcoleDirecteEnvelope,
  EcoleDirecteHomeworkDetail,
  EcoleDirecteHomeworkIndex,
  EcoleDirecteScheduleItem,
} from "./types";

const BASE_URL = "https://api.ecoledirecte.com/v3";
const API_VERSION = process.env.ECOLEDIRECTE_API_VERSION || "4.96.3";

const USER_AGENT =
  process.env.ECOLEDIRECTE_USER_AGENT ||
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";

export class EcoleDirecteError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly status = 502,
  ) {
    super(message);
  }
}

type EcoleDirecteSession = {
  gtk: string;
  cookie: string;
  twoFaToken?: string;
  xToken?: string;
};

type EcoleDirecteResponse<T> = {
  body: EcoleDirecteEnvelope<T>;
  session: Partial<EcoleDirecteSession>;
};

function decodeBase64(value: string | undefined): string {
  if (!value) return "";

  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return value;
  }
}

/**
 * Récupère tous les Set-Cookie sans jamais les afficher.
 */
function getSetCookies(response: Response): string[] {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }

  const header = response.headers.get("set-cookie");
  return header ? [header] : [];
}

/**
 * Transforme les Set-Cookie en header Cookie utilisable
 * par la requête suivante.
 */
function cookiesFromResponse(response: Response): string {
  return getSetCookies(response)
    .map((cookie) => cookie.split(";", 1)[0])
    .filter(Boolean)
    .join("; ");
}

/**
 * Fusionne les nouveaux cookies avec ceux déjà connus.
 *
 * ÉcoleDirecte utilise parfois un cookie dont le nom est opaque.
 * On conserve donc le couple nom=valeur sans jamais supposer
 * le nom du cookie.
 */
function mergeCookies(
  current: string | undefined,
  response: Response,
): string {
  const jar = new Map<string, string>();

  for (const cookie of current?.split(";") ?? []) {
    const separator = cookie.indexOf("=");

    if (separator <= 0) continue;

    const name = cookie.slice(0, separator).trim();
    const value = cookie.slice(separator + 1).trim();

    if (name) {
      jar.set(name, value);
    }
  }

  for (const cookie of getSetCookies(response)) {
    const pair = cookie.split(";", 1)[0];
    const separator = pair.indexOf("=");

    if (separator <= 0) continue;

    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();

    if (name) {
      jar.set(name, value);
    }
  }

  return [...jar.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function extractGtk(response: Response): string | null {
  const cookies = getSetCookies(response);

  for (const cookie of cookies) {
    const match = cookie.match(/(?:^|;\s*)GTK=([^;]+)/i);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function readResponse<T>(
  response: Response,
  previousCookie?: string,
): Promise<EcoleDirecteResponse<T>> {
  let body: EcoleDirecteEnvelope<T>;

  try {
    body = (await response.json()) as EcoleDirecteEnvelope<T>;
  } catch {
    throw new EcoleDirecteError(
      "EcoleDirecte a renvoyé une réponse invalide.",
      undefined,
      502,
    );
  }

  if (!response.ok) {
    throw new EcoleDirecteError(
      "EcoleDirecte est indisponible.",
      undefined,
      502,
    );
  }

  const session: Partial<EcoleDirecteSession> = {};

  const xToken = response.headers.get("X-Token");
  const twoFaToken = response.headers.get("2FA-Token");

  if (xToken) {
    session.xToken = xToken;
  }

  if (twoFaToken) {
    session.twoFaToken = twoFaToken;
  }

  const mergedCookie = mergeCookies(previousCookie, response);

  if (mergedCookie) {
    session.cookie = mergedCookie;
  }

  return {
    body,
    session,
  };
}

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT";
    xToken?: string;
    twoFaToken?: string;
    gtk?: string;
    cookie?: string;
    data?: unknown;
    query?: Record<string, string>;
  } = {},
): Promise<EcoleDirecteResponse<T>> {
  const url = new URL(`${BASE_URL}${path}`);

  url.searchParams.set("v", API_VERSION);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const headers: HeadersInit = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  };

  if (options.xToken) {
    headers["X-Token"] = options.xToken;
  }

  if (options.twoFaToken) {
    headers["2FA-Token"] = options.twoFaToken;
  }

  if (options.gtk) {
    headers["X-Gtk"] = options.gtk;
  }

  if (options.cookie) {
    headers["Cookie"] = options.cookie;
  }

  let body: string | undefined;

  if (options.data !== undefined) {
    headers["Content-Type"] =
      "application/x-www-form-urlencoded;charset=UTF-8";

    body = `data=${encodeURIComponent(JSON.stringify(options.data))}`;
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body,
    cache: "no-store",
  });

  return readResponse<T>(response, options.cookie);
}

async function bootstrap(): Promise<{
  gtk: string;
  cookie: string;
}> {
  const response = await fetch(
    `${BASE_URL}/login.awp?gtk=1&v=${encodeURIComponent(API_VERSION)}`,
    {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new EcoleDirecteError(
      "EcoleDirecte n'a pas accepté le bootstrap GTK.",
      undefined,
      502,
    );
  }

  const gtk = extractGtk(response);
  const cookie = cookiesFromResponse(response);

  if (!gtk || !cookie) {
    throw new EcoleDirecteError(
      "EcoleDirecte n’a pas fourni les informations GTK nécessaires.",
    );
  }

  return { gtk, cookie };
}

function selectAccount(
  accounts: EcoleDirecteAccount[],
): EcoleDirecteAccount {
  const account =
    accounts.find((item) => item.typeCompte === "E") ||
    accounts[0];

  if (!account) {
    throw new EcoleDirecteError(
      "Aucun compte élève n’a été renvoyé par EcoleDirecte.",
      undefined,
      401,
    );
  }

  return account;
}

export type EcoleDirecteLoginResult =
  | {
      kind: "success";
      token: string;
      account: EcoleDirecteAccount;
    }
  | {
      kind: "qcm";
      token: string;
      twoFaToken: string;
      cookie: string;
      question: string;
      propositions: Array<{
        encoded: string;
        label: string;
      }>;
    };

export async function login(
  identifiant: string,
  motdepasse: string,
): Promise<EcoleDirecteLoginResult> {
  const initial = await bootstrap();

  const result = await request<{
    accounts: EcoleDirecteAccount[];
  }>("/login.awp", {
    method: "POST",
    gtk: initial.gtk,
    cookie: initial.cookie,
    data: {
      identifiant,
      motdepasse,
      isRelogin: false,
      uuid: "",
    },
  });

  const token = result.body.token || "";
  const twoFaToken = result.session.twoFaToken || "";

  if (result.body.code === 250) {
    if (!token || !twoFaToken) {
      throw new EcoleDirecteError(
        "EcoleDirecte a demandé une vérification mais n’a pas fourni le jeton 2FA nécessaire.",
        result.body.code,
        401,
      );
    }

    let cookie = result.session.cookie || initial.cookie;

    /**
     * Récupération du QCM.
     *
     * Le comportement validé par notre diagnostic est :
     * JSON token → header 2FA-Token + cookies.
     */
    const challenge = await request<{
      question: string;
      propositions: string[];
    }>("/connexion/doubleauth.awp", {
      method: "GET",
      twoFaToken,
      cookie,
      data: {},
    });

    cookie = challenge.session.cookie || cookie;

    const currentTwoFaToken =
      challenge.session.twoFaToken || twoFaToken;

    return {
      kind: "qcm",
      token,
      twoFaToken: currentTwoFaToken,
      cookie,
      question: decodeBase64(challenge.body.data?.question),
      propositions: (
        challenge.body.data?.propositions || []
      ).map((encoded) => ({
        encoded,
        label: decodeBase64(encoded),
      })),
    };
  }

  if (
    result.body.code !== 200 ||
    !token ||
    !result.body.data?.accounts?.length
  ) {
    throw new EcoleDirecteError(
      result.body.message ||
        "Identifiant ou mot de passe invalide.",
      result.body.code,
      401,
    );
  }

  return {
    kind: "success",
    token,
    account: selectAccount(result.body.data.accounts),
  };
}

export async function completeQcm(
  identifiant: string,
  motdepasse: string,
  pendingToken: string,
  pendingTwoFaToken: string,
  pendingCookie: string,
  encodedChoice: string,
): Promise<{
  token: string;
  account: EcoleDirecteAccount;
}> {
  /**
   * Étape 1 : réponse au QCM.
   *
   * On utilise exactement la combinaison qui vient
   * d’être validée par ed-diag-qcm-v3 :
   *
   * 2FA-Token courant + cookies courants.
   */
  const answer = await request<{
    cn: string;
    cv: string;
  }>("/connexion/doubleauth.awp", {
    method: "POST",
    twoFaToken: pendingTwoFaToken,
    cookie: pendingCookie,
    data: {
      choix: encodedChoice,
    },
  });

  if (
    answer.body.code !== 200 ||
    !answer.body.data?.cn ||
    !answer.body.data?.cv
  ) {
    throw new EcoleDirecteError(
      answer.body.message || "Réponse QCM refusée.",
      answer.body.code,
      401,
    );
  }

  /**
   * Étape 2 : nouveau bootstrap GTK avant le login final.
   */
  const initial = await bootstrap();

  /**
   * Certains environnements font tourner les tokens/cookies
   * pendant la séquence 2FA. On utilise donc les nouvelles
   * informations retournées par le bootstrap pour le login final.
   */
  const result = await request<{
    accounts: EcoleDirecteAccount[];
  }>("/login.awp", {
    method: "POST",
    gtk: initial.gtk,
    cookie: initial.cookie,
    data: {
      identifiant,
      motdepasse,
      isRelogin: false,
      uuid: "",

      // Format documenté.
      cn: answer.body.data.cn,
      cv: answer.body.data.cv,

      // Format actuellement utilisé par les implémentations
      // récentes et accepté par notre flux validé.
      fa: [
        {
          cn: answer.body.data.cn,
          cv: answer.body.data.cv,
          uniq: false,
        },
      ],
    },
  });

  if (
    result.body.code !== 200 ||
    !result.body.token ||
    !result.body.data?.accounts?.length
  ) {
    throw new EcoleDirecteError(
      result.body.message ||
        "La seconde connexion EcoleDirecte a échoué.",
      result.body.code,
      401,
    );
  }

  return {
    token: result.body.token,
    account: selectAccount(result.body.data.accounts),
  };
}

export function getSchedule(
  token: string,
  studentId: number,
  dateStart: string,
  dateEnd: string,
) {
  return request<EcoleDirecteScheduleItem[]>(
    `/E/${studentId}/emploidutemps.awp`,
    {
      method: "POST",
      xToken: token,
      data: {
        dateDebut: dateStart,
        dateFin: dateEnd,
        avecTrous: false,
      },
    },
  );
}

export function getHomeworkIndex(
  token: string,
  studentId: number,
) {
  return request<EcoleDirecteHomeworkIndex>(
    `/Eleves/${studentId}/cahierdetexte.awp`,
    {
      method: "GET",
      xToken: token,
    },
  );
}

export function getHomeworkDetail(
  token: string,
  studentId: number,
  date: string,
) {
  return request<EcoleDirecteHomeworkDetail>(
    `/Eleves/${studentId}/cahierdetexte/${date}.awp`,
    {
      method: "GET",
      xToken: token,
    },
  );
}
