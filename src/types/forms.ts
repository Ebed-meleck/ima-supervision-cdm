export interface BaseFormData {
  end: string;
  __id: string;
  meta: {
    instanceID: string;
    instanceName: string;
  };
  start: string;
  __system: {
    edits: number;
    status: string | null;
    deviceId: string;
    updatedAt: string | null;
    formVersion: string;
    reviewState: string | null;
    submitterId: string;
    submitterName: string;
    submissionDate: string;
    attachmentsPresent: number;
    attachmentsExpected: number;
  };
  device_id: string;
  commentaire_n: string;
  ecran_accueil: string | null;
}

/**  Type 1 : Supervision des superviseurs */
export interface SupervisionFormData extends BaseFormData {
  merci: string | null;
  constat_com: Record<"q15" | "q16" | "q17" | "q18", "oui" | "non">;
  constat_log: Record<"q19" | "q20" | "q21" | "q22" | "q23" | "q24" | "q25", "oui" | "non">;
  constat_tech: Record<`q${number}`, "oui" | "non">;
  information: {
    nbr_as: number;
    nom_mcz: string;
    men_micro: number;
    pop_micro: number;
    nbre_pers_renc: number;
    pers_zs_repeat_count: string;
    "pers_zs_repeat@odata.navigationLink": string;
  };
  identification: {
    noms: {
      nom_superviseur: string;
      prenom_superviseur: string;
    };
    province: string;
    GPS_menage: {
      type: "Point";
      properties: { accuracy: number };
      coordinates: [number, number, number];
    };
    date_heure: string;
    health_area: string;
    health_zone: string;
  };
}

/** 🧩 Type 2 : Supervision des RECO */
export interface RecoFormData extends BaseFormData {
  thanks: string | null;
  technique: {
    q1_n: "oui" | "non";
    q2_n: "oui" | "non";
    q3_n: "oui" | "non";
    q4_n: "oui" | "non";
    q5_n: "oui" | "non";
    q6_n: "oui" | "non";
    q7_n: "oui" | "non";
    q8_n: "oui" | "non";
    q9_n: "oui" | "non";
    q10_n: "oui" | "non";
    name_reco_n: string;
    name_superviseur_n: string;
  };
  logistique: {
    q16_n: "oui" | "non";
    q17_n: "oui" | "non";
    q18_n: "oui" | "non";
    q19_n: "oui" | "non";
    q20_n: "oui" | "non";
    q20_n_non?: string;
  };
  Mobilisation: {
    q10_n: "oui" | "non";
    q12_n: "oui" | "non";
    q13_n: "oui" | "non";
    q14_n: "oui" | "non";
    q15_n: "oui" | "non";
  };
  identification: {
    gps: {
      type: "Point";
      properties: { accuracy: number };
      coordinates: [number, number, number];
    };
    village: string;
    province: string;
    date_heure: string;
    health_area: string;
    health_zone: string;
  };
}

export type AnyFormData = SupervisionFormData | RecoFormData;

export interface FormRecord {
  data: AnyFormData;
  odk_instance_id: string;
  form_name: string;
  project_id: number;
}
