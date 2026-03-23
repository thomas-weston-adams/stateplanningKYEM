export type PlanStatus = "current" | "due-soon" | "overdue" | "not-submitted";

export type PlanType = "CEMP" | "HMP" | "EOP" | "AAR" | "CAP" | "TRAINING";

export type Region =
  | "Purchase"
  | "Pennyrile"
  | "Green River"
  | "South-Central"
  | "Bluegrass"
  | "Northern KY"
  | "Northeastern KY"
  | "Eastern KY"
  | "Southeastern KY"
  | "Metro Louisville";

export interface Official {
  name: string;
  title: string;
  phone: string;
  email: string;
}

export interface CountyPlan {
  type: PlanType;
  label: string;
  lastSubmitted: string | null; // ISO date or null
  expirationDate: string | null;
  status: PlanStatus;
  fileId?: string;
}

export interface County {
  fips: string;
  name: string;
  status: PlanStatus; // overall / worst status
  region: Region;
  director: Official;
  plans: CountyPlan[];
  lastCommunication: string | null; // ISO date
  notes?: string;
}

export interface PlanDocument {
  id: string;
  countyFips: string;
  countyName: string;
  type: PlanType;
  label: string;
  year: number;
  submittedDate: string;
  expirationDate: string;
  status: PlanStatus;
  fileSize: string;
  description: string;
}
