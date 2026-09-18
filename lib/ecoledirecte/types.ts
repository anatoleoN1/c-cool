export type EcoleDirecteAccount = {
  id: number;
  uid?: string;
  typeCompte: string;
  codeOgec: string;
  identifiant?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  anneeScolaireCourante?: string;
  nomEtablissement?: string;
  logoEtablissement?: string;
  modules?: Array<{ code: string; enable: boolean; params?: Record<string, string> }>;
};

export type EcoleDirecteEnvelope<T> = {
  code: number;
  token?: string;
  message?: string | null;
  data: T;
};

export type EcoleDirecteScheduleItem = {
  id: number;
  text?: string;
  matiere?: string;
  codeMatiere?: string;
  typeCours?: string;
  start_date: string;
  end_date: string;
  color?: string;
  prof?: string;
  salle?: string;
  classe?: string;
  classeId?: number;
  groupe?: string;
  groupeCode?: string;
  isFlexible?: boolean;
  isModifie?: boolean;
  isAnnule?: boolean;
  contenuDeSeance?: boolean;
  devoirAFaire?: boolean;
};

export type EcoleDirecteHomeworkIndex = Record<string, Array<{
  matiere?: string;
  codeMatiere?: string;
  aFaire?: boolean;
  idDevoir: number;
  documentsAFaire?: boolean;
  donneLe?: string;
  effectue?: boolean;
  interrogation?: boolean;
  rendreEnLigne?: boolean;
}>>;

export type EcoleDirecteHomeworkDetail = {
  date: string;
  matieres?: Array<{
    matiere?: string;
    codeMatiere?: string;
    aFaire?: Array<{
      id?: number;
      idDevoir?: number;
      contenu?: string;
      donneLe?: string;
      documents?: unknown[];
    }>;
    contenuDeSeance?: {
      idDevoir?: number;
      contenu?: string;
      documents?: unknown[];
    };
  }>;
  [key: string]: unknown;
};
